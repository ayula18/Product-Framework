import gsap from 'gsap';
import { STAGE_CONFIGS } from './content.js';

/**
 * StageSelector — renders 4 pill buttons (Idea, Build, Growth, Scale)
 * and animates sliders to preset values on click.
 */
export class StageSelector {
  constructor(onStageSelect) {
    this.onStageSelect = onStageSelect; // callback(stageKey, values)
    this.activeStage = null;
    this.container = document.getElementById('stage-selector');
    if (this.container) {
      this._render();
      this._bindEvents();
    }
  }

  _render() {
    const buttonsWrap = this.container.querySelector('.stage-buttons');
    if (!buttonsWrap) return;

    Object.entries(STAGE_CONFIGS).forEach(([key, config]) => {
      const btn = document.createElement('button');
      btn.className = 'stage-btn';
      btn.dataset.stage = key;
      btn.textContent = config.label;
      btn.title = config.tooltip;
      buttonsWrap.appendChild(btn);
    });
  }

  _bindEvents() {
    this.container.querySelectorAll('.stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const stageKey = btn.dataset.stage;
        this.selectStage(stageKey);
      });
    });
  }

  selectStage(stageKey) {
    const config = STAGE_CONFIGS[stageKey];
    if (!config) return;

    // Update active state
    this.activeStage = stageKey;
    this.container.querySelectorAll('.stage-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.stage === stageKey);
    });

    // Show stage description card
    this._showDescription(config);

    // Callback to animate sliders
    if (this.onStageSelect) {
      this.onStageSelect(stageKey, config.values);
    }
  }

  _showDescription(config) {
    let card = this.container.querySelector('.stage-description-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'stage-description-card glass-card';
      this.container.appendChild(card);
    }

    card.innerHTML = `
      <p class="stage-desc-text">${config.description}</p>
      <div class="stage-meta">
        <div class="stage-meta-item">
          <span class="stage-meta-label">Recommended sacrifice</span>
          <span class="stage-meta-value">${config.sacrifice}</span>
        </div>
        <div class="stage-meta-item">
          <span class="stage-meta-label">Key shadow to protect</span>
          <span class="stage-meta-value">${config.shadowToProtect}</span>
        </div>
      </div>
    `;

    gsap.fromTo(card, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }

  clearStage() {
    this.activeStage = null;
    this.container.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
    const card = this.container.querySelector('.stage-description-card');
    if (card) {
      gsap.to(card, { opacity: 0, duration: 0.3, onComplete: () => card.remove() });
    }
  }
}
