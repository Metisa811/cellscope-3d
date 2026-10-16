import './style.css';
import { PROJECT_INFO } from './data/projectInfo.js';
import { createCellScene } from './three/createScene.js';
import { initSidebar } from './ui/initSidebar.js';
import { InfoPanel } from './ui/InfoPanel.js';
import { ScaleExplorerHUD } from './ui/ScaleExplorerHUD.js';
import { AtlasToolbar } from './ui/AtlasToolbar.js';
import { AtlasModals } from './ui/AtlasModals.js';

function bootstrap() {
  const appShellEl = document.getElementById('app-shell');
  const titleEl = document.getElementById('app-title');
  const subtitleEl = document.getElementById('app-subtitle');
  const stageBadgeEl = document.getElementById('stage-badge');
  const headerToolbarRoot = document.getElementById('header-toolbar-root');
  const canvasContainer = document.getElementById('canvas-container');
  const sidebarContainer = document.getElementById('sidebar-container');
  const scaleExplorerRoot = document.getElementById('scale-explorer-root');
  const infoPanelRoot = document.getElementById('info-panel-root');
  const atlasModalsRoot = document.getElementById('atlas-modals-root');
  const statusPillEl = document.getElementById('viewport-status-pill');
  const floatingLabelEl = document.getElementById('viewport-floating-label');
  const floatingDotEl = document.getElementById('floating-label-dot');
  const floatingTextEl = document.getElementById('floating-label-text');
  const exitPresentationBtn = document.getElementById('btn-exit-presentation');

  if (titleEl) titleEl.textContent = PROJECT_INFO.title;
  if (subtitleEl) subtitleEl.textContent = PROJECT_INFO.subtitle;
  if (stageBadgeEl) stageBadgeEl.textContent = PROJECT_INFO.stageLabel;

  let sidebarController = null;
  let sceneController = null;
  let scaleHud = null;
  let atlasModals = null;
  let isPresentationMode = false;

  function selectAndFocusOrganelleById(organelleId) {
    if (!sceneController) return;
    if (
      sceneController.getScaleState().currentLevelId === 'molecular-complex' ||
      sceneController.getScaleState().currentLevelId === 'molecule'
    ) {
      sceneController.setScaleLevel('organelle');
    }
    if (sidebarController) {
      sidebarController.ensureOrganelleChecked(organelleId);
    } else {
      sceneController.setOrganelleVisible(organelleId, true);
    }
    sceneController.selectOrganelle(organelleId, { focusCamera: true });
  }

  function setPresentationMode(enabled) {
    isPresentationMode = Boolean(enabled);
    if (appShellEl) {
      appShellEl.classList.toggle('is-presentation-mode', isPresentationMode);
    }
    if (exitPresentationBtn) {
      exitPresentationBtn.classList.toggle('is-hidden', !isPresentationMode);
    }
    if (sceneController) {
      sceneController.handleResize();
    }
  }

  const infoPanel = new InfoPanel(infoPanelRoot, {
    onClose: () => {
      if (sceneController) sceneController.clearSelection();
    },
    onFocusOrganelle: (organelleId) => {
      if (sceneController) sceneController.focusOrganelle(organelleId);
    }
  });

  scaleHud = new ScaleExplorerHUD(scaleExplorerRoot, {
    onSelectLevel: (levelId) => {
      if (sceneController) sceneController.setScaleLevel(levelId);
    },
    onStepBack: () => {
      if (sceneController) sceneController.stepScaleBack();
    },
    onStepForward: () => {
      if (sceneController) sceneController.stepScaleForward();
    },
    onLoadVerifiedPdb: () => {
      if (sceneController) sceneController.loadVerifiedPdbTrace();
    },
    onToggleFallback: () => {
      if (sceneController) sceneController.toggleMolecularFallback();
    }
  });

  sceneController = createCellScene(canvasContainer, {
    onSelectionChange: (organelle) => {
      infoPanel.update(organelle);
      if (sidebarController) {
        sidebarController.setSelectedOrganelle(organelle ? organelle.id : null);
      }
      if (statusPillEl) {
        statusPillEl.textContent = organelle
          ? `Selected: ${organelle.name} (${organelle.category}) • Click empty space or press Esc to clear`
          : 'Search organelles above, launch the Guided Tour, or click any 3D structure to inspect';
      }
    },
    onLabelUpdate: (labelData) => {
      if (!floatingLabelEl) return;
      if (!labelData || isPresentationMode) {
        floatingLabelEl.classList.add('is-hidden');
        return;
      }
      floatingLabelEl.classList.remove('is-hidden');
      floatingLabelEl.style.transform = `translate3d(${Math.round(
        labelData.x
      )}px, ${Math.round(labelData.y - 18)}px, 0) translate(-50%, -100%)`;
      if (floatingDotEl) {
        floatingDotEl.style.backgroundColor = labelData.color;
      }
      if (floatingTextEl) {
        floatingTextEl.textContent = labelData.name;
      }
    },
    onScaleStateChange: (scaleState) => {
      if (scaleHud) {
        scaleHud.update(scaleState);
      }
    },
    onEnsureOrganelleVisible: (organelleId) => {
      if (sidebarController) {
        sidebarController.ensureOrganelleChecked(organelleId);
      }
    }
  });

  scaleHud.update(sceneController.getScaleState());

  atlasModals = new AtlasModals(atlasModalsRoot, {
    onSelectAndFocusOrganelle: (organelleId) => {
      selectAndFocusOrganelleById(organelleId);
    },
    onApplyTourStepState: (step) => {
      if (!sceneController) return;
      const pct = Math.round((step.explodeFactor || 0) * 100);
      sceneController.setExplodeFactor(step.explodeFactor || 0);
      if (sidebarController) {
        sidebarController.syncExplodePercent(pct);
        sidebarController.syncCrossSectionMode(
          step.crossSectionMode || 'standard'
        );
      } else {
        sceneController.setCrossSectionMode(
          step.crossSectionMode || 'standard'
        );
      }
      selectAndFocusOrganelleById(step.organelleId);
    }
  });

  new AtlasToolbar(headerToolbarRoot, {
    onSelectOrganelle: (organelleId) => {
      selectAndFocusOrganelleById(organelleId);
    },
    onStartTour: () => {
      atlasModals.startTour();
    },
    onOpenModal: (modalName, triggerEl) => {
      atlasModals.openModal(modalName, triggerEl);
    },
    onTogglePresentationMode: () => {
      setPresentationMode(!isPresentationMode);
    }
  });

  sidebarController = initSidebar(
    sidebarContainer,
    PROJECT_INFO,
    sceneController,
    {
      onOpenLimitationsModal: (triggerEl) => {
        atlasModals.openModal('limitations', triggerEl);
      }
    }
  );

  if (exitPresentationBtn) {
    exitPresentationBtn.addEventListener('click', () => {
      setPresentationMode(false);
    });
  }

  window.addEventListener('keydown', (event) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    if (event.key === 'Escape') {
      if (isPresentationMode) {
        setPresentationMode(false);
        return;
      }
      if (atlasModals && atlasModals.activeModal) {
        atlasModals.closeModal();
        return;
      }
      sceneController.clearSelection();
    } else if ((event.key === 'p' || event.key === 'P') && !isTyping) {
      setPresentationMode(!isPresentationMode);
    }
  });
}

bootstrap();