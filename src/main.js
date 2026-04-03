import './style.css';
import * as THREE from 'three';
import { SceneManager } from './scene/SceneManager.js';
import { Axes, AXIS_DIRECTIONS } from './scene/Axes.js';
import { Labels } from './scene/Labels.js';
import { IronTriangle } from './scene/IronTriangle.js';
import { Particles } from './scene/Particles.js';
import { IntroAnimation } from './scene/IntroAnimation.js';
import { SliderManager } from './animations/SliderManager.js';
import { AXIS_DATA } from './ui/content.js';
import { ShapeGrid } from './animations/ShapeGrid.js';
import { StageSelector } from './ui/StageSelector.js';
import { CaseStudies } from './ui/CaseStudies.js';
import { SelfAssessment } from './ui/SelfAssessment.js';
import { ActionCards } from './ui/ActionCards.js';
import { TooltipSystem } from './ui/TooltipSystem.js';

// --- App State ---
let sceneManager, axes, labels, ironTriangle, particles, introAnimation, sliderManager;
let shapeGrid = null;
let hoveredAxis = null;
let stageSelector, caseStudies, selfAssessment, actionCards, tooltipSystem;

// --- Initialize ---
function init() {
  const container = document.getElementById('graph-container');

  // Scene
  sceneManager = new SceneManager(container);

  // 3D elements
  axes = new Axes(sceneManager.scene);
  labels = new Labels(container, axes);
  ironTriangle = new IronTriangle(sceneManager.scene);
  particles = new Particles(sceneManager.scene);

  // Animations
  introAnimation = new IntroAnimation(sceneManager, axes, labels, ironTriangle);
  sliderManager = new SliderManager(sceneManager, axes, labels, ironTriangle, particles);

  // --- Action Cards ---
  actionCards = new ActionCards();
  sliderManager.onActionCardTrigger = (axisValues) => {
    actionCards.update(axisValues);
  };

  // --- Stage Selector ---
  stageSelector = new StageSelector((stageKey, values) => {
    sliderManager.activeMode = 'stage';
    sliderManager.applyPreset(values);
    // Clear case study and assessment states
    if (caseStudies) caseStudies.clearCase();
    ironTriangle.hideComparisonVolume();
  });

  // --- Case Studies ---
  caseStudies = new CaseStudies((caseStudy) => {
    sliderManager.activeMode = 'casestudy';
    sliderManager.casestudyOverride = true;
    // Apply main values (use IQ=75 default for case studies)
    sliderManager.applyPreset({
      iq: 75,
      eq: caseStudy.values.eq,
      money: caseStudy.values.money,
      time: caseStudy.values.time,
      quality: caseStudy.values.quality,
    });

    // Clear stage selector
    if (stageSelector) stageSelector.clearStage();

    // No comparative case studies, hide comparison volume
    ironTriangle.hideComparisonVolume();

    // Update analysis with lesson text
    const analysisPanel = document.getElementById('analysis-panel');
    if (analysisPanel) {
      analysisPanel.style.display = 'block';
      const header = document.getElementById('analysis-header');
      if (header) {
        header.innerHTML = `<span class="axis-dot" style="background: ${caseStudy.accent}; box-shadow: 0 0 10px ${caseStudy.accent}"></span>${caseStudy.name}`;
        header.style.color = '#E5E5E5';
      }
      // Show lesson as content
      const visibleBlock = document.querySelector('#analysis-visible p');
      const hiddenBlock = document.querySelector('#analysis-hidden p');
      const eqBlock = document.querySelector('#analysis-eq p');
      const worksBlock = document.querySelector('#analysis-works p');
      const killsBlock = document.querySelector('#analysis-kills p');
      if (visibleBlock) visibleBlock.textContent = caseStudy.oneLiner;
      if (hiddenBlock) hiddenBlock.innerHTML = caseStudy.lesson;
      if (eqBlock) eqBlock.textContent = '';
      if (worksBlock) worksBlock.textContent = '';
      if (killsBlock) killsBlock.textContent = '';

      // Hide works/kills/eq blocks for case studies
      document.getElementById('analysis-eq').style.display = 'none';
      document.getElementById('analysis-works').style.display = 'none';
      document.getElementById('analysis-kills').style.display = 'none';

      // Rename blocks
      document.querySelector('#analysis-visible h3').textContent = 'One-liner';
      document.querySelector('#analysis-hidden h3').textContent = 'Lesson';
    }

    // Scroll analysis into view
    setTimeout(() => {
      document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  });

  // --- Self-Assessment ---
  selfAssessment = new SelfAssessment((scores) => {
    sliderManager.activeMode = 'assessment';
    sliderManager.applyPreset({
      iq: 75,
      eq: scores.eq,
      money: scores.money,
      time: scores.time,
      quality: scores.quality,
    });
    // Clear other states
    if (stageSelector) stageSelector.clearStage();
    if (caseStudies) caseStudies.clearCase();
    ironTriangle.hideComparisonVolume();

    // Scroll graph into view
    setTimeout(() => {
      document.getElementById('graph-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  });

  // --- Bento Slider (Strategy vs Execution) ---
  const bentoSlider = document.getElementById('bento-slider');
  const bentoStrategyPct = document.getElementById('bento-strategy-pct');
  const bentoExecutionPct = document.getElementById('bento-execution-pct');
  const bentoStrategyCard = document.getElementById('bento-card-strategy');
  const bentoExecutionCard = document.getElementById('bento-card-execution');
  if (bentoSlider) {
    bentoSlider.addEventListener('input', () => {
      const v = parseInt(bentoSlider.value);
      const e = 100 - v;
      if (bentoStrategyPct) bentoStrategyPct.textContent = `${v}%`;
      if (bentoExecutionPct) bentoExecutionPct.textContent = `${e}%`;
      if (bentoStrategyCard) bentoStrategyCard.style.flexBasis = `${v}%`;
      if (bentoExecutionCard) bentoExecutionCard.style.flexBasis = `${e}%`;
      bentoSlider.style.background = `linear-gradient(to right, rgba(59, 130, 246, 0.5) ${v}%, rgba(255, 255, 255, 0.1) ${v}%)`;
    });
  }

  // --- Tooltip System ---
  tooltipSystem = new TooltipSystem();
  // Attach tooltips after a brief delay to ensure DOM is ready
  setTimeout(() => tooltipSystem.attachAll(), 100);

  // Start render loop
  animate();

  // Setup background grid animation
  const bgContainer = document.getElementById('shapegrid-bg');
  shapeGrid = new ShapeGrid(bgContainer, {
    speed: 0.5,
    squareSize: 40,
    direction: 'diagonal',
    borderColor: '#271E37',
    hoverFillColor: '#222222',
    shape: 'square',
    hoverTrailAmount: 5,
  });

  // Setup interactions
  setupHoverDetection(container);
  setupScrollObserver();

  // Play intro after loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 600);

    introAnimation.play();
  }, 500);
}

// --- Animation Loop ---
let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  // Update components
  labels.update(delta);
  particles.update(delta);
  if (sliderManager) sliderManager.update(delta);

  // Render
  sceneManager.update();
  labels.render(sceneManager.camera);
}



// --- Hover Detection ---
function setupHoverDetection(container) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const tooltip = document.getElementById('axis-tooltip');

  raycaster.params.Line.threshold = 0.3;

  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, sceneManager.camera);
    const targets = axes.getRaycastTargets();
    const intersects = raycaster.intersectObjects(targets);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const axisKey = hit.name.replace('-glow', '');

      if (axisKey !== hoveredAxis) {
        // Un-hover previous
        if (hoveredAxis) {
          axes.resetBrightness(hoveredAxis);
        }

        hoveredAxis = axisKey;
        axes.brightenAxis(axisKey, 2);

        // Show tooltip
        const data = AXIS_DATA[axisKey];
        if (data) {
          tooltip.innerHTML = `
            <div class="tooltip-name" style="color: ${data.color}">${data.name}</div>
            <div class="tooltip-desc">${data.annotation}</div>
          `;
          tooltip.style.display = 'block';
        }
      }

      // Position tooltip near cursor
      tooltip.style.left = `${event.clientX + 16}px`;
      tooltip.style.top = `${event.clientY - 10}px`;
    } else {
      if (hoveredAxis) {
        axes.resetBrightness(hoveredAxis);
        hoveredAxis = null;
        tooltip.style.display = 'none';
      }
    }
  });

  container.addEventListener('mouseleave', () => {
    if (hoveredAxis) {
      axes.resetBrightness(hoveredAxis);
      hoveredAxis = null;
      tooltip.style.display = 'none';
    }
  });
}

