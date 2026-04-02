import * as THREE from 'three';
import { AXIS_DATA } from '../ui/content.js';

// Axis directions in 3D space
// Money, Time, Quality on XZ plane as a triangle; EQ on Y axis
const AXIS_LENGTH = 4;
const SHADOW_LENGTH = 3;

export const AXIS_DIRECTIONS = {
  money:   new THREE.Vector3(1, 0, 0).normalize(),
  time:    new THREE.Vector3(-0.5, 0, 0.866).normalize(), // 120 degrees from money
  quality: new THREE.Vector3(-0.5, 0, -0.866).normalize(), // 240 degrees from money
  eq:      new THREE.Vector3(0, 1, 0),
};

export class Axes {
  constructor(scene) {
    this.scene = scene;
    this.solidAxes = {};
    this.shadowAxes = {};
    this.glowMeshes = {};
    this.axisGroups = {};

    // EQ pulsing state
    this.eqPulsing = false;
    this.eqPulseTime = 0;

    // IQ ceiling line
    this.iqCeilingLine = null;
    this.iqCeilingVisible = false;

    this._createAxes();
    this._createIQCeilingLine();
  }

  _createAxes() {
    const axisKeys = ['money', 'time', 'quality', 'eq'];

    axisKeys.forEach((key) => {
      const data = AXIS_DATA[key];
      const dir = AXIS_DIRECTIONS[key];
      const color = new THREE.Color(data.color);

      // Group for this axis
      const group = new THREE.Group();
      group.name = key;
      this.axisGroups[key] = group;

      // --- Solid axis ---
      const solidEnd = dir.clone().multiplyScalar(AXIS_LENGTH);
      const solidGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        solidEnd,
      ]);
      const solidMat = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 2,
        transparent: true,
        opacity: 1,
      });
      const solidLine = new THREE.Line(solidGeom, solidMat);
      solidLine.name = `${key}-solid`;
      solidLine.userData = { axisKey: key, isSolid: true };
      this.solidAxes[key] = solidLine;
      group.add(solidLine);

      // --- Glow tube around solid axis ---
      const glowGeom = new THREE.CylinderGeometry(0.04, 0.04, AXIS_LENGTH, 8);
      glowGeom.translate(0, AXIS_LENGTH / 2, 0);
      glowGeom.rotateX(Math.PI / 2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const glowMesh = new THREE.Mesh(glowGeom, glowMat);

      // Orient glow tube along the axis direction
      const up = new THREE.Vector3(0, 0, 1);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      glowMesh.quaternion.copy(quat);
      glowMesh.name = `${key}-glow`;
      this.glowMeshes[key] = glowMesh;
      group.add(glowMesh);

      // --- Shadow (dashed) axis ---
      const shadowEnd = dir.clone().multiplyScalar(-SHADOW_LENGTH);
      const shadowGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        shadowEnd,
      ]);
      const shadowLine = new THREE.Line(shadowGeom,
        new THREE.LineDashedMaterial({
          color: color,
          linewidth: 1,
          transparent: true,
          opacity: 0.4,
          dashSize: 0.15,
          gapSize: 0.1,
        })
      );
      shadowLine.computeLineDistances();
      shadowLine.name = `${key}-shadow`;
      shadowLine.userData = { axisKey: key, isShadow: true };
      this.shadowAxes[key] = shadowLine;
      group.add(shadowLine);

      // --- Axis tip sphere (solid end) ---
      const tipGeom = new THREE.SphereGeometry(0.06, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
      });
      const tip = new THREE.Mesh(tipGeom, tipMat);
      tip.position.copy(solidEnd);
      tip.name = `${key}-tip`;
      group.add(tip);

      this.scene.add(group);
    });

    // --- Center nexus glow ---
    const nexusGeom = new THREE.SphereGeometry(0.1, 32, 32);
    const nexusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    this.nexus = new THREE.Mesh(nexusGeom, nexusMat);
    this.nexus.name = 'nexus';
    this.scene.add(this.nexus);

    // Outer nexus glow
    const nexusGlowGeom = new THREE.SphereGeometry(0.2, 32, 32);
    const nexusGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    this.nexusGlow = new THREE.Mesh(nexusGlowGeom, nexusGlowMat);
    this.scene.add(this.nexusGlow);
  }

  _createIQCeilingLine() {
    // A subtle dashed line on the EQ axis showing the IQ-capped effective position
    const dir = AXIS_DIRECTIONS.eq;
    const ceilingGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.3, 0, 0),
      new THREE.Vector3(0.3, 0, 0),
    ]);
    this.iqCeilingLine = new THREE.Line(ceilingGeom,
      new THREE.LineDashedMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        dashSize: 0.05,
        gapSize: 0.03,
      })
    );
    this.iqCeilingLine.computeLineDistances();
    this.iqCeilingLine.name = 'iq-ceiling';
    this.scene.add(this.iqCeilingLine);
  }

  /**
   * Update the IQ ceiling line position
   * @param {number} eqSlider - raw EQ slider value
   * @param {number} iqSlider - raw IQ slider value
   */
  setIQCeiling(eqSlider, iqSlider) {
    const shouldShow = iqSlider < 40;
    const iqFactor = iqSlider / 100;
    // Calculate the effective EQ position on the axis
    let eqForCalc = eqSlider;
    if (eqSlider > 85) {
      eqForCalc = 85 + (eqSlider - 85) * 0.3;
    }
    const effectiveEQ = eqForCalc * iqFactor;
    const ceilingHeight = (effectiveEQ / 100) * AXIS_LENGTH;

    this.iqCeilingLine.position.set(0, ceilingHeight, 0);

    const targetOpacity = shouldShow ? 0.5 : 0;
    this.iqCeilingLine.material.opacity += (targetOpacity - this.iqCeilingLine.material.opacity) * 0.12;
    this.iqCeilingVisible = shouldShow;
  }

  /**
   * Set EQ pulsing state (for EQ > 85 warning)
   */
  setEQPulsingState(isPulsing) {
    this.eqPulsing = isPulsing;
  }

  /**
   * Update pulsing effect — call from animation loop
   */
  updatePulsing(delta) {
    if (this.eqPulsing) {
      this.eqPulseTime += delta;
      const glowMesh = this.glowMeshes.eq;
      if (glowMesh) {
        const pulse = 0.2 + Math.sin(this.eqPulseTime * 4) * 0.15;
        glowMesh.material.opacity = pulse;
      }
    } else {
      this.eqPulseTime = 0;
    }
  }

  getSolidEndPosition(key) {
    if (this.solidAxes[key]) {
      const positions = this.solidAxes[key].geometry.attributes.position.array;
      return new THREE.Vector3(positions[3], positions[4], positions[5]);
    }
    const dir = AXIS_DIRECTIONS[key];
    return dir.clone().multiplyScalar(AXIS_LENGTH);
  }

  getShadowEndPosition(key) {
    if (this.shadowAxes[key]) {
      const positions = this.shadowAxes[key].geometry.attributes.position.array;
      return new THREE.Vector3(positions[3], positions[4], positions[5]);
    }
    const dir = AXIS_DIRECTIONS[key];
    return dir.clone().multiplyScalar(-SHADOW_LENGTH);
  }

  setAxisLength(key, effectiveVal, shadowVal, normalizedIntensity) {
    const dir = AXIS_DIRECTIONS[key];
    
    // Map effective value to 3D length
    const maxVal = key === 'eq' ? 100 : 160;
    // Don't let length be 0, to avoid totally collapsing vectors (keep a tiny minimum)
    const currentLen = Math.max((effectiveVal / maxVal) * AXIS_LENGTH, 0.01);
    const currentShadow = Math.max((shadowVal / 100) * SHADOW_LENGTH, 0.01);

    // Update solid line
    const solidEnd = dir.clone().multiplyScalar(currentLen);
    const solidLine = this.solidAxes[key];
    if (solidLine) {
       solidLine.geometry.attributes.position.setXYZ(1, solidEnd.x, solidEnd.y, solidEnd.z);
       solidLine.geometry.attributes.position.needsUpdate = true;
    }

    // Update glow mesh scale (don't override if EQ is pulsing)
    const glowMesh = this.glowMeshes[key];
    if (glowMesh) {
       glowMesh.scale.y = currentLen / AXIS_LENGTH;
       if (!(key === 'eq' && this.eqPulsing)) {
         glowMesh.material.opacity = 0.1 + (normalizedIntensity * 0.4);
       }
    }

    // Update shadow line
    const shadowEnd = dir.clone().multiplyScalar(-currentShadow);
    const shadowLine = this.shadowAxes[key];
    if (shadowLine) {
       shadowLine.geometry.attributes.position.setXYZ(1, shadowEnd.x, shadowEnd.y, shadowEnd.z);
       shadowLine.geometry.attributes.position.needsUpdate = true;
       shadowLine.computeLineDistances();
    }

    // Update tip
    const tip = this.axisGroups[key].getObjectByName(`${key}-tip`);
    if (tip) {
       tip.position.copy(solidEnd);
    }
  }

  // Set opacity of a specific axis (solid + glow)
  setSolidOpacity(key, opacity) {
    if (this.solidAxes[key]) {
      this.solidAxes[key].material.opacity = opacity;
    }
    if (this.glowMeshes[key]) {
      this.glowMeshes[key].material.opacity = opacity * 0.25;
    }
  }

  setShadowOpacity(key, opacity) {
    if (this.shadowAxes[key]) {
      this.shadowAxes[key].material.opacity = opacity;
    }
  }

  // Make an axis glow brighter
  brightenAxis(key, intensity = 1.5) {
    if (this.glowMeshes[key]) {
      this.glowMeshes[key].material.opacity = 0.25 * intensity;
    }
  }

  resetBrightness(key) {
    if (this.glowMeshes[key]) {
      this.glowMeshes[key].material.opacity = 0.25;
    }
  }

  getAxisTipPosition(key) {
    return this.getSolidEndPosition(key);
  }

  // Get all raycaster targets for hover detection
  getRaycastTargets() {
    const targets = [];
    Object.values(this.glowMeshes).forEach((mesh) => {
      targets.push(mesh);
    });
    return targets;
  }
}
