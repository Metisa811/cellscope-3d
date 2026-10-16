import * as THREE from 'three';
import { ORGANELLE_MAP } from '../data/organelles.js';
import {
  SCALE_LEVELS,
  SCALE_LEVEL_MAP,
  ORGANELLE_MOLECULAR_DATA
} from '../data/scaleLevels.js';

const LEVEL_ORDER = ['whole-cell', 'organelle', 'molecular-complex', 'molecule'];

export class ScaleExplorerController {
  constructor({
    scene,
    cellModel,
    spatialModes,
    interactionManager,
    isGuideEnabled,
    guideGroup,
    onScaleStateChange,
    onEnsureOrganelleVisible
  }) {
    this.scene = scene;
    this.cellModel = cellModel;
    this.spatialModes = spatialModes;
    this.interactionManager = interactionManager;
    this.isGuideEnabled = isGuideEnabled;
    this.guideGroup = guideGroup;
    this.onScaleStateChange = onScaleStateChange;
    this.onEnsureOrganelleVisible = onEnsureOrganelleVisible;

    this.currentLevelId = 'whole-cell';
    this.activeOrganelleId = 'mitochondria';
    this.historyStack = [];

    this.pdbLoadState = 'schematic';
    this.pdbAtomCount = 0;
    this.pdbCache = new Map();

    this.molecularStageGroup = new THREE.Group();
    this.molecularStageGroup.name = 'MolecularScaleStage';
    this.molecularStageGroup.visible = false;
    this.scene.add(this.molecularStageGroup);

    this.stagePedestalGroup = new THREE.Group();
    this.stageModelGroup = new THREE.Group();
    this.molecularStageGroup.add(this.stagePedestalGroup, this.stageModelGroup);

    this._buildStagePedestal();
  }

