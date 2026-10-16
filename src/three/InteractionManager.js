import * as THREE from 'three';
import { ORGANELLE_MAP } from '../data/organelles.js';

const ENCLOSING_PRIORITY = {
  cytoplasm: 3,
  'plasma-membrane': 2,
  nucleus: 1
};

const ORGANELLE_VIEW_TARGETS = {
  'plasma-membrane': { target: [0.0, 0.0, 0.0], camPos: [3.4, 2.2, 4.6] },
  cytoplasm: { target: [0.2, -0.1, 0.2], camPos: [2.9, 1.8, 4.1] },
  nucleus: { target: [-0.22, 0.18, -0.18], camPos: [2.1, 1.5, 3.1] },
  'nuclear-envelope': { target: [-0.22, 0.18, -0.18], camPos: [2.2, 1.6, 3.2] },
  nucleolus: { target: [-0.28, 0.22, -0.23], camPos: [1.85, 1.25, 2.75] },
  chromatin: { target: [-0.22, 0.18, -0.18], camPos: [1.95, 1.4, 2.85] },
  'rough-er': { target: [-0.22, 0.15, 0.35], camPos: [2.3, 1.5, 3.4] },
  'smooth-er': { target: [-1.25, -0.25, 0.55], camPos: [-2.6, 1.1, 3.1] },
  ribosomes: { target: [0.4, -0.75, 0.65], camPos: [2.3, -0.2, 3.2] },
  'golgi-apparatus': { target: [0.72, -0.28, 0.58], camPos: [2.5, 0.8, 3.1] },
  mitochondria: { target: [1.18, 0.25, -0.45], camPos: [3.2, 1.3, 1.8] },
  lysosomes: { target: [0.95, -0.82, 0.18], camPos: [2.8, -0.4, 2.7] },
  vesicles: { target: [0.88, -0.35, 0.85], camPos: [2.6, 0.5, 3.2] },
  peroxisomes: { target: [-0.92, -0.82, 0.15], camPos: [-2.4, -0.4, 2.9] },
  centrosome: { target: [0.58, 0.42, 0.18], camPos: [2.4, 1.4, 2.8] },
  microtubules: { target: [0.58, 0.42, 0.18], camPos: [2.9, 1.7, 3.5] },
  'actin-filaments': { target: [0.0, 0.0, 0.0], camPos: [3.2, 1.9, 4.2] },
  'intermediate-filaments': { target: [-0.1, 0.1, 0.0], camPos: [2.8, 1.6, 3.6] }
};

const MIN_EXTERIOR_ARC_RADIUS = 2.75;

export class InteractionManager {
  constructor({
    camera,
    controls,
    domElement,
    cellModel,
    spatialModes,
    initialCameraPos,
    initialTarget,
    onSelectionChange,
    onLabelUpdate
  }) {
    this.camera = camera;
    this.controls = controls;
    this.domElement = domElement;
    this.cellModel = cellModel;
    this.spatialModes = spatialModes;
    this.initialCameraPos = initialCameraPos.clone();
    this.initialTarget = initialTarget.clone();
    this.onSelectionChange = onSelectionChange;
    this.onLabelUpdate = onLabelUpdate;

    this.raycaster = new THREE.Raycaster();
    this.pointerNDC = new THREE.Vector2();
    this.pointerDownPos = new THREE.Vector2();
    this.isPointerDown = false;

    this.selectedId = null;
    this.hoveredId = null;
    this.cameraTransition = null;

    this._prepareUniqueMaterials();
    this._bindEvents();
  }

