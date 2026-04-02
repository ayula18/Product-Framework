import * as THREE from 'three';
import { AXIS_DIRECTIONS } from './Axes.js';

const AXIS_LENGTH = 4;
const SUBDIVISIONS = 4;

export class IronTriangle {
  constructor(scene) {
    this.scene = scene;
    this._create();
  }

  _create() {
    this.group = new THREE.Group();
    this.group.name = 'volume-shape';
    this.scene.add(this.group);

    // 1. Solid volume material (frosted glass)
    const geometry = new THREE.BufferGeometry();
    
    // 4 faces, 3 vertices each = 12 vertices
    const vertices = new Float32Array(12 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    this.material = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6, // Base EQ color or soft custom color
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.group.add(this.mesh);

    // 2. Wireframe grid material
    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = new Float32Array(5000); 
    gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridVertices, 3));
    
    this.gridMaterial = new THREE.LineBasicMaterial({
      color: 0xc8508c,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    this.gridLines = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    this.group.add(this.gridLines);

    // 3. Comparison volume (for SpaceX vs Boeing)
    this._createComparisonVolume();
  }

  _createComparisonVolume() {
    this.comparisonGroup = new THREE.Group();
    this.comparisonGroup.name = 'comparison-volume';
    this.comparisonGroup.visible = false;
    this.scene.add(this.comparisonGroup);

    // Solid faces
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(12 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    this.comparisonMaterial = new THREE.MeshBasicMaterial({
      color: 0x6088AA,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.comparisonMesh = new THREE.Mesh(geometry, this.comparisonMaterial);
    this.comparisonGroup.add(this.comparisonMesh);

    // Grid lines
    const gridGeometry = new THREE.BufferGeometry();
    const gridVertices = new Float32Array(5000);
    gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridVertices, 3));

    this.comparisonGridMaterial = new THREE.LineBasicMaterial({
      color: 0x6088AA,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    this.comparisonGridLines = new THREE.LineSegments(gridGeometry, this.comparisonGridMaterial);
    this.comparisonGroup.add(this.comparisonGridLines);
  }

  setOpacity(opacity) {
    this.material.opacity = opacity * 0.04;
    this.gridMaterial.opacity = opacity * 0.15;
  }

  setTensionState(isOverAllocated) {
    if (isOverAllocated) {
      this.material.color.setHex(0xFF4444);
      this.material.opacity = 0.12;
      this.gridMaterial.color.setHex(0xFF4444);
    } else {
      this.material.color.setHex(0x8B5CF6);
      this.material.opacity = 0.04;
      this.gridMaterial.color.setHex(0xc8508c);
    }
  }

  updateVertices(money, time, quality, eq) {
    if (!eq) return; // safeguard

    // Update solid faces
    const pos = this.mesh.geometry.attributes.position.array;
    let idx = 0;
    const addFace = (v1, v2, v3) => {
      pos[idx++] = v1.x; pos[idx++] = v1.y; pos[idx++] = v1.z;
      pos[idx++] = v2.x; pos[idx++] = v2.y; pos[idx++] = v2.z;
      pos[idx++] = v3.x; pos[idx++] = v3.y; pos[idx++] = v3.z;
    };

    // Face 1: base (money, time, quality)
    addFace(money, time, quality);
    // Face 2: money, time, eq
    addFace(money, time, eq);
    // Face 3: time, quality, eq
    addFace(time, quality, eq);
    // Face 4: quality, money, eq
    addFace(quality, money, eq);

    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();

    // Update grid lines
    this._updateGridLines(this.gridLines, money, time, quality, eq);
  }

  _updateGridLines(linesMesh, money, time, quality, eq) {
    const gridPos = linesMesh.geometry.attributes.position.array;
    let gridIdx = 0;
    const addLine = (v1, v2) => {
      gridPos[gridIdx++] = v1.x; gridPos[gridIdx++] = v1.y; gridPos[gridIdx++] = v1.z;
      gridPos[gridIdx++] = v2.x; gridPos[gridIdx++] = v2.y; gridPos[gridIdx++] = v2.z;
    };

    const addSubdividedFace = (vA, vB, vC, segments) => {
      for (let i = 0; i <= segments; i++) {
        const t1 = i / segments;
        const p1 = new THREE.Vector3().lerpVectors(vC, vA, t1);
        const p2 = new THREE.Vector3().lerpVectors(vC, vB, t1);
        if (i > 0) addLine(p1, p2);

        const p3 = new THREE.Vector3().lerpVectors(vB, vA, t1);
        const p4 = new THREE.Vector3().lerpVectors(vB, vC, t1);
        if (i > 0) addLine(p3, p4);

        const p5 = new THREE.Vector3().lerpVectors(vA, vB, t1);
        const p6 = new THREE.Vector3().lerpVectors(vA, vC, t1);
        if (i > 0) addLine(p5, p6);
      }
    };

    addSubdividedFace(money, time, quality, SUBDIVISIONS);
    addSubdividedFace(money, time, eq, SUBDIVISIONS);
    addSubdividedFace(time, quality, eq, SUBDIVISIONS);
    addSubdividedFace(quality, money, eq, SUBDIVISIONS);

    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.setDrawRange(0, gridIdx / 3);
  }

  /**
   * Show comparison volume (for SpaceX vs Boeing overlay)
   * @param {THREE.Vector3} money - money axis end position
   * @param {THREE.Vector3} time - time axis end position
   * @param {THREE.Vector3} quality - quality axis end position
   * @param {THREE.Vector3} eq - eq axis end position
   */
  showComparisonVolume(money, time, quality, eq) {
    this.comparisonGroup.visible = true;

    // Update solid faces
    const pos = this.comparisonMesh.geometry.attributes.position.array;
    let idx = 0;
    const addFace = (v1, v2, v3) => {
      pos[idx++] = v1.x; pos[idx++] = v1.y; pos[idx++] = v1.z;
      pos[idx++] = v2.x; pos[idx++] = v2.y; pos[idx++] = v2.z;
      pos[idx++] = v3.x; pos[idx++] = v3.y; pos[idx++] = v3.z;
    };

    addFace(money, time, quality);
    addFace(money, time, eq);
    addFace(time, quality, eq);
    addFace(quality, money, eq);

    this.comparisonMesh.geometry.attributes.position.needsUpdate = true;
    this.comparisonMesh.geometry.computeVertexNormals();

    // Update grid
    this._updateGridLines(this.comparisonGridLines, money, time, quality, eq);
  }

  hideComparisonVolume() {
    this.comparisonGroup.visible = false;
  }
}
