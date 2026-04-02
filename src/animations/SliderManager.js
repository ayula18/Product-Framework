import gsap from 'gsap';
import * as THREE from 'three';
import { AXIS_DATA, TRADEOFF_CONTENT, TOOLTIPS } from '../ui/content.js';
import { AXIS_DIRECTIONS } from '../scene/Axes.js';

export class SliderManager {
  constructor(sceneManager, axes, labels, ironTriangle, particles) {
    this.sceneManager = sceneManager;
    this.axes = axes;
    this.labels = labels;
    this.ironTriangle = ironTriangle;
    this.particles = particles;
    
    // Sliders
    this.sliders = {
      iq: document.getElementById('iq-slider'),
      eq: document.getElementById('eq-slider'),
      money: document.getElementById('money-slider'),
      time: document.getElementById('time-slider'),
      quality: document.getElementById('quality-slider'),
    };

    // Shadow labels
    this.shadowValues = {
      resilience: document.getElementById('val-resilience'),
      optionality: document.getElementById('val-optionality'),
      learning: document.getElementById('val-learning'),
      craft: document.getElementById('val-craft'),
    };

    // IQ value display
    this.iqValueDisplay = document.getElementById('iq-value-display');

    // Current interpolation targets
    this.targets = {
      iq: 75,
      eq: 50,
      money: 70,
      time: 70,
      quality: 70
    };

    // Current rendered values
    this.current = {
      iq: 75,
      eq: 50,
      money: 70,
      time: 70,
      quality: 70
    };

    this.defaultValues = {
      iq: 75, eq: 50, money: 70, time: 70, quality: 70
    };

    this.isAnimatingPresets = false;
    // Track active mode for back-to-manual
    this.activeMode = 'manual'; // 'manual' | 'stage' | 'casestudy' | 'assessment'

    // Action card callback
    this.onActionCardTrigger = null;

    this.bindEvents();
    // Initial update to push initial state
    this.forceUpdateUIFromTargets();
    this.updateLogic();
  }

