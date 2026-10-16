import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildAnimalCell } from './CellBuilder.js';
import { InteractionManager } from './InteractionManager.js';
import { SpatialModesController } from './SpatialModesController.js';
import { ScaleExplorerController } from './ScaleExplorerController.js';

const INITIAL_CAMERA_POS = new THREE.Vector3(3.4, 2.3, 4.8);
const INITIAL_TARGET = new THREE.Vector3(0, -0.05, 0);

export function createCellScene(
  container,
  {
    onSelectionChange,
    onLabelUpdate,
    onScaleStateChange,
    onEnsureOrganelleVisible
  } = {}
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.copy(INITIAL_CAMERA_POS);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  container.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf1f5f9, 1.35);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfffdfa, 1.5);
  keyLight.position.set(5.5, 8.5, 6.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 25;
  const d = 4.2;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.85);
  fillLight.position.set(-6, 3.5, -4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xfef3c7, 0.55);
  rimLight.position.set(2, -5, -5);
  scene.add(rimLight);

  const cellModel = buildAnimalCell();
  scene.add(cellModel.root);

  let userGuideVisible = true;
  const guideGroup = new THREE.Group();
  const ringGeo = new THREE.RingGeometry(2.38, 2.41, 72);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35
  });
  const equatorialRing = new THREE.Mesh(ringGeo, ringMat);
  equatorialRing.rotation.x = Math.PI / 2;
  guideGroup.add(equatorialRing);
  scene.add(guideGroup);

  const shadowPlaneGeo = new THREE.PlaneGeometry(14, 14);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.065 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -3.85;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(INITIAL_TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.6;
  controls.maxDistance = 14.0;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.6;
  controls.update();

  const spatialModes = new SpatialModesController({
    scene,
    renderer,
    cellModel
  });

  let scaleExplorer = null;

  const interactionManager = new InteractionManager({
    camera,
    controls,
    domElement: renderer.domElement,
    cellModel,
    spatialModes,
    initialCameraPos: INITIAL_CAMERA_POS,
    initialTarget: INITIAL_TARGET,
    onSelectionChange: (organelle) => {
      if (scaleExplorer && organelle) {
        scaleExplorer.syncSelectedOrganelle(organelle.id);
      }
      if (onSelectionChange) {
        onSelectionChange(organelle);
      }
    },
    onLabelUpdate
  });

  scaleExplorer = new ScaleExplorerController({
    scene,
    cellModel,
    spatialModes,
    interactionManager,
    isGuideEnabled: () => userGuideVisible,
    guideGroup,
    onScaleStateChange,
    onEnsureOrganelleVisible
  });

  function handleResize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    if (newWidth === 0 || newHeight === 0) return;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  const resizeObserver = new ResizeObserver(() => handleResize());
  resizeObserver.observe(container);
  window.addEventListener('resize', handleResize);

  let animationFrameId = null;
  function animate(now) {
    animationFrameId = requestAnimationFrame(animate);
    spatialModes.update();
    scaleExplorer.update(now);
    interactionManager.update(now);
    controls.update();
    renderer.render(scene, camera);
  }
  animate(performance.now());

  return {
    cellModel,
    spatialModes,
    scaleExplorer,
    handleResize,
    selectOrganelle(id, options) {
      interactionManager.selectOrganelle(id, options);
    },
    clearSelection(options) {
      interactionManager.clearSelection(options);
    },
    focusOrganelle(id) {
      if (
        scaleExplorer.currentLevelId === 'molecular-complex' ||
        scaleExplorer.currentLevelId === 'molecule'
      ) {
        scaleExplorer.transitionToLevel('organelle');
      }
      interactionManager.focusOnOrganelle(id);
    },
    setScaleLevel(levelId) {
      scaleExplorer.transitionToLevel(levelId);
    },
    stepScaleBack() {
      scaleExplorer.stepBack();
    },
    stepScaleForward() {
      scaleExplorer.stepForward();
    },
    loadVerifiedPdbTrace() {
      scaleExplorer.loadVerifiedPdbBackbone();
    },
    toggleMolecularFallback() {
      scaleExplorer.triggerUnavailableFallback();
    },
    getScaleState() {
      return scaleExplorer.getCurrentState();
    },
    setExplodeFactor(factor, options) {
      if (
        scaleExplorer.currentLevelId === 'molecular-complex' ||
        scaleExplorer.currentLevelId === 'molecule'
      ) {
        scaleExplorer.transitionToLevel('whole-cell');
      }
      spatialModes.setExplodeFactor(factor, options);
      if (interactionManager.selectedId) {
        interactionManager.focusOnOrganelle(interactionManager.selectedId);
      }
    },
    setCrossSectionMode(mode) {
      if (
        scaleExplorer.currentLevelId === 'molecular-complex' ||
        scaleExplorer.currentLevelId === 'molecule'
      ) {
        scaleExplorer.transitionToLevel('whole-cell');
      }
      spatialModes.setCrossSectionMode(mode);
      interactionManager.refreshMaterials();
    },
    setSliceAxis(axis) {
      spatialModes.setSliceAxis(axis);
    },
    setSliceOffset(offset) {
      spatialModes.setSliceOffset(offset);
    },
    resetCamera() {
      interactionManager.startCameraTransition(
        INITIAL_CAMERA_POS,
        INITIAL_TARGET
      );
    },
    resetAllViewAndModes() {
      controls.autoRotate = false;
      userGuideVisible = true;
      guideGroup.visible = true;
      cellModel.setAllVisible(true);
      spatialModes.resetAllModes();
      scaleExplorer.historyStack = [];
      scaleExplorer.transitionToLevel('whole-cell', { pushHistory: false });
      interactionManager.clearSelection();
      interactionManager.refreshMaterials();
      interactionManager.startCameraTransition(
        INITIAL_CAMERA_POS,
        INITIAL_TARGET
      );
    },
    rotateAzimuth(deltaRadians) {
      interactionManager.cameraTransition = null;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta += deltaRadians;
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    },
    zoomCamera(scaleFactor) {
      interactionManager.cameraTransition = null;
      const offset = camera.position.clone().sub(controls.target);
      const newLength = THREE.MathUtils.clamp(
        offset.length() * scaleFactor,
        controls.minDistance,
        controls.maxDistance
      );
      offset.setLength(newLength);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    },
    setAutoRotate(enabled) {
      controls.autoRotate = Boolean(enabled);
    },
    setGuideVisible(visible) {
      userGuideVisible = Boolean(visible);
      if (cellModel.root.visible) {
        guideGroup.visible = userGuideVisible;
      }
    },
    setOrganelleVisible(id, visible) {
      cellModel.setOrganelleVisible(id, visible);
      interactionManager.handleVisibilityChange(id, visible);
    },
    setAllOrganellesVisible(visible) {
      cellModel.setAllVisible(visible);
      if (!visible) {
        interactionManager.clearSelection();
      }
    },
    dispose() {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      scaleExplorer.dispose();
      spatialModes.dispose();
      interactionManager.dispose();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    }
  };
}