  _prepareUniqueMaterials() {
    this.cellModel.organelleGroups.forEach((group, organelleId) => {
      group.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        if (child.material.visible === false) return;

        const clonedMat = child.material.clone();
        clonedMat.userData.baseOpacity = clonedMat.opacity;
        clonedMat.userData.baseTransparent = clonedMat.transparent;
        clonedMat.userData.baseDepthWrite = clonedMat.depthWrite;
        clonedMat.userData.baseEmissive = clonedMat.emissive
          ? clonedMat.emissive.clone()
          : new THREE.Color(0x000000);
        clonedMat.userData.baseEmissiveIntensity =
          clonedMat.emissiveIntensity ?? 0;
        clonedMat.userData.organelleId = organelleId;
        child.material = clonedMat;
      });
    });
  }

  _bindEvents() {
    this._onPointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      this.isPointerDown = true;
      this.pointerDownPos.set(event.clientX, event.clientY);
    };

    this._onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      if (!this.cellModel.root.visible) {
        this.hoveredId = null;
        this.domElement.style.cursor = 'grab';
        return;
      }
      const hitId = this._pickOrganelleAtClientPos(event.clientX, event.clientY);
      if (hitId !== this.hoveredId) {
        this.hoveredId = hitId;
        this.domElement.style.cursor = hitId ? 'pointer' : 'grab';
        this.refreshMaterials();
      }
    };

    this._onPointerUp = (event) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;

      if (!this.cellModel.root.visible) return;

      const dx = event.clientX - this.pointerDownPos.x;
      const dy = event.clientY - this.pointerDownPos.y;
      const movedDist = Math.hypot(dx, dy);

      if (movedDist > 6) return;

      const hitId = this._pickOrganelleAtClientPos(event.clientX, event.clientY);
      if (hitId) {
        this.selectOrganelle(hitId, { focusCamera: true });
      } else {
        this.clearSelection();
      }
    };

    this._onControlsStart = () => {
      this.cameraTransition = null;
    };

    this.domElement.addEventListener('pointerdown', this._onPointerDown);
    this.domElement.addEventListener('pointermove', this._onPointerMove);
    this.domElement.addEventListener('pointerup', this._onPointerUp);
    this.controls.addEventListener('start', this._onControlsStart);
  }

  _isOrganelleVisible(organelleId) {
    const group = this.cellModel.getOrganelleObject(organelleId);
    return Boolean(group && group.visible);
  }

  _pickOrganelleAtClientPos(clientX, clientY) {
    if (!this.cellModel.root.visible) return null;

    const rect = this.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    this.pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointerNDC, this.camera);

    const visibleMeshes = this.cellModel.selectableMeshes.filter((mesh) => {
      const id = mesh.userData.organelleId;
      return id && this._isOrganelleVisible(id);
    });

    const intersections = this.raycaster.intersectObjects(visibleMeshes, false);
    if (intersections.length === 0) return null;

    const boundaryPeeled =
      this.spatialModes && this.spatialModes.isBoundaryPeeled();

    const uniqueHits = [];
    const seenIds = new Set();

    for (const hit of intersections) {
      if (this.spatialModes && this.spatialModes.isPointClipped(hit.point)) {
        continue;
      }

      const id = hit.object.userData.organelleId;
      if (!id || seenIds.has(id)) continue;

      let enclosingRank = ENCLOSING_PRIORITY[id] || 0;
      if (
        boundaryPeeled &&
        (id === 'plasma-membrane' ||
          id === 'cytoplasm' ||
          id === 'nuclear-envelope' ||
          id === 'nucleus')
      ) {
        enclosingRank += 5;
      }

      seenIds.add(id);
      uniqueHits.push({
        id,
        distance: hit.distance,
        enclosingRank
      });
    }

    if (uniqueHits.length === 0) return null;

    uniqueHits.sort((a, b) => {
      if (a.enclosingRank !== b.enclosingRank) {
        return a.enclosingRank - b.enclosingRank;
      }
      return a.distance - b.distance;
    });

    return uniqueHits[0]?.id || null;
  }

  refreshMaterials() {
    const activeSelected = this.selectedId;
    const activeHovered = this.hoveredId;
    const boundaryPeeled =
      this.spatialModes && this.spatialModes.isBoundaryPeeled();

    this.cellModel.organelleGroups.forEach((group, organelleId) => {
      const meta = ORGANELLE_MAP.get(organelleId);
      const isSelected = organelleId === activeSelected;
      const isHovered = organelleId === activeHovered && !isSelected;

      group.traverse((child) => {
        if (!child.isMesh || !child.material) return;
        const mat = child.material;
        if (mat.visible === false) return;

        if (mat.emissive) {
          if (isSelected && meta) {
            mat.emissive.set(meta.color);
            mat.emissiveIntensity = 0.45;
          } else if (isHovered && meta) {
            mat.emissive.set(meta.color);
            mat.emissiveIntensity = 0.22;
          } else {
            mat.emissive.copy(mat.userData.baseEmissive);
            mat.emissiveIntensity = mat.userData.baseEmissiveIntensity;
          }
        }

        const isOuterBoundary =
          organelleId === 'plasma-membrane' || organelleId === 'cytoplasm';
        const isNuclearShell =
          organelleId === 'nuclear-envelope' || organelleId === 'nucleus';

        if (boundaryPeeled && isOuterBoundary && !isSelected) {
          mat.transparent = true;
          mat.opacity = organelleId === 'cytoplasm' ? 0.05 : 0.11;
          mat.depthWrite = false;
        } else if (boundaryPeeled && isNuclearShell && !isSelected) {
          mat.transparent = true;
          mat.opacity = 0.24;
          mat.depthWrite = false;
        } else if (activeSelected && !isSelected && isOuterBoundary) {
          mat.transparent = true;
          mat.opacity = Math.min(mat.userData.baseOpacity, 0.22);
          mat.depthWrite = false;
        } else {
          mat.transparent = mat.userData.baseTransparent;
          mat.opacity = mat.userData.baseOpacity;
          mat.depthWrite = mat.userData.baseDepthWrite;
        }
      });
    });
  }

  selectOrganelle(organelleId, { focusCamera = true } = {}) {
    if (!organelleId || !ORGANELLE_MAP.has(organelleId)) return;
    if (!this._isOrganelleVisible(organelleId)) return;

    this.selectedId = organelleId;
    this.refreshMaterials();

    if (focusCamera && this.cellModel.root.visible) {
      this.focusOnOrganelle(organelleId);
    }

    if (this.onSelectionChange) {
      this.onSelectionChange(ORGANELLE_MAP.get(organelleId));
    }
  }

  clearSelection({ resetCamera = false } = {}) {
    const hadSelection = this.selectedId !== null;
    this.selectedId = null;
    this.refreshMaterials();

    if (resetCamera) {
      this.startCameraTransition(this.initialCameraPos, this.initialTarget);
    }

    if (hadSelection && this.onSelectionChange) {
      this.onSelectionChange(null);
    }
  }

  handleVisibilityChange(organelleId, visible) {
    if (!visible && this.selectedId === organelleId) {
      this.clearSelection();
    }
    if (!visible && this.hoveredId === organelleId) {
      this.hoveredId = null;
      this.refreshMaterials();
    }
  }

  focusOnOrganelle(organelleId) {
    const viewSpec = ORGANELLE_VIEW_TARGETS[organelleId];
    if (!viewSpec) return;

    const explodeOffset = this.spatialModes
      ? this.spatialModes.getOrganelleExplosionOffset(organelleId)
      : new THREE.Vector3();

    const targetVec = new THREE.Vector3(...viewSpec.target).add(explodeOffset);
    const camPosVec = new THREE.Vector3(...viewSpec.camPos).add(explodeOffset);
    this.startCameraTransition(camPosVec, targetVec);
  }

  startCameraTransition(endCameraPos, endTarget, durationMs = 620) {
    const startCameraPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    const startSpherical = new THREE.Spherical().setFromVector3(startCameraPos);
    const endSpherical = new THREE.Spherical().setFromVector3(endCameraPos);

    let deltaTheta = endSpherical.theta - startSpherical.theta;
    while (deltaTheta > Math.PI) deltaTheta -= Math.PI * 2;
    while (deltaTheta < -Math.PI) deltaTheta += Math.PI * 2;

    this.cameraTransition = {
      startTime: performance.now(),
      durationMs,
      startSpherical,
      endSpherical,
      deltaTheta,
      startTarget,
      endTarget: endTarget.clone(),
      enforceExteriorArc: this.cellModel.root.visible
    };
  }

  _updateFloatingLabelProjection() {
    if (!this.onLabelUpdate) return;

    if (!this.cellModel.root.visible) {
      this.onLabelUpdate(null);
      return;
    }

    const activeId = this.selectedId || this.hoveredId;
    if (!activeId || !this._isOrganelleVisible(activeId)) {
      this.onLabelUpdate(null);
      return;
    }

    const meta = ORGANELLE_MAP.get(activeId);
    if (!meta) {
      this.onLabelUpdate(null);
      return;
    }

    const worldAnchor = this.spatialModes
      ? this.spatialModes.getOrganelleWorldAnchor(activeId)
      : new THREE.Vector3();

    const projected = worldAnchor.clone().project(this.camera);
    if (projected.z > 1) {
      this.onLabelUpdate(null);
      return;
    }

    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-(projected.y * 0.5) + 0.5) * height;

    this.onLabelUpdate({
      id: activeId,
      name: meta.name,
      category: meta.category,
      color: meta.color,
      isSelected: activeId === this.selectedId,
      x,
      y
    });
  }

  update(now = performance.now()) {
    if (this.cameraTransition) {
      const {
        startTime,
        durationMs,
        startSpherical,
        endSpherical,
        deltaTheta,
        startTarget,
        endTarget,
        enforceExteriorArc
      } = this.cameraTransition;

      const elapsed = now - startTime;
      const rawT = Math.min(1, Math.max(0, elapsed / durationMs));
      const easeT = 1 - Math.pow(1 - rawT, 3);

      let radius = THREE.MathUtils.lerp(
        startSpherical.radius,
        endSpherical.radius,
        easeT
      );

      // Smoothly arch outward at midpoint if sweeping across the cell exterior
      if (enforceExteriorArc && Math.abs(deltaTheta) > 0.6) {
        const midClearance =
          Math.max(0, MIN_EXTERIOR_ARC_RADIUS - radius) *
          Math.sin(easeT * Math.PI);
        radius += midClearance;
      }

      const currentSpherical = new THREE.Spherical(
        radius,
        THREE.MathUtils.lerp(startSpherical.phi, endSpherical.phi, easeT),
        startSpherical.theta + deltaTheta * easeT
      );

      this.camera.position.setFromSpherical(currentSpherical);
      this.controls.target.lerpVectors(startTarget, endTarget, easeT);

      if (rawT >= 1) {
        this.cameraTransition = null;
      }
    }

    this._updateFloatingLabelProjection();
  }

  dispose() {
    this.domElement.removeEventListener('pointerdown', this._onPointerDown);
    this.domElement.removeEventListener('pointermove', this._onPointerMove);
    this.domElement.removeEventListener('pointerup', this._onPointerUp);
    this.controls.removeEventListener('start', this._onControlsStart);
  }
}