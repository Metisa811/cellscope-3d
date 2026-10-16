import * as THREE from 'three';

export const EXPLODED_VECTORS = {
  'plasma-membrane': new THREE.Vector3(0.0, -1.45, -0.75),
  cytoplasm: new THREE.Vector3(0.0, -1.0, -0.45),
  nucleus: new THREE.Vector3(-0.32, 0.72, -0.32),
  'nuclear-envelope': new THREE.Vector3(-0.52, 1.05, -0.52),
  chromatin: new THREE.Vector3(-0.14, 1.32, -0.14),
  nucleolus: new THREE.Vector3(0.12, 1.62, 0.08),
  'rough-er': new THREE.Vector3(-1.05, 0.35, 0.38),
  'smooth-er': new THREE.Vector3(-1.55, -0.28, 0.78),
  ribosomes: new THREE.Vector3(-0.75, -0.68, 0.98),
  'golgi-apparatus': new THREE.Vector3(0.95, -0.22, 1.05),
  vesicles: new THREE.Vector3(1.48, -0.35, 1.38),
  lysosomes: new THREE.Vector3(1.32, -1.05, 0.45),
  mitochondria: new THREE.Vector3(1.55, 0.42, -0.52),
  peroxisomes: new THREE.Vector3(-1.28, -0.95, -0.55),
  centrosome: new THREE.Vector3(0.85, 0.98, 0.35),
  microtubules: new THREE.Vector3(1.15, 0.75, -0.18),
  'intermediate-filaments': new THREE.Vector3(-0.68, 0.65, -1.15),
  'actin-filaments': new THREE.Vector3(0.0, -1.22, -0.62)
};

export const ORGANELLE_ANCHORS = {
  'plasma-membrane': new THREE.Vector3(0.0, -2.0, 0.0),
  cytoplasm: new THREE.Vector3(0.0, -1.2, 0.0),
  nucleus: new THREE.Vector3(-0.22, 0.18, -0.18),
  'nuclear-envelope': new THREE.Vector3(-0.22, 0.55, -0.18),
  nucleolus: new THREE.Vector3(-0.28, 0.22, -0.23),
  chromatin: new THREE.Vector3(-0.22, 0.38, -0.18),
  'rough-er': new THREE.Vector3(-0.65, 0.15, 0.25),
  'smooth-er': new THREE.Vector3(-1.25, -0.25, 0.55),
  ribosomes: new THREE.Vector3(0.4, -0.75, 0.65),
  'golgi-apparatus': new THREE.Vector3(0.72, -0.28, 0.58),
  mitochondria: new THREE.Vector3(1.18, 0.25, -0.45),
  lysosomes: new THREE.Vector3(0.95, -0.82, 0.18),
  vesicles: new THREE.Vector3(0.88, -0.35, 0.85),
  peroxisomes: new THREE.Vector3(-0.92, -0.82, 0.15),
  centrosome: new THREE.Vector3(0.58, 0.42, 0.18),
  microtubules: new THREE.Vector3(1.1, 0.55, 0.15),
  'actin-filaments': new THREE.Vector3(0.0, -1.75, 0.65),
  'intermediate-filaments': new THREE.Vector3(-0.55, 0.45, -0.75)
};

export class SpatialModesController {
  constructor({ scene, renderer, cellModel }) {
    this.scene = scene;
    this.renderer = renderer;
    this.cellModel = cellModel;

    this.targetExplode = 0;
    this.currentExplode = 0;

    this.crossSectionMode = 'standard';
    this.sliceAxis = 'y';
    this.sliceOffset = 0.0;
    this.molecularStageActive = false;
    this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.0);

    this.tetherGroup = new THREE.Group();
    this.tetherGroup.name = 'ExplodedTetherGuides';
    this.tetherLines = new Map();
    this.scene.add(this.tetherGroup);

    this.sliceGuideGroup = new THREE.Group();
    this.sliceGuideGroup.name = 'CrossSectionPlaneGuide';
    this.sliceGuideGroup.visible = false;
    this.scene.add(this.sliceGuideGroup);

