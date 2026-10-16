import { resolveOrganelleReferences } from '../data/references.js';
import { SCIENTIFIC_DISCLAIMER } from '../data/organelles.js';

export class InfoPanel {
  constructor(container, { onClose, onFocusOrganelle } = {}) {
    this.container = container;
    this.onClose = onClose;
    this.onFocusOrganelle = onFocusOrganelle;
    this.currentOrganelle = null;
    this.activeTab = 'all';

    this._renderShell();
    this._bindShellEvents();
  }

  _renderShell() {
    this.container.innerHTML = `
      <div
        id="info-panel-card"
        class="info-panel is-hidden"
        role="region"
        aria-label="Organelle Scientific Information Panel"
        aria-live="polite"
      >
        <div class="info-panel-header">
          <div class="info-title-group">
            <span id="info-color-dot" class="info-color-dot" aria-hidden="true"></span>
            <div class="info-title-text">
              <div class="info-badge-row">
                <span id="info-category" class="info-category"></span>
                <span id="info-ontology" class="info-ontology-pill"></span>
              </div>
              <h2 id="info-title" class="info-title">Select an Organelle</h2>
              <p id="info-scientific-name" class="info-scientific-name"></p>
            </div>
          </div>
          <button
            id="btn-close-info"
            type="button"
            class="btn-icon-close"
            aria-label="Close organelle information panel"
            title="Close (Esc)"
          >
            &times;
          </button>
        </div>

        <nav class="info-tabs" aria-label="Information Panel Sections">
          <button type="button" class="info-tab is-active" data-tab="all">
            All
          </button>
          <button type="button" class="info-tab" data-tab="overview">
            Overview
          </button>
          <button type="button" class="info-tab" data-tab="structure">
            Structure
          </button>
          <button type="button" class="info-tab" data-tab="function">
            Function
          </button>
          <button type="button" class="info-tab" data-tab="references">
            References <span id="info-ref-count" class="tab-count">0</span>
          </button>
        </nav>

        <div id="info-panel-body" class="info-panel-body">
          <!-- Section 1: Overview -->
          <section class="info-section" data-section="overview">
            <h3 class="info-subheading">Overview</h3>
            <p id="info-overview" class="info-text"></p>
            <div class="info-kv-row">
              <span class="info-kv-label">Synonyms:</span>
              <span id="info-synonyms" class="info-kv-value"></span>
            </div>
          </section>

          <!-- Section 2: Structure -->
          <section class="info-section" data-section="structure">
            <h3 class="info-subheading">Structure &amp; Ultrastructure</h3>
            <p id="info-structure" class="info-text"></p>

            <div class="info-note-card info-note-context">
              <span class="note-card-title">Context-Dependent Biology</span>
              <p id="info-context-dep" class="note-card-text"></p>
            </div>

            <div class="info-note-card info-note-simplification">
              <span class="note-card-title">3D Artistic Simplification</span>
              <p id="info-simplification" class="note-card-text"></p>
            </div>
          </section>

          <!-- Section 3: Function -->
          <section class="info-section" data-section="function">
            <h3 class="info-subheading">Biological Function</h3>
            <p id="info-function" class="info-text"></p>

            <h4 class="info-minor-heading">Key Organelle &amp; Molecular Interactions</h4>
            <p id="info-interactions" class="info-text info-text-secondary"></p>
          </section>

          <!-- Section 4: References -->
          <section class="info-section" data-section="references">
            <div class="section-title-bar">
              <h3 class="info-subheading">Peer-Reviewed References</h3>
              <span class="verification-pill">Claim-Mapped</span>
            </div>
            <ul id="info-references-list" class="reference-list"></ul>
          </section>

          <!-- Visible Scientific Limitations Notice -->
          <div class="info-limitations-banner">
            <strong>Scientific Limitations Note:</strong>
            <span>${SCIENTIFIC_DISCLAIMER}</span>
          </div>
        </div>

        <div class="info-panel-footer">
          <button
            id="btn-refocus-organelle"
            type="button"
            class="btn-secondary"
          >
            Refocus Camera on Organelle
          </button>
        </div>
      </div>
    `;

    this.cardEl = this.container.querySelector('#info-panel-card');
    this.bodyEl = this.container.querySelector('#info-panel-body');
    this.colorDotEl = this.container.querySelector('#info-color-dot');
    this.categoryEl = this.container.querySelector('#info-category');
    this.ontologyEl = this.container.querySelector('#info-ontology');
    this.titleEl = this.container.querySelector('#info-title');
    this.sciNameEl = this.container.querySelector('#info-scientific-name');
    this.synonymsEl = this.container.querySelector('#info-synonyms');
    this.overviewEl = this.container.querySelector('#info-overview');
    this.structureEl = this.container.querySelector('#info-structure');
    this.contextDepEl = this.container.querySelector('#info-context-dep');
    this.simplificationEl = this.container.querySelector('#info-simplification');
    this.functionEl = this.container.querySelector('#info-function');
    this.interactionsEl = this.container.querySelector('#info-interactions');
    this.refCountEl = this.container.querySelector('#info-ref-count');
    this.refListEl = this.container.querySelector('#info-references-list');
    this.closeBtn = this.container.querySelector('#btn-close-info');
    this.refocusBtn = this.container.querySelector('#btn-refocus-organelle');
    this.tabButtons = Array.from(
      this.container.querySelectorAll('button[data-tab]')
    );
    this.sections = Array.from(
      this.container.querySelectorAll('.info-section[data-section]')
    );
  }

