import gsap from 'gsap';
import { CASE_STUDIES } from './content.js';

/**
 * CaseStudies — renders redesigned case study cards with logos,
 * colored value pills, and "View on graph" links.
 */

// Simple text-based logo fallbacks (grayscale/white SVGs)
const LOGO_SVG = {
  'apple-mac': `<svg viewBox="0 0 32 32" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg"><path d="M23.5 17.5c-.04-3.56 2.9-5.27 3.03-5.35-1.65-2.41-4.22-2.74-5.13-2.78-2.18-.22-4.26 1.28-5.37 1.28-1.1 0-2.81-1.25-4.62-1.22-2.38.04-4.57 1.38-5.79 3.51-2.47 4.28-.63 10.63 1.77 14.11 1.18 1.7 2.58 3.62 4.42 3.55 1.77-.07 2.44-1.15 4.58-1.15 2.14 0 2.74 1.15 4.61 1.11 1.91-.03 3.11-1.74 4.28-3.45 1.35-1.98 1.9-3.9 1.94-4 -.04-.02-3.72-1.43-3.76-5.67zM20.04 7.39c.98-1.19 1.64-2.83 1.46-4.47-1.41.06-3.12.94-4.13 2.13-.91 1.05-1.7 2.73-1.49 4.34 1.58.12 3.18-.8 4.16-2z"/></svg>`,
  'whatsapp': `<svg viewBox="0 0 32 32" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg"><path d="M16.01 3C8.83 3 3 8.83 3 16.01c0 2.29.6 4.53 1.74 6.5L3 29l6.67-1.75A12.94 12.94 0 0016.01 29C23.18 29 29 23.18 29 16.01S23.18 3 16.01 3zm0 23.68c-2.1 0-4.15-.57-5.94-1.64l-.43-.25-4.43 1.16 1.18-4.32-.28-.44a10.62 10.62 0 01-1.63-5.68c0-5.89 4.8-10.69 10.7-10.69 5.89 0 10.69 4.8 10.69 10.7 0 5.88-4.8 10.68-10.7 10.68zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.84-1.59-1.89-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4s-1.12 1.1-1.12 2.67c0 1.58 1.15 3.1 1.31 3.31.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.67.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.29-.21-.61-.37z"/></svg>`,
  'zerodha': `<svg viewBox="0 0 32 32" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg"><path d="M6 8h20v2.5H11.5L26 24H6v-2.5h14.5L6 8z"/></svg>`,
  'zoho': `<svg viewBox="0 0 32 32" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg"><path d="M4 10h6l-6 12h6l6-12h-6zm10 0c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6-6 2.69-6 6zm3 0a3 3 0 116 0 3 3 0 01-6 0z"/><path d="M14 22c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6zm3 0a3 3 0 116 0 3 3 0 01-6 0z"/></svg>`,
};

// Color map for value pills
const PILL_COLORS = {
  M: { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' },
  T: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)' },
  Q: { bg: 'rgba(20, 184, 166, 0.12)', color: '#14B8A6', border: 'rgba(20, 184, 166, 0.25)' },
  EQ: { bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', border: 'rgba(139, 92, 246, 0.25)' },
};

export class CaseStudies {
  constructor(onCaseSelect) {
    this.onCaseSelect = onCaseSelect; // callback(caseStudy)
    this.activeCase = null;
    this.container = document.getElementById('casestudy-section');
    if (this.container) {
      this._render();
    }
  }

  _makePill(label, value) {
    const c = PILL_COLORS[label];
    return `<span class="casestudy-pill" style="background:${c.bg};color:${c.color};border:1px solid ${c.border}">${label}:${value}</span>`;
  }

  _render() {
    const grid = this.container.querySelector('.casestudy-grid');
    if (!grid) return;

    CASE_STUDIES.forEach(cs => {
      const card = document.createElement('div');
      card.className = 'casestudy-card glass-card';
      card.dataset.id = cs.id;

      const logo = LOGO_SVG[cs.id] || '';

      card.innerHTML = `
        <div class="casestudy-accent" style="background: ${cs.accent}"></div>
        <div class="casestudy-content">
          <div class="casestudy-header-row">
            <div class="casestudy-logo">${logo}</div>
            <div class="casestudy-name">${cs.name}</div>
          </div>
          <p class="casestudy-oneliner">${cs.oneLiner}</p>
          <div class="casestudy-bottom-row">
            <div class="casestudy-values">
              ${this._makePill('M', cs.values.money)}
              ${this._makePill('T', cs.values.time)}
              ${this._makePill('Q', cs.values.quality)}
              ${this._makePill('EQ', cs.values.eq)}
            </div>
            <div class="casestudy-view-link">View on graph →</div>
          </div>
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
