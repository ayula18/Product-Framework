import gsap from 'gsap';
import { CASE_STUDIES } from './content.js';

/**
 * CaseStudies — renders case study cards and handles click interactions.
 */
export class CaseStudies {
  constructor(onCaseSelect) {
    this.onCaseSelect = onCaseSelect; // callback(caseStudy)
    this.activeCase = null;
    this.container = document.getElementById('casestudy-section');
    if (this.container) {
      this._render();
    }
  }

  _render() {
    const grid = this.container.querySelector('.casestudy-grid');
    if (!grid) return;

    CASE_STUDIES.forEach(cs => {
      const card = document.createElement('div');
      card.className = 'casestudy-card glass-card';
      card.dataset.id = cs.id;

      // Left accent
      const accentColor = cs.isComparative
        ? 'linear-gradient(180deg, #F59E0B, #8B5CF6)'
        : cs.accent;

      card.innerHTML = `
        <div class="casestudy-accent" style="background: ${accentColor}"></div>
        <div class="casestudy-content">
          <h3 class="casestudy-name">${cs.name}</h3>
          <p class="casestudy-oneliner">${cs.oneLiner}</p>
          <div class="casestudy-values">
            <span class="casestudy-val" style="color: #F59E0B">M:${cs.values.money}</span>
            <span class="casestudy-val" style="color: #3B82F6">T:${cs.values.time}</span>
            <span class="casestudy-val" style="color: #14B8A6">Q:${cs.values.quality}</span>
            <span class="casestudy-val" style="color: #8B5CF6">EQ:${cs.values.eq}</span>
          </div>
          ${cs.isComparative ? `
            <div class="casestudy-comparison-label">vs ${cs.comparisonLabel}</div>
            <div class="casestudy-values casestudy-values-muted">
              <span class="casestudy-val">M:${cs.comparisonValues.money}</span>
              <span class="casestudy-val">T:${cs.comparisonValues.time}</span>
              <span class="casestudy-val">Q:${cs.comparisonValues.quality}</span>
              <span class="casestudy-val">EQ:${cs.comparisonValues.eq}</span>
            </div>
          ` : ''}
        </div>
      `;

      card.addEventListener('click', () => this._selectCase(cs));
      grid.appendChild(card);
    });
  }

  _selectCase(cs) {
    this.activeCase = cs;

    // Highlight active card
    this.container.querySelectorAll('.casestudy-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === cs.id);
    });

    // Show back-to-manual button
    let backBtn = this.container.querySelector('.back-to-manual-btn');
    if (!backBtn) {
      backBtn = document.createElement('button');
      backBtn.className = 'back-to-manual-btn';
      backBtn.textContent = '← Back to manual';
      backBtn.addEventListener('click', () => this.clearCase());
      this.container.querySelector('.casestudy-grid').after(backBtn);
    }
    backBtn.style.display = 'block';
    gsap.fromTo(backBtn, { opacity: 0 }, { opacity: 1, duration: 0.3 });

    if (this.onCaseSelect) {
      this.onCaseSelect(cs);
    }
  }

  clearCase() {
    this.activeCase = null;
    this.container.querySelectorAll('.casestudy-card').forEach(c => c.classList.remove('active'));
    const backBtn = this.container.querySelector('.back-to-manual-btn');
    if (backBtn) {
      gsap.to(backBtn, { opacity: 0, duration: 0.2, onComplete: () => { backBtn.style.display = 'none'; } });
    }
  }
}