  _bindShellEvents() {
    this.closeBtn.addEventListener('click', () => {
      if (this.onClose) this.onClose();
    });

    this.refocusBtn.addEventListener('click', () => {
      if (this.currentOrganelle && this.onFocusOrganelle) {
        this.onFocusOrganelle(this.currentOrganelle.id);
      }
    });

    this.tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.setActiveTab(tab);
      });
    });
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.tabButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('is-active', isMatch);
    });

    this.sections.forEach((section) => {
      const sectionKey = section.getAttribute('data-section');
      const shouldShow = tabName === 'all' || tabName === sectionKey;
      section.classList.toggle('is-section-hidden', !shouldShow);
    });

    if (this.bodyEl) {
      this.bodyEl.scrollTop = 0;
    }
  }

  _renderReferences(resolvedRefs) {
    this.refCountEl.textContent = String(resolvedRefs.length);
    this.refListEl.innerHTML = resolvedRefs
      .map((ref) => {
        const isVerified = ref.verificationStatus === 'verified';
        const statusBadge = isVerified
          ? '<span class="ref-status ref-status-verified">Verified DOI</span>'
          : '<span class="ref-status ref-status-unverified">Unverified</span>';

        const titleMarkup = ref.url
          ? `<a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="ref-title-link">${ref.title} &#8599;</a>`
          : `<span class="ref-title-plain">${ref.title}</span>`;

        const doiLine = ref.doi
          ? `<a href="https://doi.org/${ref.doi}" target="_blank" rel="noopener noreferrer" class="ref-doi-link">DOI: ${ref.doi}</a>`
          : '';

        return `
          <li class="reference-card">
            <div class="ref-top-row">
              ${titleMarkup}
              ${statusBadge}
            </div>
            <div class="ref-citation-meta">
              <span>${ref.authors}</span> &bull;
              <em>${ref.journal}</em> (${ref.year}) ${ref.volumePages || ''}
              ${doiLine ? `&bull; ${doiLine}` : ''}
            </div>
            <div class="ref-claim-box">
              <span class="ref-claim-label">Supports:</span>
              <span>${ref.claimSupported}</span>
            </div>
          </li>
        `;
      })
      .join('');
  }

  update(organelle) {
    this.currentOrganelle = organelle || null;

    if (!organelle) {
      this.cardEl.classList.add('is-hidden');
      return;
    }

    this.colorDotEl.style.backgroundColor = organelle.color;
    this.categoryEl.textContent = organelle.category;
    this.ontologyEl.textContent = organelle.ontologyId || organelle.id;
    this.titleEl.textContent = organelle.name;
    this.sciNameEl.textContent = organelle.scientificName || '';
    this.synonymsEl.textContent = Array.isArray(organelle.synonyms)
      ? organelle.synonyms.join(', ')
      : 'None listed';

    this.overviewEl.textContent = organelle.overview || organelle.summary;
    this.structureEl.textContent = organelle.structure || '';
    this.contextDepEl.textContent = organelle.contextDependency || '';
    this.simplificationEl.textContent = organelle.visualSimplification || '';
    this.functionEl.textContent = organelle.function || '';
    this.interactionsEl.textContent = organelle.interactions || '';

    const resolvedRefs = resolveOrganelleReferences(organelle.references);
    this._renderReferences(resolvedRefs);

    this.cardEl.classList.remove('is-hidden');
    if (this.bodyEl) {
      this.bodyEl.scrollTop = 0;
    }
  }
}