// --- Scroll Observer ---
function setupScrollObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  // Decision card
  const decisionCard = document.getElementById('decision-card');
  if (decisionCard) observer.observe(decisionCard);

  // Transition section
  const transitionCard = document.querySelector('#transition-section .transition-card');
  if (transitionCard) {
    transitionCard.style.opacity = '0';
    transitionCard.style.transform = 'translateY(30px)';
    transitionCard.style.transition = 'all 0.8s var(--ease-out)';
    const transObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.2 }
    );
    transObs.observe(transitionCard);
  }

  // Case study and assessment sections
  const casestudySection = document.getElementById('casestudy-section');
  if (casestudySection) {
    casestudySection.style.opacity = '0';
    casestudySection.style.transform = 'translateY(30px)';
    casestudySection.style.transition = 'all 0.8s var(--ease-out)';
    const csObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    csObs.observe(casestudySection);
  }

  const assessmentSection = document.getElementById('assessment-section');
  if (assessmentSection) {
    assessmentSection.style.opacity = '0';
    assessmentSection.style.transform = 'translateY(30px)';
    assessmentSection.style.transition = 'all 0.8s var(--ease-out)';
    const asObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    asObs.observe(assessmentSection);
  }
}

// --- Start ---
document.addEventListener('DOMContentLoaded', init);
