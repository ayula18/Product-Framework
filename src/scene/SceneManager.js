import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.autoRotate = false;
    this.autoRotateSpeed = 0.3; // degrees per second

    this._initScene();
    this._initCamera();
    this._initRenderer();
    this._initControls();
    this._initLights();
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    // Subtle fog for depth
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.015);
  }

  _initCamera() {
    const { width, height } = this._getSize();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(5, 4, 7);
    this.camera.lookAt(0, 0, 0);
  }

  _initRenderer() {
    const { width, height } = this._getSize();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 18;
    this.controls.enablePan = false;
    this.controls.autoRotate = false; // We handle auto-rotate manually
  }

  _initLights() {
    // Ambient for base visibility
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    // Subtle point lights for depth
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 0.5, 30);
    pointLight1.position.set(5, 8, 5);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3B82F6, 0.3, 30);
    pointLight2.position.set(-5, -3, -5);
    this.scene.add(pointLight2);
  }

  _getSize() {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
  }

  _onResize() {
    const { width, height } = this._getSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  update() {
    const delta = this.clock.getDelta();

    // Manual auto-rotate
    if (this.autoRotate) {
      this.scene.rotation.y += THREE.MathUtils.degToRad(this.autoRotateSpeed) * delta * 60;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  pauseAutoRotate() {
    this.autoRotate = false;
  }

  resumeAutoRotate() {
    this.autoRotate = false;
  }

  animateCameraTo(targetPos, duration = 1) {
    return new Promise((resolve) => {
      const startPos = this.camera.position.clone();
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / durationMs, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);

        this.camera.position.lerpVectors(startPos, targetPos, eased);
        this.camera.lookAt(0, 0, 0);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
    this.controls.dispose();
  }
}
