import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { AXIS_DATA } from '../ui/content.js';

export class Labels {
  constructor(container, axes) {
    this.axes = axes;
    this.labelObjects = {};
    this.shadowLabelObjects = {};
    this.centerLabel = null;
    this.time = 0;

    // CSS2D Renderer for crisp HTML labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.left = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.labelRenderer.domElement);

    this._onResize = () => {
      this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', this._onResize);

    this._createLabels();
  }

  _createLabel(name, annotation, color, position, isShadow = false) {
    const div = document.createElement('div');
    div.className = `axis-label-container${isShadow ? ' shadow-label' : ''}`;

    const nameEl = document.createElement('div');
    nameEl.className = 'axis-label-name';
    nameEl.style.color = color;
    nameEl.textContent = name;

    const annotEl = document.createElement('div');
    annotEl.className = 'axis-label-annotation';
    annotEl.textContent = annotation;

    div.appendChild(nameEl);
    div.appendChild(annotEl);

    const label = new CSS2DObject(div);
    label.position.copy(position);
    label.userData = { baseY: position.y };

    return label;
  }

  _createLabels() {
    const keys = ['money', 'time', 'quality', 'eq'];

    keys.forEach((key) => {
      const data = AXIS_DATA[key];

      // Solid axis tip label
      const solidPos = this.axes.getSolidEndPosition(key);
      // Offset label slightly beyond the axis tip
      const labelOffset = solidPos.clone().normalize().multiplyScalar(0.5);
      const labelPos = solidPos.clone().add(labelOffset);

      const label = this._createLabel(data.name, data.annotation, data.color, labelPos);
      this.labelObjects[key] = label;
      this.axes.scene.add(label);

      // Shadow axis tip label
      const shadowPos = this.axes.getShadowEndPosition(key);
      const shadowOffset = shadowPos.clone().normalize().multiplyScalar(0.5);
      const shadowLabelPos = shadowPos.clone().add(shadowOffset);

      const shadowLabel = this._createLabel(
        data.shadowName,
        data.shadowAnnotation,
        data.color,
        shadowLabelPos,
        true
      );
      this.shadowLabelObjects[key] = shadowLabel;
      this.axes.scene.add(shadowLabel);
    });

    // Center nexus label
    const centerDiv = document.createElement('div');
    centerDiv.className = 'center-label';
    centerDiv.textContent = 'Your Product';

    this.centerLabel = new CSS2DObject(centerDiv);
    this.centerLabel.position.set(0, -0.4, 0);
    this.axes.scene.add(this.centerLabel);
  }

  update(delta) {
    this.time += delta;

    // Floating bob animation for labels
    Object.values(this.labelObjects).forEach((label, i) => {
      const baseY = label.userData.baseY;
      label.position.y = baseY + Math.sin(this.time * 1.5 + i * 0.8) * 0.08;
    });
    Object.values(this.shadowLabelObjects).forEach((label, i) => {
      const baseY = label.userData.baseY;
      label.position.y = baseY + Math.sin(this.time * 1.2 + i * 1.2 + 2) * 0.06;
    });
  }

  render(camera) {
    this.labelRenderer.render(this.axes.scene, camera);
  }

  setLabelOpacity(key, opacity) {
    if (this.labelObjects[key]) {
      this.labelObjects[key].element.style.opacity = opacity;
    }
  }

  setShadowLabelOpacity(key, opacity) {
    if (this.shadowLabelObjects[key]) {
      this.shadowLabelObjects[key].element.style.opacity = opacity;
    }
  }

  // Flash a shadow label bright then fade
  flashShadowLabel(key) {
    const el = this.shadowLabelObjects[key]?.element;
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity = '1';
    const nameEl = el.querySelector('.axis-label-name');
    if (nameEl) {
      nameEl.style.textShadow = `0 0 20px ${AXIS_DATA[key].color}, 0 0 40px ${AXIS_DATA[key].color}`;
    }
    setTimeout(() => {
      el.style.transition = 'opacity 1s ease';
      el.style.opacity = '0.2';
      if (nameEl) {
        nameEl.style.textShadow = `0 0 12px currentColor`;
      }
    }, 600);
  }

  updateLabelPositions(key, solidPos, shadowPos) {
    const solidLabel = this.labelObjects[key];
    if (solidLabel) {
       const offset = solidPos.clone().normalize().multiplyScalar(0.5);
       const newPos = solidPos.clone().add(offset);
       solidLabel.userData.baseY = newPos.y;
       solidLabel.position.x = newPos.x;
       solidLabel.position.z = newPos.z;
    }

    const shadowLabel = this.shadowLabelObjects[key];
    if (shadowLabel) {
       const offset = shadowPos.clone().normalize().multiplyScalar(0.5);
       const newPos = shadowPos.clone().add(offset);
       shadowLabel.userData.baseY = newPos.y;
       shadowLabel.position.x = newPos.x;
       shadowLabel.position.z = newPos.z;
    }
  }

  updateLabelValues(key, visibleVal, shadowVal) {
    const solidLabel = this.labelObjects[key];
    if (solidLabel) {
       let valSpan = solidLabel.element.querySelector('.val-span');
       if (!valSpan) {
          valSpan = document.createElement('div');
          valSpan.className = 'val-span';
          valSpan.style.fontSize = '12px';
          valSpan.style.opacity = '0.8';
          solidLabel.element.appendChild(valSpan);
       }
       valSpan.textContent = visibleVal;
       solidLabel.element.style.opacity = visibleVal < 10 ? '0' : '1';
    }

    const shadowLabel = this.shadowLabelObjects[key];
    if (shadowLabel) {
       let valSpan = shadowLabel.element.querySelector('.val-span');
       if (!valSpan) {
          valSpan = document.createElement('div');
          valSpan.className = 'val-span';
          valSpan.style.fontSize = '12px';
          valSpan.style.opacity = '0.8';
          shadowLabel.element.appendChild(valSpan);
       }
       valSpan.textContent = shadowVal;
       shadowLabel.element.style.opacity = shadowVal < 10 ? '0' : '1';
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
  }
}
