import gsap from 'gsap';
import { ACTION_CARDS } from './content.js';

/**
 * ActionCards — renders action cards based on weakest axis
 * when any axis drops below 35 or after assessment.
 */
export class ActionCards {
  constructor() {
    this.container = document.getElementById('action-card-container');
    this.currentAxis = null;
  }

  /**
   * Check axes and show action card if any is below threshold
   * @param {object} axes - { money, time, quality, eq }
   */
  update(axes) {
    const entries = Object.entries(axes).filter(([k, v]) => v < 35);

    if (entries.length > 0) {
      // Find weakest
      const [weakestKey] = entries.reduce((a, b) => a[1] < b[1] ? a : b);
      this.showForAxis(weakestKey);
    } else {
      this.hide();
    }
  }

  showForAxis(axisKey) {
    if (!this.container) return;
    if (this.currentAxis === axisKey) return;

    this.currentAxis = axisKey;
    const content = ACTION_CARDS[axisKey];
    if (!content) return;

    this.container.innerHTML = `
      <div class="action-card" style="border-left: 3px solid ${content.icon}">
        <div class="action-card-header">
          <span class="action-dot" style="background: ${content.icon}"></span>
          <h4>${content.heading}</h4>
        </div>
        <ul class="action-list">
          ${content.actions.map((a, i) => `
            <li>
              ${i === 0 ? `
                <span class="action-item-with-info">${a}
                  <span class="info-icon action-info-icon" data-action-tooltip="${axisKey}">
                    <svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="8" y="12" text-anchor="middle" font-size="10" font-weight="600" fill="currentColor">i</text></svg>
                  </span>
                </span>
              ` : a}
            </li>
          `).join('')}
        </ul>
        <div class="action-shadow-reminder">${content.shadowReminder}</div>
      </div>
    `;

    gsap.fromTo(this.container.firstElementChild,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }

  hide() {
    if (!this.container) return;
    if (this.currentAxis === null) return;

    this.currentAxis = null;
    gsap.to(this.container, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.container.innerHTML = '';
        this.container.style.opacity = '1';
      },
    });
  }
}
