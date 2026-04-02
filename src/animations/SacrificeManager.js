import gsap from 'gsap';
import * as THREE from 'three';
import { AXIS_DATA, TRADEOFF_CONTENT } from '../ui/content.js';
import { AXIS_DIRECTIONS } from '../scene/Axes.js';

export class SacrificeManager {
  constructor(sceneManager, axes, labels, ironTriangle, particles) {
    this.sceneManager = sceneManager;
    this.axes = axes;
    this.labels = labels;
    this.ironTriangle = ironTriangle;
    this.particles = particles;
    this.currentSacrifice = null;
    this.timeline = null;
    this.isAnimating = false;
  }

  sacrifice(key) {
    if (this.isAnimating) return;
    if (this.currentSacrifice === key) return;

    // If switching, reset first then sacrifice
    if (this.currentSacrifice) {
      this.isAnimating = true;
      this._quickReset().then(() => {
        this._playSacrifice(key);
      });
    } else {
      this._playSacrifice(key);
    }
  }

  _playSacrifice(key) {
    this.isAnimating = true;
    this.currentSacrifice = key;
    this.sceneManager.pauseAutoRotate();

    // Kill any existing timeline
    if (this.timeline) this.timeline.kill();

    const axisColor = AXIS_DATA[key].color;
    const otherResourceKeys = ['money', 'time', 'quality'].filter((k) => k !== key);
    const axisDir = AXIS_DIRECTIONS[key];
    const midpoint = axisDir.clone().multiplyScalar(2);

    // Camera target position - orbit to showcase the sacrificed axis
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(axisDir).multiplyScalar(-3);
    cameraTarget.y += 4;
    cameraTarget.add(
      new THREE.Vector3(
        axisDir.z * 5,
        0,
        -axisDir.x * 5
      )
    );
    cameraTarget.normalize().multiplyScalar(9);

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      },
    });
    this.timeline = tl;

    // --- Phase 1: Focus (0-500ms) ---
    this.sceneManager.animateCameraTo(cameraTarget, 0.5);

    // --- Phase 2: Sacrifice / break (500ms-1500ms) ---
    // Flicker effect
    tl.to({}, {
      duration: 1,
      onUpdate: function () {
        const p = this.progress();
        const flicker = p < 0.7
          ? 1 - p * 0.5 + Math.sin(p * 30) * 0.2 * (1 - p)
          : 0.2;
        axes.setSolidOpacity(key, Math.max(0.15, flicker));
      },
      ease: 'none',
    }, 0.5);

    // Emit particles at midpoint
    tl.call(() => {
      this.particles.emit(key, midpoint);
    }, null, 0.8);

    // Dim the glow
    const glowMesh = this.axes.glowMeshes[key];
    if (glowMesh) {
      tl.to(glowMesh.material, {
        opacity: 0.03,
        duration: 0.8,
        ease: 'power2.in',
      }, 0.7);
    }

    // Label fades / strikethrough effect
    tl.call(() => {
      this.labels.setLabelOpacity(key, 0.2);
    }, null, 1.0);

    // --- Phase 3: Shadow reveal (1500ms-2500ms) ---
    tl.to({}, {
      duration: 0.8,
      onUpdate: function () {
        axes.setShadowOpacity(key, 0.4 * (1 - this.progress() * 0.8));
      },
    }, 1.5);

    // Flash the shadow label
    tl.call(() => {
      this.labels.flashShadowLabel(key);
    }, null, 1.6);

    // Shockwave - pulse the nexus
    tl.to(this.axes.nexusGlow.scale, {
      x: 3, y: 3, z: 3,
      duration: 0.4,
      ease: 'power2.out',
    }, 1.8);
    tl.to(this.axes.nexusGlow.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.6,
      ease: 'power2.in',
    }, 2.2);
    tl.to(this.axes.nexusGlow.material, {
      opacity: 0.4,
      duration: 0.3,
    }, 1.8);
    tl.to(this.axes.nexusGlow.material, {
      opacity: 0.15,
      duration: 0.5,
    }, 2.2);

    // --- Phase 4: Remaining axes react (2500ms-3500ms) ---
    otherResourceKeys.forEach((otherKey) => {
      const otherGlow = this.axes.glowMeshes[otherKey];
      if (otherGlow) {
        tl.to(otherGlow.material, {
          opacity: 0.5,
          duration: 0.6,
          ease: 'power2.out',
        }, 2.5);
      }
    });

    // EQ pulses
    const eqGlow = this.axes.glowMeshes['eq'];
    if (eqGlow) {
      tl.to(eqGlow.material, { opacity: 0.6, duration: 0.3, ease: 'power2.out' }, 2.6);
      tl.to(eqGlow.material, { opacity: 0.35, duration: 0.5, ease: 'power2.inOut' }, 2.9);
      tl.to(eqGlow.material, { opacity: 0.5, duration: 0.3, ease: 'power2.out' }, 3.4);
      tl.to(eqGlow.material, { opacity: 0.35, duration: 0.4, ease: 'power2.inOut' }, 3.7);
    }

    // Iron triangle dims at the sacrificed corner
    tl.to({}, {
      duration: 0.5,
      onUpdate: function () {
        ironTriangle.setOpacity(1 - this.progress() * 0.5);
      },
    }, 2.5);

    // --- Phase 5: Show analysis panel (3000ms+) ---
    tl.call(() => {
      this._showAnalysisPanel(key);
    }, null, 3.0);

    // Show reset button
    tl.call(() => {
      const resetBtn = document.getElementById('btn-reset');
      resetBtn.style.display = '';
      gsap.fromTo(resetBtn, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }, null, 3.2);

    // Highlight active button
    document.querySelectorAll('.sacrifice-btn:not(.reset-btn)').forEach((btn) => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-axis="${key}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Capture refs for closure
    const axes = this.axes;
    const ironTriangle = this.ironTriangle;
  }

  _showAnalysisPanel(key) {
    const content = TRADEOFF_CONTENT[key];
    const data = AXIS_DATA[key];
    if (!content) return;

    const section = document.getElementById('analysis-section');
    const header = document.getElementById('analysis-header');
    const visible = document.querySelector('#analysis-visible p');
    const hidden = document.querySelector('#analysis-hidden p');
    const eq = document.querySelector('#analysis-eq p');
    const works = document.querySelector('#analysis-works p');
    const kills = document.querySelector('#analysis-kills p');

    // Set header
    header.innerHTML = `<span class="axis-dot" style="background: ${data.color}; box-shadow: 0 0 10px ${data.color}"></span>${content.title}`;
    header.style.color = data.colorLight;

    // Set content
    visible.textContent = content.visible;
    hidden.innerHTML = `<span class="highlight">You lose ${content.hiddenCapability}.</span> ${content.hidden}`;
    eq.textContent = content.eq;
    works.textContent = content.works;
    kills.textContent = content.kills;

    // Show section
    section.style.display = '';

    // Staggered animation for blocks
    const blocks = section.querySelectorAll('.analysis-block');
    gsap.fromTo(blocks,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.1,
      }
    );

    // Scroll into view
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  _hideAnalysisPanel() {
    const section = document.getElementById('analysis-section');
    gsap.to(section.querySelectorAll('.analysis-block'), {
      opacity: 0,
      y: -10,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        section.style.display = 'none';
      },
    });
  }

  _quickReset() {
    return new Promise((resolve) => {
      if (this.timeline) this.timeline.kill();

      const tl = gsap.timeline({ onComplete: resolve });

      const keys = ['money', 'time', 'quality', 'eq'];

      keys.forEach((key) => {
        tl.to({}, {
          duration: 0.5,
          onUpdate: function () {
            const p = this.progress();
            if (key !== 'eq') {
              axes.setSolidOpacity(key, 0.2 + p * 0.8);
              axes.setShadowOpacity(key, p * 0.4);
            }
          },
        }, 0);

        const glow = this.axes.glowMeshes[key];
        if (glow) {
          tl.to(glow.material, { opacity: 0.25, duration: 0.5 }, 0);
        }

        // Restore labels
        tl.call(() => {
          this.labels.setLabelOpacity(key, 1);
          this.labels.setShadowLabelOpacity(key, 1);
        }, null, 0);
      });

      // Restore iron triangle
      tl.to({}, {
        duration: 0.4,
        onUpdate: function () { ironTriangle.setOpacity(this.progress()); },
      }, 0);

      // Reset nexus
      tl.to(this.axes.nexusGlow.scale, { x: 1, y: 1, z: 1, duration: 0.3 }, 0);

      this.particles.reset();

      const axes = this.axes;
      const ironTriangle = this.ironTriangle;
    });
  }

  reset() {
    if (this.isAnimating) return;
    if (!this.currentSacrifice) return;

    this.isAnimating = true;
    this.currentSacrifice = null;

    // Hide analysis panel
    this._hideAnalysisPanel();

    // Hide reset button
    const resetBtn = document.getElementById('btn-reset');
    gsap.to(resetBtn, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => { resetBtn.style.display = 'none'; },
    });

    // Remove active states
    document.querySelectorAll('.sacrifice-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    if (this.timeline) this.timeline.kill();

    const axes = this.axes;
    const ironTriangle = this.ironTriangle;
    const keys = ['money', 'time', 'quality', 'eq'];

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.sceneManager.resumeAutoRotate();
      },
    });
    this.timeline = tl;

    // Recharge glow from center
    tl.to(this.axes.nexusGlow.scale, {
      x: 4, y: 4, z: 4,
      duration: 0.3,
      ease: 'power2.out',
    }, 0);
    tl.to(this.axes.nexusGlow.material, {
      opacity: 0.5,
      duration: 0.3,
    }, 0);
    tl.to(this.axes.nexusGlow.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.5,
      ease: 'power2.in',
    }, 0.3);
    tl.to(this.axes.nexusGlow.material, {
      opacity: 0.15,
      duration: 0.5,
    }, 0.3);

    // Rebuild all axes
    keys.forEach((key) => {
      tl.to({}, {
        duration: 0.8,
        onUpdate: function () {
          const p = this.progress();
          axes.setSolidOpacity(key, p);
          axes.setShadowOpacity(key, p * 0.4);
        },
      }, 0.2);

      const glow = this.axes.glowMeshes[key];
      if (glow) {
        tl.to(glow.material, { opacity: 0.25, duration: 0.8 }, 0.2);
      }

      tl.call(() => {
        this.labels.setLabelOpacity(key, 1);
        this.labels.setShadowLabelOpacity(key, 1);
      }, null, 0.3);
    });

    // Restore iron triangle
    tl.to({}, {
      duration: 0.6,
      onUpdate: function () { ironTriangle.setOpacity(this.progress()); },
    }, 0.3);

    this.particles.reset();

    // Reset camera
    this.sceneManager.animateCameraTo(new THREE.Vector3(5, 4, 7), 0.8);
  }
}
