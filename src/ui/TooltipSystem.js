import gsap from 'gsap';
import { TOOLTIPS } from './content.js';

/**
 * TooltipSystem — attaches info icons to formula-driven elements
 * and shows tooltip cards on hover.
 */
export class TooltipSystem {
  constructor() {
    this.activeTooltip = null;
    this._createTooltipElement();
    this._bindAll();
  }

  _createTooltipElement() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'formula-tooltip';
    this.tooltipEl.innerHTML = '<div class="formula-tooltip-content"></div><div class="formula-tooltip-arrow"></div>';
    document.body.appendChild(this.tooltipEl);
  }

  /**
   * Add an info icon next to an element
   * @param {HTMLElement} parent - element to attach icon to
   * @param {string} tooltipKey - key into TOOLTIPS object
   * @param {object} opts - optional overrides { inline: bool }
   */
  addInfoIcon(parent, tooltipKey, opts = {}) {
    if (!parent || !TOOLTIPS[tooltipKey]) return;

    const icon = document.createElement('span');
    icon.className = 'info-icon';
    icon.setAttribute('data-tooltip-key', tooltipKey);
    icon.setAttribute('aria-label', 'More info');
    icon.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="8" y="12" text-anchor="middle" font-size="10" font-weight="600" fill="currentColor">i</text></svg>';

    if (opts.inline) {
      icon.style.display = 'inline-flex';
      icon.style.verticalAlign = 'middle';
      icon.style.marginLeft = '6px';
    }

    parent.appendChild(icon);

    icon.addEventListener('mouseenter', (e) => this._showTooltip(e, tooltipKey));
    icon.addEventListener('mouseleave', () => this._hideTooltip());

    return icon;
  }

  _showTooltip(event, key) {
    const content = TOOLTIPS[key];
    if (!content) return;

    const contentEl = this.tooltipEl.querySelector('.formula-tooltip-content');
    contentEl.textContent = content;

    this.tooltipEl.style.display = 'block';
    this.tooltipEl.style.opacity = '0';

    // Position above the icon
    const iconRect = event.target.closest('.info-icon').getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();

    let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
    let top = iconRect.top - tooltipRect.height - 8;

    // Clamp to viewport
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) {
      top = iconRect.bottom + 8;
      this.tooltipEl.classList.add('tooltip-below');
    } else {
      this.tooltipEl.classList.remove('tooltip-below');
    }

    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;

    gsap.to(this.tooltipEl, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    this.activeTooltip = key;
  }

  _hideTooltip() {
    gsap.to(this.tooltipEl, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        this.tooltipEl.style.display = 'none';
      },
    });
    this.activeTooltip = null;
  }

  _bindAll() {
    // Will be called after DOM is built
  }

  /**
   * Attach info icons to all formula-driven elements that exist in the DOM
   */
  attachAll() {
    // IQ slider label
    const iqLabel = document.querySelector('[for="iq-slider"]');
    if (iqLabel) this.addInfoIcon(iqLabel, 'iq', { inline: true });

    // EQ slider label
    const eqLabel = document.querySelector('[for="eq-slider"]');
    if (eqLabel) this.addInfoIcon(eqLabel, 'eq', { inline: true });

    // Shadow values
    const optionalityInfo = document.getElementById('val-optionality')?.parentElement;
    if (optionalityInfo) this.addInfoIcon(optionalityInfo, 'optionality', { inline: true });

    const learningInfo = document.getElementById('val-learning')?.parentElement;
    if (learningInfo) this.addInfoIcon(learningInfo, 'learning', { inline: true });

    const craftInfo = document.getElementById('val-craft')?.parentElement;
    if (craftInfo) this.addInfoIcon(craftInfo, 'craft', { inline: true });

    const resilienceInfo = document.getElementById('val-resilience')?.parentElement;
    if (resilienceInfo) this.addInfoIcon(resilienceInfo, 'resilience', { inline: true });

    // Over-allocation warning
    const warningPanel = document.getElementById('warning-panel');
    if (warningPanel) {
      const header = warningPanel.querySelector('.analysis-header');
      if (header) this.addInfoIcon(header, 'overAllocation', { inline: true });
    }

    // Stage selector
    const stageSection = document.getElementById('stage-selector');
    if (stageSection) {
      const heading = stageSection.querySelector('.stage-selector-label');
      if (heading) this.addInfoIcon(heading, 'stageSelector', { inline: true });
    }

    // Self-assessment
    const assessmentSection = document.getElementById('assessment-section');
    if (assessmentSection) {
      const heading = assessmentSection.querySelector('.section-heading');
      if (heading) this.addInfoIcon(heading, 'selfAssessment', { inline: true });
    }

    // Case studies
    const caseSection = document.getElementById('casestudy-section');
    if (caseSection) {
      const heading = caseSection.querySelector('.section-heading');
      if (heading) this.addInfoIcon(heading, 'caseStudyHeading', { inline: true });
    }
  }
}
