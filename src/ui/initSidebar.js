import { ORGANELLES } from '../data/organelles.js';

export function initSidebar(
  container,
  projectInfo,
  sceneController,
  { onOpenLimitationsModal } = {}
) {
  container.innerHTML = `
    <div class="sidebar-section">
      <div class="section-header-row">
        <h2 class="sidebar-heading">Exploded View (Feature A)</h2>
        <span id="explode-value-badge" class="value-pill">0%</span>
      </div>
      <label class="slider-label" for="slider-explode">
        <span>Spatial Separation</span>
        <button id="btn-reset-explode" type="button" class="btn-link">
          Reset Exploded
        </button>
      </label>
      <input
        id="slider-explode"
        type="range"
        min="0"
        max="100"
        step="1"
        value="0"
        class="range-slider"
        aria-label="Exploded view separation percentage"
      />
      <p class="sidebar-hint">
        Separates organelles along functional compartment trajectories with origin tether guides.
      </p>
    </div>

    <div class="sidebar-section">
      <div class="section-header-row">
        <h2 class="sidebar-heading">Cross-Section Mode (Feature B)</h2>
        <button id="btn-reset-cross-section" type="button" class="btn-link">
          Standard
        </button>
      </div>

      <div class="mode-radio-group" role="radiogroup" aria-label="Cross-section mode">
        <label class="mode-option">
          <input
            type="radio"
            name="cross-section-mode"
            value="standard"
            checked
          />
          <span>Standard 3/4 Cutaway</span>
        </label>
        <label class="mode-option">
          <input
            type="radio"
            name="cross-section-mode"
            value="boundary-peel"
          />
          <span>Boundary Peel (360&deg; Interior Reveal)</span>
        </label>
        <label class="mode-option">
          <input
            type="radio"
            name="cross-section-mode"
            value="planar-slice"
          />
          <span>Planar Cross-Section Slice</span>
        </label>
      </div>

      <div id="planar-slice-controls" class="slice-subpanel is-hidden">
        <div class="slice-axis-row" role="group" aria-label="Clipping plane axis">
          <span class="slice-axis-label">Slice Axis:</span>
          <div class="axis-btn-group">
            <button type="button" class="btn-axis is-active" data-axis="y">
              Y (Horizontal)
            </button>
            <button type="button" class="btn-axis" data-axis="x">
              X (Sagittal)
            </button>
            <button type="button" class="btn-axis" data-axis="z">
              Z (Coronal)
            </button>
          </div>
        </div>

        <label class="slider-label" for="slider-slice-offset">
          <span>Slice Plane Depth</span>
          <span id="slice-offset-readout" class="mono-readout">0.00</span>
        </label>
        <input
          id="slider-slice-offset"
          type="range"
          min="-2.0"
          max="2.0"
          step="0.05"
          value="0.0"
          class="range-slider"
          aria-label="Planar cross-section depth"
        />
      </div>

      <p class="sidebar-cutaway-note">
        <strong>Visualization Note:</strong> Boundary peeling and planar clipping are reversible geometric inspection aids to reveal nested 3D structures, not physically exact histological slices.
      </p>
    </div>

    <div class="sidebar-section">
      <h2 class="sidebar-heading">Camera &amp; Viewport Controls</h2>
      <div class="camera-btn-grid" role="group" aria-label="Camera navigation controls">
        <button
          id="btn-orbit-left"
          type="button"
          class="btn-secondary btn-compact"
          aria-label="Rotate cell left"
        >
          &#8592; Orbit Left
        </button>
        <button
          id="btn-orbit-right"
          type="button"
          class="btn-secondary btn-compact"
          aria-label="Rotate cell right"
        >
          Orbit Right &#8594;
        </button>
        <button
          id="btn-zoom-in"
          type="button"
          class="btn-secondary btn-compact"
          aria-label="Zoom in"
        >
          &#43; Zoom In
        </button>
        <button
          id="btn-zoom-out"
          type="button"
          class="btn-secondary btn-compact"
          aria-label="Zoom out"
        >
          &minus; Zoom Out
        </button>
      </div>

      <label class="control-row" for="toggle-autorotate">
        <span>Auto-Rotate Cell</span>
        <input id="toggle-autorotate" type="checkbox" />
      </label>
      <label class="control-row" for="toggle-guides">
        <span>Show Equatorial Ring</span>
        <input id="toggle-guides" type="checkbox" checked />
      </label>

      <div class="camera-action-row">
        <button id="btn-reset-camera" type="button" class="btn-secondary">
          Reset Camera
        </button>
        <button id="btn-clear-selection" type="button" class="btn-secondary">
          Clear Selection
        </button>
      </div>

      <button id="btn-reset-all" type="button" class="btn-primary-outline">
        Reset All View &amp; Modes
      </button>
    </div>

    <div class="sidebar-section">
      <div class="section-header-row">
        <h2 id="organelle-list-heading" class="sidebar-heading">
          Organelles (${ORGANELLES.length})
        </h2>
        <div class="inline-actions" role="group" aria-label="Bulk organelle visibility">
          <button
            id="btn-show-all"
            type="button"
            class="btn-link"
            aria-label="Show all organelles"
          >
            Show All
          </button>
          <span class="divider-dot" aria-hidden="true">&bull;</span>
          <button
            id="btn-hide-all"
            type="button"
            class="btn-link"
            aria-label="Hide all organelles"
          >
            Hide All
          </button>
        </div>
      </div>

      <p class="sidebar-hint">
        Click or press Enter on a structure to inspect &amp; focus. Use checkboxes to toggle visibility.
      </p>

      <ul
        id="organelle-list"
        class="organelle-list"
        role="listbox"
        aria-labelledby="organelle-list-heading"
      >
        ${ORGANELLES.map(
          (org) => `
          <li
            class="organelle-row"
            data-row-id="${org.id}"
            role="option"
            aria-selected="false"
          >
            <button
              type="button"
              class="organelle-select-btn"
              data-select-id="${org.id}"
              aria-pressed="false"
              aria-label="Select and focus ${org.name}"
              title="${org.summary}"
            >
              <span
                class="color-swatch"
                style="background-color: ${org.color}"
                aria-hidden="true"
              ></span>
              <span class="organelle-name">${org.name}</span>
            </button>
            <input
              id="org-toggle-${org.id}"
              type="checkbox"
              class="organelle-vis-checkbox"
              data-organelle-id="${org.id}"
              aria-label="Toggle visibility for ${org.name}"
              title="Show or hide ${org.name}"
              checked
            />
          </li>`
        ).join('')}
      </ul>
    </div>

    <div class="sidebar-section">
      <div class="section-header-row">
        <h2 class="sidebar-heading">Scientific Limitations</h2>
        <button id="btn-sidebar-limitations" type="button" class="btn-link">
          Full Details
        </button>
      </div>
      <p class="sidebar-description">${projectInfo.scientificDisclaimer}</p>
      <ul class="meta-list">
        ${projectInfo.specs
          .map(
            (spec) => `
          <li>
            <span class="meta-label">${spec.label}</span>
            <span>${spec.value}</span>
          </li>`
          )
          .join('')}
      </ul>
    </div>
  `;

  const explodeSlider = container.querySelector('#slider-explode');
  const explodeBadge = container.querySelector('#explode-value-badge');
  const resetExplodeBtn = container.querySelector('#btn-reset-explode');

  const modeRadios = Array.from(
    container.querySelectorAll('input[name="cross-section-mode"]')
  );
  const resetCrossSectionBtn = container.querySelector(
    '#btn-reset-cross-section'
  );
  const planarSliceSubpanel = container.querySelector('#planar-slice-controls');
  const axisButtons = Array.from(
    container.querySelectorAll('button[data-axis]')
  );
  const sliceOffsetSlider = container.querySelector('#slider-slice-offset');
  const sliceOffsetReadout = container.querySelector('#slice-offset-readout');

  const orbitLeftBtn = container.querySelector('#btn-orbit-left');
  const orbitRightBtn = container.querySelector('#btn-orbit-right');
  const zoomInBtn = container.querySelector('#btn-zoom-in');
  const zoomOutBtn = container.querySelector('#btn-zoom-out');
  const autoRotateCheckbox = container.querySelector('#toggle-autorotate');
  const guidesCheckbox = container.querySelector('#toggle-guides');
  const resetButton = container.querySelector('#btn-reset-camera');
  const clearSelectionBtn = container.querySelector('#btn-clear-selection');
  const resetAllBtn = container.querySelector('#btn-reset-all');
  const showAllBtn = container.querySelector('#btn-show-all');
  const hideAllBtn = container.querySelector('#btn-hide-all');
  const sidebarLimitationsBtn = container.querySelector(
    '#btn-sidebar-limitations'
  );

  const selectButtons = Array.from(
    container.querySelectorAll('button[data-select-id]')
  );
  const visCheckboxes = Array.from(
    container.querySelectorAll('input[data-organelle-id]')
  );

  function updateExplodeUI(percent) {
    explodeSlider.value = String(percent);
    explodeBadge.textContent = `${percent}%`;
    sceneController.setExplodeFactor(percent / 100);
  }

  explodeSlider.addEventListener('input', (event) => {
    const val = Number(event.target.value);
    updateExplodeUI(val);
  });

  resetExplodeBtn.addEventListener('click', () => {
    updateExplodeUI(0);
  });

  function setCrossSectionModeUI(mode) {
    modeRadios.forEach((radio) => {
      radio.checked = radio.value === mode;
    });
    planarSliceSubpanel.classList.toggle('is-hidden', mode !== 'planar-slice');
    sceneController.setCrossSectionMode(mode);
  }

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (event.target.checked) {
        setCrossSectionModeUI(event.target.value);
      }
    });
  });

  resetCrossSectionBtn.addEventListener('click', () => {
    sliceOffsetSlider.value = '0.0';
    sliceOffsetReadout.textContent = '0.00';
    sceneController.setSliceOffset(0);
    setCrossSectionModeUI('standard');
  });

  axisButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const axis = btn.getAttribute('data-axis');
      axisButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      sceneController.setSliceAxis(axis);
    });
  });

  sliceOffsetSlider.addEventListener('input', (event) => {
    const offset = Number(event.target.value);
    sliceOffsetReadout.textContent = offset.toFixed(2);
    sceneController.setSliceOffset(offset);
  });

  orbitLeftBtn.addEventListener('click', () => {
    sceneController.rotateAzimuth(-Math.PI / 8);
  });

  orbitRightBtn.addEventListener('click', () => {
    sceneController.rotateAzimuth(Math.PI / 8);
  });

  zoomInBtn.addEventListener('click', () => {
    sceneController.zoomCamera(0.84);
  });

  zoomOutBtn.addEventListener('click', () => {
    sceneController.zoomCamera(1.18);
  });

  autoRotateCheckbox.addEventListener('change', (event) => {
    sceneController.setAutoRotate(event.target.checked);
  });

  guidesCheckbox.addEventListener('change', (event) => {
    sceneController.setGuideVisible(event.target.checked);
  });

  resetButton.addEventListener('click', () => {
    sceneController.resetCamera();
  });

  clearSelectionBtn.addEventListener('click', () => {
    sceneController.clearSelection();
  });

  resetAllBtn.addEventListener('click', () => {
    explodeSlider.value = '0';
    explodeBadge.textContent = '0%';
    sliceOffsetSlider.value = '0.0';
    sliceOffsetReadout.textContent = '0.00';
    axisButtons.forEach((b) =>
      b.classList.toggle('is-active', b.getAttribute('data-axis') === 'y')
    );
    setCrossSectionModeUI('standard');
    autoRotateCheckbox.checked = false;
    guidesCheckbox.checked = true;
    visCheckboxes.forEach((cb) => {
      cb.checked = true;
    });
    sceneController.resetAllViewAndModes();
  });

  if (sidebarLimitationsBtn && onOpenLimitationsModal) {
    sidebarLimitationsBtn.addEventListener('click', (e) => {
      onOpenLimitationsModal(e.currentTarget);
    });
  }

  selectButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-select-id');
      const checkbox = container.querySelector(`#org-toggle-${id}`);
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        sceneController.setOrganelleVisible(id, true);
      }
      sceneController.selectOrganelle(id, { focusCamera: true });
    });

    btn.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextBtn = selectButtons[(index + 1) % selectButtons.length];
        nextBtn.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevBtn =
          selectButtons[
            (index - 1 + selectButtons.length) % selectButtons.length
          ];
        prevBtn.focus();
      }
    });
  });

  visCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const id = event.target.getAttribute('data-organelle-id');
      sceneController.setOrganelleVisible(id, event.target.checked);
    });
  });

  showAllBtn.addEventListener('click', () => {
    sceneController.setAllOrganellesVisible(true);
    visCheckboxes.forEach((cb) => {
      cb.checked = true;
    });
  });

  hideAllBtn.addEventListener('click', () => {
    sceneController.setAllOrganellesVisible(false);
    visCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
  });

  return {
    setSelectedOrganelle(selectedId) {
      selectButtons.forEach((btn) => {
        const id = btn.getAttribute('data-select-id');
        const isMatch = id === selectedId;
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        const row = btn.closest('.organelle-row');
        if (row) {
          row.classList.toggle('is-selected', isMatch);
          row.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        }
      });
    },
    ensureOrganelleChecked(organelleId) {
      const checkbox = container.querySelector(`#org-toggle-${organelleId}`);
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        sceneController.setOrganelleVisible(organelleId, true);
      }
    },
    syncExplodePercent(percent) {
      explodeSlider.value = String(percent);
      explodeBadge.textContent = `${percent}%`;
    },
    syncCrossSectionMode(mode) {
      setCrossSectionModeUI(mode);
    }
  };
}