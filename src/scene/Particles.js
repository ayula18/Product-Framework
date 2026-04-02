import * as THREE from 'three';
import { AXIS_DATA } from '../ui/content.js';

const PARTICLE_COUNT = 60;

export class Particles {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.particleSystems = {};
    this._createParticleSystem();
  }

  _createParticleSystem() {
    const keys = ['money', 'time', 'quality'];

    keys.forEach((key) => {
      const color = new THREE.Color(AXIS_DATA[key].color);
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const velocities = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        velocities.push(new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
        ));
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: color,
        size: 0.04,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      points.visible = false;
      this.scene.add(points);

      this.particleSystems[key] = {
        mesh: points,
        geometry,
        material,
        velocities,
        life: 0,
      };
    });
  }

  emit(key, origin) {
    const sys = this.particleSystems[key];
    if (!sys) return;

    sys.mesh.visible = true;
    sys.material.opacity = 0.8;
    sys.life = 0;

    const positions = sys.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = origin.x + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = origin.y + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.3;

      sys.velocities[i].set(
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12,
      );
    }

    sys.geometry.attributes.position.needsUpdate = true;
    this.active = true;
  }

  update(delta) {
    if (!this.active) return;

    let anyActive = false;

    Object.values(this.particleSystems).forEach((sys) => {
      if (!sys.mesh.visible || sys.material.opacity <= 0) return;

      anyActive = true;
      sys.life += delta;

      const positions = sys.geometry.attributes.position.array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] += sys.velocities[i].x;
        positions[i * 3 + 1] += sys.velocities[i].y;
        positions[i * 3 + 2] += sys.velocities[i].z;

        // Slow down
        sys.velocities[i].multiplyScalar(0.97);
      }

      sys.geometry.attributes.position.needsUpdate = true;

      // Fade out over 2 seconds
      sys.material.opacity = Math.max(0, 0.8 - sys.life * 0.4);

      if (sys.material.opacity <= 0) {
        sys.mesh.visible = false;
      }
    });

    if (!anyActive) this.active = false;
  }

  reset() {
    Object.values(this.particleSystems).forEach((sys) => {
      sys.mesh.visible = false;
      sys.material.opacity = 0;
    });
    this.active = false;
  }
}