    this._initTetherLines();
    this._initSliceGuide();
  }

  _initTetherLines() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.45
    });

    this.cellModel.organelleGroups.forEach((group, id) => {
      const origin = ORGANELLE_ANCHORS[id] || new THREE.Vector3();
      const points = [origin.clone(), origin.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      line.visible = false;
      this.tetherGroup.add(line);
      this.tetherLines.set(id, { line, origin: origin.clone() });
    });
  }

  _initSliceGuide() {
    const ringGeo = new THREE.RingGeometry(2.32, 2.36, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    this.sliceRingMesh = new THREE.Mesh(ringGeo, ringMat);

    const discGeo = new THREE.CircleGeometry(2.32, 64);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.06,
      depthWrite: false
    });
    this.sliceDiscMesh = new THREE.Mesh(discGeo, discMat);

    this.sliceGuideGroup.add(this.sliceRingMesh, this.sliceDiscMesh);
  }

  setMolecularStageActive(isActive) {
    this.molecularStageActive = Boolean(isActive);
    this._updateCrossSectionState();
  }

  setExplodeFactor(value, { immediate = false } = {}) {
    const clamped = THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
    this.targetExplode = clamped;
    if (immediate) {
      this.currentExplode = clamped;
      this._applyExplodePositions();
    }
  }

  getExplodeFactor() {
    return this.targetExplode;
  }

  setCrossSectionMode(mode) {
    const validModes = ['standard', 'boundary-peel', 'planar-slice'];
    this.crossSectionMode = validModes.includes(mode) ? mode : 'standard';
    this._updateCrossSectionState();
  }

  setSliceAxis(axis) {
    if (['x', 'y', 'z'].includes(axis)) {
      this.sliceAxis = axis;
      this._updateCrossSectionState();
    }
  }

  setSliceOffset(offset) {
    this.sliceOffset = THREE.MathUtils.clamp(Number(offset) || 0, -2.2, 2.2);
    this._updateCrossSectionState();
  }

  _updateCrossSectionState() {
    if (this.molecularStageActive) {
      this.renderer.clippingPlanes = [];
      this.sliceGuideGroup.visible = false;
      return;
    }

    if (this.crossSectionMode === 'planar-slice') {
      if (this.sliceAxis === 'x') {
        this.clippingPlane.normal.set(-1, 0, 0);
        this.sliceGuideGroup.rotation.set(0, Math.PI / 2, 0);
        this.sliceGuideGroup.position.set(this.sliceOffset, 0, 0);
      } else if (this.sliceAxis === 'z') {
        this.clippingPlane.normal.set(0, 0, -1);
        this.sliceGuideGroup.rotation.set(0, 0, 0);
        this.sliceGuideGroup.position.set(0, 0, this.sliceOffset);
      } else {
        this.clippingPlane.normal.set(0, -1, 0);
        this.sliceGuideGroup.rotation.set(Math.PI / 2, 0, 0);
        this.sliceGuideGroup.position.set(0, this.sliceOffset, 0);
      }
      this.clippingPlane.constant = this.sliceOffset;
      this.renderer.clippingPlanes = [this.clippingPlane];
      this.sliceGuideGroup.visible = true;
    } else {
      this.renderer.clippingPlanes = [];
      this.sliceGuideGroup.visible = false;
    }
  }

  isBoundaryPeeled() {
    return !this.molecularStageActive && this.crossSectionMode === 'boundary-peel';
  }

  isPointClipped(worldPoint) {
    if (this.molecularStageActive || this.crossSectionMode !== 'planar-slice') {
      return false;
    }
    return this.clippingPlane.distanceToPoint(worldPoint) < -0.001;
  }

  getOrganelleExplosionOffset(organelleId) {
    const vec = EXPLODED_VECTORS[organelleId];
    if (!vec) return new THREE.Vector3();
    return vec.clone().multiplyScalar(this.currentExplode);
  }

  getOrganelleWorldAnchor(organelleId) {
    const baseAnchor = ORGANELLE_ANCHORS[organelleId] || new THREE.Vector3();
    return baseAnchor.clone().add(this.getOrganelleExplosionOffset(organelleId));
  }

  _applyExplodePositions() {
    const showTethers = this.currentExplode > 0.015;

    this.cellModel.organelleGroups.forEach((group, id) => {
      const restPos = group.userData.restPosition || new THREE.Vector3();
      const explodeVec = EXPLODED_VECTORS[id] || new THREE.Vector3();

      group.position
        .copy(restPos)
        .addScaledVector(explodeVec, this.currentExplode);

      const tetherEntry = this.tetherLines.get(id);
      if (tetherEntry) {
        tetherEntry.line.visible = Boolean(group.visible && showTethers);
        if (tetherEntry.line.visible) {
          const posAttr = tetherEntry.line.geometry.attributes.position;
          const endPt = tetherEntry.origin
            .clone()
            .addScaledVector(explodeVec, this.currentExplode);
          posAttr.setXYZ(
            0,
            tetherEntry.origin.x,
            tetherEntry.origin.y,
            tetherEntry.origin.z
          );
          posAttr.setXYZ(1, endPt.x, endPt.y, endPt.z);
          posAttr.needsUpdate = true;
        }
      }
    });
  }

  resetAllModes() {
    this.targetExplode = 0;
    this.sliceAxis = 'y';
    this.sliceOffset = 0.0;
    this.molecularStageActive = false;
    this.setCrossSectionMode('standard');
  }

  update() {
    const diff = this.targetExplode - this.currentExplode;
    if (Math.abs(diff) > 0.0005) {
      this.currentExplode += diff * 0.14;
      this._applyExplodePositions();
    } else if (this.currentExplode !== this.targetExplode) {
      this.currentExplode = this.targetExplode;
      this._applyExplodePositions();
    } else {
      const showTethers = this.currentExplode > 0.015;
      this.tetherLines.forEach((tetherEntry, id) => {
        const group = this.cellModel.getOrganelleObject(id);
        tetherEntry.line.visible = Boolean(
          group && group.visible && showTethers
        );
      });
    }
  }

  dispose() {
    this.renderer.clippingPlanes = [];
    this.tetherLines.forEach(({ line }) => {
      line.geometry.dispose();
    });
  }
}