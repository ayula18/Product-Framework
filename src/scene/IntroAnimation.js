import gsap from 'gsap';

export class IntroAnimation {
  constructor(sceneManager, axes, labels, ironTriangle) {
    this.sceneManager = sceneManager;
    this.axes = axes;
    this.labels = labels;
    this.ironTriangle = ironTriangle;
  }

  play() {
    // Capture references for closures upfront
    const axes = this.axes;
    const labels = this.labels;
    const ironTriangle = this.ironTriangle;

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.sceneManager.resumeAutoRotate();
          resolve();
        },
      });

      // Initially hide everything
      const axisKeys = ['money', 'time', 'quality', 'eq'];
      axisKeys.forEach((key) => {
        axes.setSolidOpacity(key, 0);
        axes.setShadowOpacity(key, 0);
        labels.setLabelOpacity(key, 0);
        labels.setShadowLabelOpacity(key, 0);
      });
      ironTriangle.setOpacity(0);
      axes.nexus.material.opacity = 0;
      axes.nexusGlow.material.opacity = 0;

      // Phase 0: Nexus appears
      tl.to(axes.nexus.material, {
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.out',
      }, 0);
      tl.to(axes.nexusGlow.material, {
        opacity: 0.15,
        duration: 0.5,
        ease: 'power2.out',
      }, 0);

      // Phase 1: Money axis draws out (0.3s - 0.8s)
      tl.to({}, {
        duration: 0.5,
        onUpdate: function () {
          axes.setSolidOpacity('money', this.progress());
        },
      }, 0.3);
      tl.to({}, {
        duration: 0.4,
        onUpdate: function () { axes.setShadowOpacity('money', this.progress() * 0.4); },
      }, 0.6);

      // Phase 2: Time axis draws out
      tl.to({}, {
        duration: 0.5,
        onUpdate: function () { axes.setSolidOpacity('time', this.progress()); },
      }, 0.8);
      tl.to({}, {
        duration: 0.4,
        onUpdate: function () { axes.setShadowOpacity('time', this.progress() * 0.4); },
      }, 1.1);

      // Phase 3: Quality axis draws out
      tl.to({}, {
        duration: 0.5,
        onUpdate: function () { axes.setSolidOpacity('quality', this.progress()); },
      }, 1.3);
      tl.to({}, {
        duration: 0.4,
        onUpdate: function () { axes.setShadowOpacity('quality', this.progress() * 0.4); },
      }, 1.6);

      // Phase 4: Iron triangle fades in
      tl.to({}, {
        duration: 0.6,
        onUpdate: function () { ironTriangle.setOpacity(this.progress()); },
      }, 1.8);

      // Phase 5: EQ axis draws dramatically through the plane
      tl.to({}, {
        duration: 0.7,
        onUpdate: function () { axes.setSolidOpacity('eq', this.progress()); },
        ease: 'power2.out',
      }, 2.2);
      tl.to({}, {
        duration: 0.5,
        onUpdate: function () { axes.setShadowOpacity('eq', this.progress() * 0.4); },
      }, 2.5);

      // Phase 6: Labels fade in
      const labelDelay = 2.8;
      axisKeys.forEach((key, i) => {
        tl.to({}, {
          duration: 0.4,
          onUpdate: function () {
            labels.setLabelOpacity(key, this.progress());
            labels.setShadowLabelOpacity(key, this.progress());
          },
        }, labelDelay + i * 0.12);
      });

      // Phase 7: Fade in hero text
      tl.to('#hero-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 3.0);
      tl.to('#hero-prepared-by', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 3.15);
      tl.to('#hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 3.3);

      // Iron triangle heading
      tl.to('.iron-triangle-heading', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 3.4);

      // Concept cards
      tl.to('.concept-card', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
      }, 3.5);

      // Bridge text
      tl.to('.bridge-text', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 3.9);

      tl.to('#scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 4.0);
    });
  }
}