  _buildStagePedestal() {
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 1.88, 72),
      new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      })
    );
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = -1.35;

    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 0.97, 64),
      new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      })
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = -1.35;

    this.stagePedestalGroup.add(outerRing, innerRing);
  }

  syncSelectedOrganelle(organelleId) {
    if (organelleId && ORGANELLE_MAP.has(organelleId)) {
      this.activeOrganelleId = organelleId;
      if (
        this.currentLevelId === 'molecular-complex' ||
        this.currentLevelId === 'molecule'
      ) {
        this.pdbLoadState = 'schematic';
        this.pdbAtomCount = 0;
        this._rebuildMolecularStageGeometry();
      }
      this._notifyState();
    }
  }

  getCurrentState() {
    const levelMeta = SCALE_LEVEL_MAP.get(this.currentLevelId);
    const organelleMeta =
      ORGANELLE_MAP.get(this.activeOrganelleId) ||
      ORGANELLE_MAP.get('mitochondria');
    const molEntry =
      ORGANELLE_MOLECULAR_DATA[organelleMeta.id] ||
      ORGANELLE_MOLECULAR_DATA.mitochondria;

    const activeSubRecord =
      this.currentLevelId === 'molecule' ? molEntry.molecule : molEntry.complex;

    const levelIndex = LEVEL_ORDER.indexOf(this.currentLevelId);

    return {
      currentLevelId: this.currentLevelId,
      levelIndex,
      levelMeta,
      levels: SCALE_LEVELS,
      organelle: organelleMeta,
      molecularRecord: activeSubRecord,
      canGoBack: this.historyStack.length > 0 || levelIndex > 0,
      canGoDeeper: levelIndex < LEVEL_ORDER.length - 1,
      pdbLoadState: this.pdbLoadState,
      pdbAtomCount: this.pdbAtomCount
    };
  }

  transitionToLevel(targetLevelId, { pushHistory = true } = {}) {
    if (!SCALE_LEVEL_MAP.has(targetLevelId)) return;

    if (pushHistory && targetLevelId !== this.currentLevelId) {
      this.historyStack.push({
        levelId: this.currentLevelId,
        organelleId: this.activeOrganelleId
      });
      if (this.historyStack.length > 16) {
        this.historyStack.shift();
      }
    }

    if (targetLevelId !== 'whole-cell') {
      const selected = this.interactionManager.selectedId;
      if (selected && ORGANELLE_MAP.has(selected)) {
        this.activeOrganelleId = selected;
      } else if (!this.activeOrganelleId) {
        this.activeOrganelleId = 'mitochondria';
      }
    }

    this.currentLevelId = targetLevelId;
    this.pdbLoadState = 'schematic';
    this.pdbAtomCount = 0;

    if (targetLevelId === 'whole-cell') {
      this._enterWholeCellLevel();
    } else if (targetLevelId === 'organelle') {
      this._enterOrganelleLevel();
    } else {
      this._enterMolecularLevel(targetLevelId);
    }

    this._notifyState();
  }

  stepBack() {
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      this.activeOrganelleId = prev.organelleId || this.activeOrganelleId;
      this.transitionToLevel(prev.levelId, { pushHistory: false });
      return;
    }

    const currentIndex = LEVEL_ORDER.indexOf(this.currentLevelId);
    if (currentIndex > 0) {
      const prevLevelId = LEVEL_ORDER[currentIndex - 1];
      this.transitionToLevel(prevLevelId, { pushHistory: false });
    }
  }

  stepForward() {
    const currentIndex = LEVEL_ORDER.indexOf(this.currentLevelId);
    if (currentIndex < LEVEL_ORDER.length - 1) {
      const nextLevelId = LEVEL_ORDER[currentIndex + 1];
      this.transitionToLevel(nextLevelId, { pushHistory: true });
    }
  }

  _enterWholeCellLevel() {
    this.molecularStageGroup.visible = false;
    this.cellModel.root.visible = true;
    this.spatialModes.tetherGroup.visible = true;
    this.spatialModes.setMolecularStageActive(false);
    this.guideGroup.visible = this.isGuideEnabled ? this.isGuideEnabled() : true;

    this.interactionManager.startCameraTransition(
      new THREE.Vector3(3.4, 2.3, 4.8),
      new THREE.Vector3(0, -0.05, 0),
      650
    );
  }

  _enterOrganelleLevel() {
    this.molecularStageGroup.visible = false;
    this.cellModel.root.visible = true;
    this.spatialModes.tetherGroup.visible = true;
    this.spatialModes.setMolecularStageActive(false);
    this.guideGroup.visible = this.isGuideEnabled ? this.isGuideEnabled() : true;

    this.cellModel.setOrganelleVisible(this.activeOrganelleId, true);
    if (this.onEnsureOrganelleVisible) {
      this.onEnsureOrganelleVisible(this.activeOrganelleId);
    }
    this.interactionManager.selectOrganelle(this.activeOrganelleId, {
      focusCamera: true
    });
  }

  _enterMolecularLevel(levelId) {
    this.cellModel.root.visible = false;
    this.spatialModes.tetherGroup.visible = false;
    this.spatialModes.setMolecularStageActive(true);
    this.guideGroup.visible = false;

    this.molecularStageGroup.visible = true;
    this._rebuildMolecularStageGeometry();

    const camPos =
      levelId === 'molecular-complex'
        ? new THREE.Vector3(0.0, 1.15, 3.85)
        : new THREE.Vector3(0.0, 0.85, 3.15);

    this.interactionManager.startCameraTransition(
      camPos,
      new THREE.Vector3(0, 0, 0),
      650
    );
  }

  _clearStageModelGroup() {
    while (this.stageModelGroup.children.length > 0) {
      const child = this.stageModelGroup.children.pop();
      child.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }

  _rebuildMolecularStageGeometry() {
    this._clearStageModelGroup();

    const orgMeta =
      ORGANELLE_MAP.get(this.activeOrganelleId) ||
      ORGANELLE_MAP.get('mitochondria');
    const molEntry =
      ORGANELLE_MOLECULAR_DATA[orgMeta.id] ||
      ORGANELLE_MOLECULAR_DATA.mitochondria;
    const record =
      this.currentLevelId === 'molecule' ? molEntry.molecule : molEntry.complex;

    if (this.pdbLoadState === 'unavailable-fallback') {
      this._buildMissingModelFallbackPlaceholder(orgMeta.color);
      return;
    }

    this._buildSchematicMolecularProxy(record.shapeType, orgMeta.color);
  }

  _buildMissingModelFallbackPlaceholder(hexColor) {
    const group = new THREE.Group();

    const cageGeo = new THREE.OctahedronGeometry(0.95, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: hexColor || 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);

    const coreGeo = new THREE.SphereGeometry(0.52, 24, 18);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: hexColor || 0x0284c7,
      roughness: 0.35,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const core = new THREE.Mesh(coreGeo, coreMat);

    const ringGeo = new THREE.TorusGeometry(0.78, 0.02, 12, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;

    group.add(cage, core, ring1, ring2);
    this.stageModelGroup.add(group);
  }

  _buildSchematicMolecularProxy(shapeType, primaryHex) {
    const group = new THREE.Group();
    const mainMat = new THREE.MeshPhysicalMaterial({
      color: primaryHex || 0x0284c7,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 0.35
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.08
    });
    const neutralMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });

    switch (shapeType) {
      case 'atp-synthase': {
        const cRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.14, 16, 32),
          accentMat
        );
        cRing.rotation.x = Math.PI / 2;
        cRing.position.y = -0.68;
        group.add(cRing);

        const stalk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.85, 16),
          neutralMat
        );
        stalk.position.y = -0.2;
        group.add(stalk);

        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const lobe = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.18, 0.32, 12, 16),
            i % 2 === 0 ? mainMat : accentMat
          );
          lobe.position.set(
            Math.cos(angle) * 0.36,
            0.38,
            Math.sin(angle) * 0.36
          );
          group.add(lobe);
        }
        break;
      }

      case 'nucleosome': {
        const octamer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.48, 0.48, 0.46, 32),
          mainMat
        );
        group.add(octamer);

        const pts = [];
        const totalSteps = 80;
        for (let i = 0; i <= totalSteps; i++) {
          const t = i / totalSteps;
          const angle = t * Math.PI * 2 * 1.65;
          const y = (t - 0.5) * 0.42;
          pts.push(
            new THREE.Vector3(
              Math.cos(angle) * 0.56,
              y,
              Math.sin(angle) * 0.56
            )
          );
        }
        const dnaWrap = new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(pts),
            96,
            0.065,
            12,
            false
          ),
          accentMat
        );
        group.add(dnaWrap);
        break;
      }

      case 'npc-ring': {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const r = 0.78;
          const spoke = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.14, 0.25, 12, 16),
            mainMat
          );
          spoke.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
          spoke.rotation.y = -angle;
          group.add(spoke);
        }
        const innerChannel = new THREE.Mesh(
          new THREE.TorusGeometry(0.55, 0.08, 16, 48),
          accentMat
        );
        innerChannel.rotation.x = Math.PI / 2;
        group.add(innerChannel);
        break;
      }

      case 'ribosome-80s': {
        const large60S = new THREE.Mesh(
          new THREE.SphereGeometry(0.62, 32, 24),
          mainMat
        );
        large60S.scale.set(1.15, 0.95, 1.0);
        large60S.position.set(-0.08, -0.18, 0);

        const small40S = new THREE.Mesh(
          new THREE.SphereGeometry(0.44, 28, 20),
          accentMat
        );
        small40S.scale.set(1.2, 0.82, 0.9);
        small40S.position.set(0.22, 0.36, 0.12);
        small40S.rotation.z = -0.35;

        group.add(large60S, small40S);
        break;
      }

      case 'tubulin-lattice': {
        for (let p = 0; p < 13; p++) {
          const angle = (p / 13) * Math.PI * 2;
          const r = 0.62;
          for (let row = -2; row <= 2; row++) {
            const monomer = new THREE.Mesh(
              new THREE.SphereGeometry(0.13, 16, 12),
              (row + p) % 2 === 0 ? mainMat : accentMat
            );
            monomer.position.set(
              Math.cos(angle) * r,
              row * 0.24 + (p / 13) * 0.18,
              Math.sin(angle) * r
            );
            group.add(monomer);
          }
        }
        break;
      }

      case 'tubulin-dimer': {
        const alphaSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 28, 22),
          mainMat
        );
        alphaSub.position.y = 0.38;
        const betaSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 28, 22),
          accentMat
        );
        betaSub.position.y = -0.38;
        group.add(alphaSub, betaSub);
        break;
      }

      case 'clathrin-cage': {
        const cage = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.82, 1),
          new THREE.MeshStandardMaterial({
            color: primaryHex || 0xf59e0b,
            wireframe: true
          })
        );
        const vesicleCore = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 24, 18),
          neutralMat
        );
        group.add(cage, vesicleCore);
        break;
      }

      case 'triskelion': {
        for (let leg = 0; leg < 3; leg++) {
          const baseAngle = (leg / 3) * Math.PI * 2;
          const pts = [
            new THREE.Vector3(0, 0.15, 0),
            new THREE.Vector3(
              Math.cos(baseAngle) * 0.45,
              0.0,
              Math.sin(baseAngle) * 0.45
            ),
            new THREE.Vector3(
              Math.cos(baseAngle + 0.55) * 0.85,
              -0.25,
              Math.sin(baseAngle + 0.55) * 0.85
            )
          ];
          const legMesh = new THREE.Mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(pts),
              24,
              0.055,
              10,
              false
            ),
            mainMat
          );
          group.add(legMesh);
        }
        break;
      }

      case 'dna-helix':
      case 'actin-helix':
      case 'coiled-coil': {
        for (let strand = 0; strand < 2; strand++) {
          const pts = [];
          const phase = strand * Math.PI;
          for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const angle = t * Math.PI * 4 + phase;
            const y = (t - 0.5) * 1.65;
            pts.push(
              new THREE.Vector3(
                Math.cos(angle) * 0.28,
                y,
                Math.sin(angle) * 0.28
              )
            );
          }
          const tube = new THREE.Mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(pts),
              64,
              0.065,
              10,
              false
            ),
            strand === 0 ? mainMat : accentMat
          );
          group.add(tube);
        }
        break;
      }

      default: {
        const centerCore = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.46, 0.14, 72, 16),
          mainMat
        );
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.82, 24, 18),
          neutralMat
        );
        group.add(centerCore, halo);
        break;
      }
    }

    this.stageModelGroup.add(group);
  }

  async loadVerifiedPdbBackbone() {
    const state = this.getCurrentState();
    const pdbId = state.molecularRecord?.pdbId;
    if (!pdbId) {
      this.triggerUnavailableFallback();
      return;
    }

    if (!state.molecularRecord.supportsLiveTrace) {
      this.pdbLoadState = 'unavailable-fallback';
      this.pdbAtomCount = 0;
      this._rebuildMolecularStageGeometry();
      this._notifyState();
      return;
    }

    this.pdbLoadState = 'loading';
    this._notifyState();

    try {
      let coords = this.pdbCache.get(pdbId);
      if (!coords) {
        const response = await fetch(
          `https://files.rcsb.org/download/${pdbId}.pdb`
        );
        if (!response.ok) {
          throw new Error(`RCSB HTTP ${response.status}`);
        }
        const pdbText = await response.text();
        coords = this._parseBackboneCoordinates(pdbText);
        if (coords.length < 10) {
          throw new Error('Insufficient backbone atoms parsed');
        }
        this.pdbCache.set(pdbId, coords);
      }

      this._renderVerifiedBackboneTrace(coords, state.organelle.color);
      this.pdbLoadState = 'loaded-pdb';
      this.pdbAtomCount = coords.length;
      this._notifyState();
    } catch (err) {
      this.pdbLoadState = 'unavailable-fallback';
      this.pdbAtomCount = 0;
      this._rebuildMolecularStageGeometry();
      this._notifyState();
    }
  }

  triggerUnavailableFallback() {
    if (this.pdbLoadState === 'unavailable-fallback') {
      this.pdbLoadState = 'schematic';
    } else {
      this.pdbLoadState = 'unavailable-fallback';
    }
    this.pdbAtomCount = 0;
    this._rebuildMolecularStageGeometry();
    this._notifyState();
  }

  _parseBackboneCoordinates(pdbText) {
    const lines = pdbText.split('\n');
    const points = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith('ATOM  ')) continue;
      const atomName = line.slice(12, 16).trim();
      if (atomName !== 'CA' && atomName !== 'P') continue;

      const x = parseFloat(line.slice(30, 38));
      const y = parseFloat(line.slice(38, 46));
      const z = parseFloat(line.slice(46, 54));
      if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
        points.push(new THREE.Vector3(x, y, z));
      }
      if (points.length >= 1800) break;
    }

    if (points.length === 0) return points;

    const box = new THREE.Box3().setFromPoints(points);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1);
    const scale = 1.75 / maxDim;

    return points.map((p) => p.sub(center).multiplyScalar(scale));
  }

  _renderVerifiedBackboneTrace(points, hexColor) {
    this._clearStageModelGroup();
    const group = new THREE.Group();

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: hexColor || 0x0284c7,
      transparent: true,
      opacity: 0.75
    });
    const backboneLine = new THREE.Line(lineGeo, lineMat);
    group.add(backboneLine);

    const sphereGeo = new THREE.SphereGeometry(0.024, 8, 6);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: hexColor || 0x0284c7,
      roughness: 0.3,
      metalness: 0.1
    });
    const instancedAtoms = new THREE.InstancedMesh(
      sphereGeo,
      sphereMat,
      points.length
    );
    const dummy = new THREE.Object3D();
    points.forEach((pt, idx) => {
      dummy.position.copy(pt);
      dummy.updateMatrix();
      instancedAtoms.setMatrixAt(idx, dummy.matrix);
    });
    instancedAtoms.instanceMatrix.needsUpdate = true;
    group.add(instancedAtoms);

    this.stageModelGroup.add(group);
  }

  update(now = performance.now()) {
    if (this.molecularStageGroup.visible) {
      this.stageModelGroup.rotation.y = now * 0.00035;
    }
  }

  dispose() {
    this._clearStageModelGroup();
    this.stagePedestalGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }

  _notifyState() {
    if (this.onScaleStateChange) {
      this.onScaleStateChange(this.getCurrentState());
    }
  }
}