  bindEvents() {
    Object.keys(this.sliders).forEach(key => {
      this.sliders[key].addEventListener('input', (e) => {
        // Kill preset animation instantly if the user grabs a slider
        gsap.killTweensOf(this.targets);
        this.isAnimatingPresets = false;
        this.activeMode = 'manual';
        
        this.targets[key] = parseFloat(e.target.value);
        this.updateSliderTrack(key);

        // Update IQ display
        if (key === 'iq' && this.iqValueDisplay) {
          this.iqValueDisplay.textContent = Math.round(this.targets.iq);
        }
      });
    });

    // Reset button
    const resetBtn = document.getElementById('btn-reset-sliders');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeMode = 'manual';
        this.applyPreset(this.defaultValues);
        // Hide EQ warning
        this._hideEQWarning();
        // Hide comparison volume
        this.ironTriangle.hideComparisonVolume();
      });
    }
  }

  updateSliderTrack(key) {
    const slider = this.sliders[key];
    const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, var(--slider-color) ${val}%, rgba(255,255,255,0.1) ${val}%)`;
  }

  applyPreset(presetValues) {
    // Kill any existing tween so rapid clicking doesn't permanently lock the state
    gsap.killTweensOf(this.targets);
    this.isAnimatingPresets = true;
    
    gsap.to(this.targets, {
      iq: presetValues.iq !== undefined ? presetValues.iq : this.targets.iq,
      eq: presetValues.eq !== undefined ? presetValues.eq : this.targets.eq,
      money: presetValues.money !== undefined ? presetValues.money : this.targets.money,
      time: presetValues.time !== undefined ? presetValues.time : this.targets.time,
      quality: presetValues.quality !== undefined ? presetValues.quality : this.targets.quality,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        // Update DOM inputs to match targets so tracks redraw correctly
        Object.keys(this.targets).forEach(k => {
          if (this.sliders[k]) {
            this.sliders[k].value = Math.round(this.targets[k]);
            this.updateSliderTrack(k);
          }
        });
        // Update IQ display
        if (this.iqValueDisplay) {
          this.iqValueDisplay.textContent = Math.round(this.targets.iq);
        }
      },
      onComplete: () => {
        this.isAnimatingPresets = false;
      }
    });
  }

  forceUpdateUIFromTargets() {
    Object.keys(this.targets).forEach(k => {
      if (this.sliders[k]) {
        this.sliders[k].value = Math.round(this.targets[k]);
        this.updateSliderTrack(k);
      }
    });
    if (this.iqValueDisplay) {
      this.iqValueDisplay.textContent = Math.round(this.targets.iq);
    }
  }

  // Called in requestAnimationFrame inside main.js
  update(delta) {
    // Lerp current to target
    const lerpFactor = 0.12;
    let needsUpdate = false;

    Object.keys(this.targets).forEach(key => {
      const diff = this.targets[key] - this.current[key];
      if (Math.abs(diff) > 0.01) {
        this.current[key] += diff * lerpFactor;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      this.updateLogic();
    }

    // Update EQ pulsing and IQ ceiling
    if (delta !== undefined) {
      this.axes.updatePulsing(delta);
      this.axes.setIQCeiling(this.current.eq, this.current.iq);
    }
  }

  updateLogic() {
    const { iq, eq, money, time, quality } = this.current;
    
    // 1. IQ ceiling + EQ inverted U-curve
    let eqForCalc = eq;
    if (eq > 85) {
      // Diminishing returns beyond 85
      eqForCalc = 85 + (eq - 85) * 0.3;
    }

    // IQ acts as ceiling on EQ
    const iqFactor = iq / 100;
    const eqEffective = eqForCalc * iqFactor;

    // EQ multiplier uses effective EQ
    const eqMultiplier = 0.4 + (eqEffective / 100) * 1.2;
    const effectiveMoney = Math.min(money * eqMultiplier, 160);
    const effectiveTime = Math.min(time * eqMultiplier, 160);
    const effectiveQuality = Math.min(quality * eqMultiplier, 160);
    const budget = 200 * eqMultiplier;
    const total = money + time + quality;
    const isOverAllocated = total > budget;

    // Shadow calculations
    const optionality = Math.round(100 * (1 - Math.exp(-0.03 * effectiveMoney)));
    const learning = Math.round(100 * (1 - Math.exp(-0.03 * effectiveTime)));
    const craft = Math.round(100 * Math.pow(effectiveQuality / 160, 1.8));
    const resilience = Math.round(100 * Math.pow(eq / 100, 1.5));

    // Update DOM shadow numbers
    this.shadowValues.optionality.textContent = optionality;
    this.shadowValues.learning.textContent = learning;
    this.shadowValues.craft.textContent = craft;
    this.shadowValues.resilience.textContent = resilience;

    // 2. EQ > 85 warning
    if (eq > 85) {
      this._showEQWarning();
      this.axes.setEQPulsingState(true);
    } else {
      this._hideEQWarning();
      this.axes.setEQPulsingState(false);
    }

    // 3. 3D Elements Update
    // Update Axes lengths and glows
    this.axes.setAxisLength('eq', eqEffective, resilience, eq / 100);
    this.axes.setAxisLength('money', effectiveMoney, optionality, money / 100);
    this.axes.setAxisLength('time', effectiveTime, learning, time / 100);
    this.axes.setAxisLength('quality', effectiveQuality, craft, quality / 100);

    // Update Triangle (now a Tetrahedron Volume)
    this.ironTriangle.updateVertices(
      this.axes.getSolidEndPosition('money'),
      this.axes.getSolidEndPosition('time'),
      this.axes.getSolidEndPosition('quality'),
      this.axes.getSolidEndPosition('eq')
    );
    this.ironTriangle.setTensionState(isOverAllocated);

    // Update Labels
    this.labels.updateLabelPositions('eq', this.axes.getSolidEndPosition('eq'), this.axes.getShadowEndPosition('eq'));
    this.labels.updateLabelPositions('money', this.axes.getSolidEndPosition('money'), this.axes.getShadowEndPosition('money'));
    this.labels.updateLabelPositions('time', this.axes.getSolidEndPosition('time'), this.axes.getShadowEndPosition('time'));
    this.labels.updateLabelPositions('quality', this.axes.getSolidEndPosition('quality'), this.axes.getShadowEndPosition('quality'));

    this.labels.updateLabelValues('eq', Math.round(eq), resilience);
    this.labels.updateLabelValues('money', Math.round(money), optionality);
    this.labels.updateLabelValues('time', Math.round(time), learning);
    this.labels.updateLabelValues('quality', Math.round(quality), craft);

    // 4. UI Panel Update
    this.updateAnalysisPanels({ money, time, quality, eq, isOverAllocated });

    // 5. Action card trigger
    if (this.onActionCardTrigger) {
      this.onActionCardTrigger({ money, time, quality, eq });
    }
  }

  _showEQWarning() {
    const warning = document.getElementById('eq-obsessive-warning');
    if (warning && warning.style.display === 'none') {
      warning.style.display = 'block';
      gsap.fromTo(warning, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }

  _hideEQWarning() {
    const warning = document.getElementById('eq-obsessive-warning');
    if (warning && warning.style.display !== 'none') {
      gsap.to(warning, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => { warning.style.display = 'none'; }
      });
    }
  }

  /**
   * Show comparison volume for SpaceX vs Boeing
   */
  showComparisonOverlay(comparisonValues, eqMultiplier) {
    // Calculate effective positions for the comparison values
    const compEqEffective = comparisonValues.eq;
    const compEqMult = 0.4 + (compEqEffective / 100) * 1.2;
    const cMoney = Math.min(comparisonValues.money * compEqMult, 160);
    const cTime = Math.min(comparisonValues.time * compEqMult, 160);
    const cQuality = Math.min(comparisonValues.quality * compEqMult, 160);

    // Convert to 3D positions
    const moneyDir = AXIS_DIRECTIONS.money;
    const timeDir = AXIS_DIRECTIONS.time;
    const qualityDir = AXIS_DIRECTIONS.quality;
    const eqDir = AXIS_DIRECTIONS.eq;

    const AXIS_LENGTH = 4;
    const moneyPos = moneyDir.clone().multiplyScalar(Math.max((cMoney / 160) * AXIS_LENGTH, 0.01));
    const timePos = timeDir.clone().multiplyScalar(Math.max((cTime / 160) * AXIS_LENGTH, 0.01));
    const qualityPos = qualityDir.clone().multiplyScalar(Math.max((cQuality / 160) * AXIS_LENGTH, 0.01));
    const eqPos = eqDir.clone().multiplyScalar(Math.max((compEqEffective / 100) * AXIS_LENGTH, 0.01));

    this.ironTriangle.showComparisonVolume(moneyPos, timePos, qualityPos, eqPos);
  }

  updateAnalysisPanels(state) {
    const { money, time, quality, eq, isOverAllocated } = state;
    
    const warningPanel = document.getElementById('warning-panel');
    const balancedPanel = document.getElementById('balanced-panel');
    const analysisPanel = document.getElementById('analysis-panel');

    // Warning Panel
    if (isOverAllocated) {
      if (warningPanel.style.display === 'none') warningPanel.style.display = 'block';
    } else {
      if (warningPanel.style.display === 'block') warningPanel.style.display = 'none';
    }

    // Sacrifice Analysis
    const minVal = Math.min(money, time, quality);
    const maxVal = Math.max(money, time, quality);
    const gap = maxVal - minVal;

    if (gap > 30) {
      if (balancedPanel.style.display === 'block') balancedPanel.style.display = 'none';
      if (analysisPanel.style.display === 'none') {
        analysisPanel.style.display = 'block';
        // Light enter animation
        gsap.fromTo(analysisPanel, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
      }

      // Determine sacrificed
      let sacrificed = 'money';
      if (time === minVal) sacrificed = 'time';
      if (quality === minVal) sacrificed = 'quality';

      this.populateAnalysisContent(sacrificed, eq);
    } else {
      if (analysisPanel.style.display === 'block') analysisPanel.style.display = 'none';
      if (balancedPanel.style.display === 'none') {
        balancedPanel.style.display = 'block';
        gsap.fromTo(balancedPanel, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
      }
    }
  }

  populateAnalysisContent(key, eqVal) {
    const content = TRADEOFF_CONTENT[key];
    const data = AXIS_DATA[key];
    if (!content) return;

    // Only update DOM if the content changed to avoid flicker
    if (this.lastSacrificed === key && Math.abs(this.lastEq - eqVal) < 1) return;
    this.lastSacrificed = key;
    this.lastEq = eqVal;

    // EQ Badge
    const eqBadge = document.getElementById('eq-assessment-badge');
    let eqColorRef = '#14B8A6'; // teal
    let eqBg = 'rgba(20, 184, 166, 0.15)';
    let eqClass = 'eq-badge-high';
    let eqText = "Your team's EQ is high. This sacrifice is likely survivable. The team will maintain internal standards and self-correct over time.";
    
    if (eqVal < 40) {
      eqColorRef = '#EF4444'; // red
      eqBg = 'rgba(239, 68, 68, 0.15)';
      eqClass = 'eq-badge-low';
      eqText = "Your team's EQ is low. This sacrifice is dangerous. The hidden capability loss may become permanent. Consider investing in team EQ before making this tradeoff.";
    } else if (eqVal < 70) {
      eqColorRef = '#F59E0B'; // amber/yellow
      eqBg = 'rgba(245, 158, 11, 0.15)';
      eqClass = 'eq-badge-medium';
      eqText = "Your team's EQ is moderate. This sacrifice carries risk. Monitor closely for signs of cultural drift or standard erosion.";
    }

    eqBadge.innerHTML = `<div style="padding: 12px; border-radius: 8px; background: ${eqBg}; border-left: 4px solid ${eqColorRef}; font-size: 0.9rem; color: #E5E5E5;">
      ${eqText}
    </div>`;

    document.getElementById('analysis-header').innerHTML = `<span class="axis-dot" style="background: ${data.color}; box-shadow: 0 0 10px ${data.color}"></span>${content.title}`;
    document.getElementById('analysis-header').style.color = data.colorLight;

    document.querySelector('#analysis-visible p').textContent = content.visible;
    document.querySelector('#analysis-hidden p').innerHTML = `<span class="highlight">You lose ${content.hiddenCapability}.</span> ${content.hidden}`;
    document.querySelector('#analysis-eq p').textContent = content.eq;
    document.querySelector('#analysis-works p').textContent = content.works;
    document.querySelector('#analysis-kills p').textContent = content.kills;
  }
}
