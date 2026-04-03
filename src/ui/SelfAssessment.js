import gsap from 'gsap';
import { ASSESSMENT_QUESTIONS, ACTION_CARDS } from './content.js';

/**
 * SelfAssessment — renders a 4-screen questionnaire and displays results.
 */
export class SelfAssessment {
  constructor(onComplete) {
    this.onComplete = onComplete; // callback({ money, time, quality, eq })
    this.container = document.getElementById('assessment-section');
    this.answers = { money: [], time: [], quality: [] , eq: [] };
    this.axisOrder = ['money', 'time', 'quality', 'eq'];
    this.currentAxisIndex = 0;
    this.isComplete = false;

    if (this.container) {
      this._render();
    }
  }

  _render() {
    const questContainer = this.container.querySelector('.assessment-questionnaire');
    if (!questContainer) return;

    // Progress dots
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'assessment-dots';
    this.axisOrder.forEach((key, i) => {
      const dot = document.createElement('div');
      dot.className = 'assessment-dot';
      dot.style.background = i === 0 ? ASSESSMENT_QUESTIONS[key].color : 'rgba(255,255,255,0.15)';
      dot.dataset.axis = key;
      dotsWrap.appendChild(dot);
    });
    questContainer.appendChild(dotsWrap);

    // Question card area
    const cardArea = document.createElement('div');
    cardArea.className = 'assessment-card-area';
    questContainer.appendChild(cardArea);

    this.dotsWrap = dotsWrap;
    this.cardArea = cardArea;

    this._showAxisQuestions(0);
  }

  _showAxisQuestions(axisIndex) {
    this.currentAxisIndex = axisIndex;
    const axisKey = this.axisOrder[axisIndex];
    const axisData = ASSESSMENT_QUESTIONS[axisKey];

    // Update dots
    this.dotsWrap.querySelectorAll('.assessment-dot').forEach((dot, i) => {
      if (i < axisIndex) {
        dot.style.background = ASSESSMENT_QUESTIONS[this.axisOrder[i]].color;
        dot.classList.add('completed');
      } else if (i === axisIndex) {
        dot.style.background = axisData.color;
        dot.classList.add('active');
      } else {
        dot.style.background = 'rgba(255,255,255,0.15)';
        dot.classList.remove('active', 'completed');
      }
    });

    // Build question card
    const card = document.createElement('div');
    card.className = 'assessment-axis-card';

    const axisLabel = document.createElement('div');
    axisLabel.className = 'assessment-axis-label';
    axisLabel.style.color = axisData.color;
    axisLabel.textContent = `${axisData.label} Assessment`;
    card.appendChild(axisLabel);

    axisData.questions.forEach((q, qIdx) => {
      const questionBlock = document.createElement('div');
      questionBlock.className = 'assessment-question';

      const questionText = document.createElement('p');
      questionText.className = 'assessment-question-text';
      questionText.textContent = q.text;
      questionBlock.appendChild(questionText);

      const optionsWrap = document.createElement('div');
      optionsWrap.className = 'assessment-options';

      q.options.forEach(opt => {
        const pill = document.createElement('button');
        pill.className = 'assessment-pill';
        pill.textContent = opt.label;
        pill.dataset.value = opt.value;
        pill.dataset.axis = axisKey;
        pill.dataset.qidx = qIdx;

        // Check if already answered
        if (this.answers[axisKey][qIdx] === opt.value) {
          pill.classList.add('selected');
        }

        pill.addEventListener('click', () => {
          this._selectAnswer(axisKey, qIdx, opt.value, optionsWrap);
        });

        optionsWrap.appendChild(pill);
      });

      questionBlock.appendChild(optionsWrap);
      card.appendChild(questionBlock);
    });

    const navBtn = document.createElement('button');
    navBtn.className = 'assessment-nav-btn';
    navBtn.dataset.axis = axisKey;
    navBtn.textContent = axisIndex < 3 ? 'Next →' : 'See Results';
    navBtn.disabled = true;
    navBtn.addEventListener('click', () => {
      if (axisIndex < 3) {
        this._showAxisQuestions(axisIndex + 1);
      } else {
        this._showResults();
      }
    });
    card.appendChild(navBtn);
    this.navBtn = navBtn;

    // Animate in
    this.cardArea.innerHTML = '';
    this.cardArea.appendChild(card);
    gsap.fromTo(card, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });

    this._checkNavEnabled();
  }

  _selectAnswer(axisKey, qIdx, value, optionsWrap) {
    this.answers[axisKey][qIdx] = value;

    // Update pill states
    optionsWrap.querySelectorAll('.assessment-pill').forEach(p => {
      p.classList.toggle('selected', parseInt(p.dataset.value) === value);
    });

    this._checkNavEnabled();
  }

  _checkNavEnabled() {
    const axisKey = this.axisOrder[this.currentAxisIndex];
    const allAnswered = this.answers[axisKey].length === 3 && this.answers[axisKey].every(a => a !== undefined);
    if (this.navBtn) {
      this.navBtn.disabled = !allAnswered;
    }
  }

  _showResults() {
    this.isComplete = true;

    // Calculate scores
    const scores = {};
    this.axisOrder.forEach(key => {
      const vals = this.answers[key];
      scores[key] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    });

    // Find weakest and strongest
    const weakest = Object.keys(scores).reduce((a, b) => scores[a] < scores[b] ? a : b);
    const strongest = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // Shadow names
    const shadowNames = { money: 'Optionality', time: 'Learning', quality: 'Craft', eq: 'Resilience' };
    const axisNames = { money: 'Money', time: 'Time', quality: 'Quality', eq: 'EQ' };
    const actionContent = ACTION_CARDS[weakest];

    // Build results card
    const card = document.createElement('div');
    card.className = 'assessment-results-card';

    card.innerHTML = `
      <h3 class="assessment-results-title">Your Team's Shape</h3>
      <div class="assessment-scores">
        <div class="assessment-score" style="--score-color: #F59E0B">
          <span class="assessment-score-label">Money</span>
          <span class="assessment-score-value">${scores.money}</span>
          <div class="assessment-score-bar"><div class="assessment-score-fill" style="width: ${scores.money}%; background: #F59E0B"></div></div>
        </div>
        <div class="assessment-score" style="--score-color: #3B82F6">
          <span class="assessment-score-label">Time</span>
          <span class="assessment-score-value">${scores.time}</span>
          <div class="assessment-score-bar"><div class="assessment-score-fill" style="width: ${scores.time}%; background: #3B82F6"></div></div>
        </div>
        <div class="assessment-score" style="--score-color: #14B8A6">
          <span class="assessment-score-label">Quality</span>
          <span class="assessment-score-value">${scores.quality}</span>
          <div class="assessment-score-bar"><div class="assessment-score-fill" style="width: ${scores.quality}%; background: #14B8A6"></div></div>
        </div>
        <div class="assessment-score" style="--score-color: #8B5CF6">
          <span class="assessment-score-label">EQ</span>
          <span class="assessment-score-value">${scores.eq}</span>
          <div class="assessment-score-bar"><div class="assessment-score-fill" style="width: ${scores.eq}%; background: #8B5CF6"></div></div>
        </div>
      </div>
      <div class="assessment-analysis">
        <p>Your weakest axis is <strong style="color: ${ASSESSMENT_QUESTIONS[weakest].color}">${axisNames[weakest]}</strong>. Your strongest is <strong style="color: ${ASSESSMENT_QUESTIONS[strongest].color}">${axisNames[strongest]}</strong>.</p>
        <p class="assessment-shadow-loss">This means you are losing <strong>${shadowNames[weakest]}</strong>.</p>
      </div>
      ${actionContent ? `
        <div class="action-card" style="border-left: 3px solid ${actionContent.icon}">
          <div class="action-card-header">
            <span class="action-dot" style="background: ${actionContent.icon}"></span>
            <h4>${actionContent.heading}</h4>
          </div>
          <ul class="action-list">
            ${actionContent.actions.map((a, i) => `<li>${i === 0 ? `<span class="action-item-with-info">${a}</span>` : a}</li>`).join('')}
          </ul>
          <div class="action-shadow-reminder">${actionContent.shadowReminder}</div>
        </div>
      ` : ''}
      <div class="assessment-buttons">
        <button class="assessment-retake-btn">Retake</button>
      </div>
    `;

    this.cardArea.innerHTML = '';
    this.cardArea.appendChild(card);

    // Animate score bars
    gsap.fromTo(card, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
      onComplete: () => {
        card.querySelectorAll('.assessment-score-fill').forEach((bar, i) => {
          gsap.fromTo(bar, { width: '0%' }, {
            width: bar.style.width, duration: 0.8, delay: i * 0.15, ease: 'power2.out',
          });
        });
      },
    });

    // Bind retake
    card.querySelector('.assessment-retake-btn').addEventListener('click', () => {
      this._retake();
    });

    // Callback with scores
    if (this.onComplete) {
      this.onComplete(scores);
    }
  }

  _retake() {
    this.isComplete = false;
    this.answers = { money: [], time: [], quality: [], eq: [] };
    this.currentAxisIndex = 0;
    this._showAxisQuestions(0);
  }
}
