export class ScaleExplorerHUD {
  constructor(
    container,
    {
      onSelectLevel,
      onStepBack,
      onStepForward,
      onLoadVerifiedPdb,
      onToggleFallback
    } = {}
  ) {
    this.container = container;
    this.onSelectLevel = onSelectLevel;
    this.onStepBack = onStepBack;
    this.onStepForward = onStepForward;
    this.onLoadVerifiedPdb = onLoadVerifiedPdb;
    this.onToggleFallback = onToggleFallback;

    this._renderShell();
    this._bindEvents();
  }

  _renderShell() {
    this.container.innerHTML = `
      <div class="scale-hud-wrapper" role="region" aria-label="Educational Scale Explorer">
        <div class="scale-hud-bar">
          <button
            id="btn-scale-back"
            type="button"
            class="btn-scale-nav"
            aria-label="Step back to previous scale level"
            disabled
          >
            &#8592; Back
          </button>

          <div class="scale-stepper" role="tablist" aria-label="Conceptual Scale Levels">
            <button
              type="button"
              class="scale-step-btn is-active"
              data-scale-level="whole-cell"
              role="tab"
              aria-selected="true"
            >
              <span class="step-num">1</span>
              <span class="step-label">Whole Cell</span>
              <span class="step-order">10⁻⁵ m</span>
            </button>
            <span class="step-chevron" aria-hidden="true">&rsaquo;</span>
            <button
              type="button"
              class="scale-step-btn"
              data-scale-level="organelle"
              role="tab"
              aria-selected="false"
            >
              <span class="step-num">2</span>
              <span class="step-label">Organelle</span>
              <span class="step-order">10⁻⁶ m</span>
            </button>
            <span class="step-chevron" aria-hidden="true">&rsaquo;</span>
            <button
              type="button"
              class="scale-step-btn"
              data-scale-level="molecular-complex"
              role="tab"
              aria-selected="false"
            >
              <span class="step-num">3</span>
              <span class="step-label">Molecular Complex</span>
              <span class="step-order">10⁻⁸ m</span>
            </button>
            <span class="step-chevron" aria-hidden="true">&rsaquo;</span>
            <button
              type="button"
              class="scale-step-btn"
              data-scale-level="molecule"
              role="tab"
              aria-selected="false"
            >
              <span class="step-num">4</span>
              <span class="step-label">Molecule</span>
              <span class="step-order">10⁻⁹ m</span>
            </button>
          </div>

          <button
            id="btn-scale-deeper"
            type="button"
            class="btn-scale-nav btn-scale-primary"
            aria-label="Zoom deeper to next conceptual scale level"
          >
            Zoom Deeper &#8594;
          </button>

          <div class="scale-indicator-box" aria-live="polite">
            <div class="scale-ruler-top">
              <span id="scale-bar-text" class="scale-bar-text">5 µm</span>
              <span id="scale-range-text" class="scale-range-text">(10 – 30 µm)</span>
            </div>
            <div class="scale-ruler-graphic" aria-hidden="true"></div>
          </div>
        </div>

        <!-- Contextual Molecular / Schematic Provenance Card (shown at Levels 3 & 4) -->
        <div
          id="scale-molecular-card"
          class="scale-molecular-card is-hidden"
          aria-live="polite"
        >
          <div class="mol-card-header">
            <div>
              <span id="mol-level-badge" class="mol-level-badge"></span>
              <h3 id="mol-structure-title" class="mol-structure-title"></h3>
              <span id="mol-structure-size" class="mol-structure-size"></span>
            </div>
            <span id="mol-status-pill" class="mol-status-pill"></span>
          </div>

          <p id="mol-structure-summary" class="mol-structure-summary"></p>

          <div id="mol-discontinuity-alert" class="mol-discontinuity-alert"></div>

          <div class="mol-pdb-row">
            <div class="mol-pdb-meta">
              <span class="mol-pdb-label">Verified Structural Reference:</span>
              <a
                id="mol-pdb-link"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="mol-pdb-link"
              ></a>
            </div>
            <div class="mol-action-btns">
              <button
                id="btn-load-pdb-trace"
                type="button"
                class="btn-secondary btn-compact"
              >
                Load Verified PDB C&alpha; Trace
              </button>
              <button
                id="btn-toggle-fallback"
                type="button"
                class="btn-secondary btn-compact"
              >
                Test Missing-Model Fallback
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.backBtn = this.container.querySelector('#btn-scale-back');
    this.deeperBtn = this.container.querySelector('#btn-scale-deeper');
    this.stepBtns = Array.from(
      this.container.querySelectorAll('button[data-scale-level]')
    );
    this.scaleBarTextEl = this.container.querySelector('#scale-bar-text');
    this.scaleRangeTextEl = this.container.querySelector('#scale-range-text');

    this.molCardEl = this.container.querySelector('#scale-molecular-card');
    this.molLevelBadgeEl = this.container.querySelector('#mol-level-badge');
    this.molTitleEl = this.container.querySelector('#mol-structure-title');
    this.molSizeEl = this.container.querySelector('#mol-structure-size');
    this.molStatusPillEl = this.container.querySelector('#mol-status-pill');
    this.molSummaryEl = this.container.querySelector('#mol-structure-summary');
    this.molAlertEl = this.container.querySelector('#mol-discontinuity-alert');
    this.molPdbLinkEl = this.container.querySelector('#mol-pdb-link');
    this.loadPdbBtn = this.container.querySelector('#btn-load-pdb-trace');
    this.toggleFallbackBtn = this.container.querySelector(
      '#btn-toggle-fallback'
    );
  }

  _bindEvents() {
    this.backBtn.addEventListener('click', () => {
      if (this.onStepBack) this.onStepBack();
    });

    this.deeperBtn.addEventListener('click', () => {
      if (this.onStepForward) this.onStepForward();
    });

    this.stepBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const levelId = btn.getAttribute('data-scale-level');
        if (this.onSelectLevel) this.onSelectLevel(levelId);
      });
    });

    this.loadPdbBtn.addEventListener('click', () => {
      if (this.onLoadVerifiedPdb) this.onLoadVerifiedPdb();
    });

    this.toggleFallbackBtn.addEventListener('click', () => {
      if (this.onToggleFallback) this.onToggleFallback();
    });
  }

  update(state) {
    if (!state) return;

    const {
      currentLevelId,
      levelMeta,
      organelle,
      molecularRecord,
      canGoBack,
      canGoDeeper,
      pdbLoadState,
      pdbAtomCount
    } = state;

    this.backBtn.disabled = !canGoBack;
    this.deeperBtn.disabled = !canGoDeeper;

    this.stepBtns.forEach((btn) => {
      const id = btn.getAttribute('data-scale-level');
      const isMatch = id === currentLevelId;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (levelMeta) {
      this.scaleBarTextEl.textContent = levelMeta.scaleBarLabel;
      this.scaleRangeTextEl.textContent = `(${levelMeta.typicalRange})`;
    }

    if (
      currentLevelId === 'molecular-complex' ||
      currentLevelId === 'molecule'
    ) {
      this.molCardEl.classList.remove('is-hidden');
      this.molLevelBadgeEl.textContent = `${levelMeta.label} • ${organelle.name}`;
      this.molTitleEl.textContent = molecularRecord.name;
      this.molSizeEl.textContent = `Nominal Dimension: ${molecularRecord.size}`;
      this.molSummaryEl.textContent = molecularRecord.summary;

      if (pdbLoadState === 'loaded-pdb') {
        this.molStatusPillEl.textContent = `Verified PDB Cα/P Trace (${pdbAtomCount} atoms)`;
        this.molStatusPillEl.className = 'mol-status-pill is-verified';
        this.molAlertEl.textContent = `Rendering authentic experimental backbone coordinates fetched from RCSB PDB entry ${molecularRecord.pdbId}. Note: Displayed on an isolated nanometer stage, not embedded at true scale inside the whole-cell mesh.`;
      } else if (pdbLoadState === 'unavailable-fallback') {
        this.molStatusPillEl.textContent = 'Schematic Fallback (Model Unavailable)';
        this.molStatusPillEl.className = 'mol-status-pill is-fallback';
        this.molAlertEl.textContent = `Full atomic coordinates are not loaded in-browser for this view (multi-megadalton cryo-EM assembly or offline fallback). The 3D viewport shows a schematic bounding envelope; inspect the verified atomic model directly at RCSB PDB (${molecularRecord.pdbId}) below.`;
      } else if (pdbLoadState === 'loading') {
        this.molStatusPillEl.textContent = 'Fetching RCSB PDB...';
        this.molStatusPillEl.className = 'mol-status-pill';
        this.molAlertEl.textContent = levelMeta.transitionNote;
      } else {
        this.molStatusPillEl.textContent = 'Labeled Schematic Proxy';
        this.molStatusPillEl.className = 'mol-status-pill';
        this.molAlertEl.textContent = levelMeta.transitionNote;
      }

      this.molPdbLinkEl.href = molecularRecord.pdbUrl;
      this.molPdbLinkEl.textContent = `RCSB PDB ${molecularRecord.pdbId}: ${molecularRecord.pdbTitle} ↗`;

      this.loadPdbBtn.textContent = molecularRecord.supportsLiveTrace
        ? `Fetch PDB ${molecularRecord.pdbId} Backbone`
        : `Verify ${molecularRecord.pdbId} Fallback`;

      this.toggleFallbackBtn.textContent =
        pdbLoadState === 'unavailable-fallback'
          ? 'Restore Schematic Proxy'
          : 'Test Missing-Model Fallback';
    } else {
      this.molCardEl.classList.add('is-hidden');
    }
  }
}