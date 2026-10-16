import { ORGANELLES } from '../data/organelles.js';

export class AtlasToolbar {
  constructor(
    container,
    {
      onSelectOrganelle,
      onStartTour,
      onOpenModal,
      onTogglePresentationMode
    } = {}
  ) {
    this.container = container;
    this.onSelectOrganelle = onSelectOrganelle;
    this.onStartTour = onStartTour;
    this.onOpenModal = onOpenModal;
    this.onTogglePresentationMode = onTogglePresentationMode;

    this.searchResults = [];
    this.activeResultIndex = -1;

    this._render();
    this._bindEvents();
  }

  _render() {
    this.container.innerHTML = `
      <div class="atlas-toolbar">
        <div class="search-box-wrapper" role="search">
          <span class="search-icon" aria-hidden="true">&#8981;</span>
          <input
            id="atlas-search-input"
            type="search"
            class="atlas-search-input"
            placeholder="Search organelles, synonyms (e.g. MTOC, ergastoplasm) or functions (ATP, glycosylation)..."
            aria-label="Search organelles by name, synonym, or biological function"
            aria-autocomplete="list"
            aria-controls="atlas-search-results"
            aria-expanded="false"
            autocomplete="off"
          />
          <button
            id="btn-clear-search"
            type="button"
            class="btn-clear-search is-hidden"
            aria-label="Clear search query"
          >
            &times;
          </button>
          <ul
            id="atlas-search-results"
            class="search-results-dropdown is-hidden"
            role="listbox"
            aria-label="Matching organelles"
          ></ul>
        </div>

        <div class="toolbar-actions" role="toolbar" aria-label="Atlas educational tools">
          <button
            id="btn-launch-tour"
            type="button"
            class="btn-tool btn-tool-accent"
            aria-label="Start guided educational cell tour"
          >
            Guided Tour
          </button>
          <button
            id="btn-open-compare"
            type="button"
            class="btn-tool"
            aria-label="Compare two organelles side by side"
          >
            Compare (2)
          </button>
          <button
            id="btn-open-glossary"
            type="button"
            class="btn-tool"
            aria-label="Open cellular biology glossary"
          >
            Glossary
          </button>
          <button
            id="btn-open-quiz"
            type="button"
            class="btn-tool"
            aria-label="Open verified scientific quiz"
          >
            Quiz
          </button>
          <button
            id="btn-open-limitations"
            type="button"
            class="btn-tool"
            aria-label="View scientific limitations and methodology"
          >
            Limitations
          </button>
          <button
            id="btn-presentation-mode"
            type="button"
            class="btn-tool btn-tool-subtle"
            aria-label="Enter clean presentation mode for screenshots"
            title="Clean full-bleed viewport for screenshots (Shortcut: P)"
          >
            Presentation Mode
          </button>
        </div>
      </div>
    `;

    this.searchInput = this.container.querySelector('#atlas-search-input');
    this.clearSearchBtn = this.container.querySelector('#btn-clear-search');
    this.resultsDropdown = this.container.querySelector(
      '#atlas-search-results'
    );

    this.tourBtn = this.container.querySelector('#btn-launch-tour');
    this.compareBtn = this.container.querySelector('#btn-open-compare');
    this.glossaryBtn = this.container.querySelector('#btn-open-glossary');
    this.quizBtn = this.container.querySelector('#btn-open-quiz');
    this.limitationsBtn = this.container.querySelector('#btn-open-limitations');
    this.presentationBtn = this.container.querySelector(
      '#btn-presentation-mode'
    );
  }

  _bindEvents() {
    this.searchInput.addEventListener('input', () => {
      const query = this.searchInput.value.trim();
      this.clearSearchBtn.classList.toggle('is-hidden', query.length === 0);
      this._updateSearchResults(query);
    });

    this.searchInput.addEventListener('focus', () => {
      const query = this.searchInput.value.trim();
      if (query.length > 0) {
        this._updateSearchResults(query);
      }
    });

    this.searchInput.addEventListener('keydown', (event) => {
      if (this.resultsDropdown.classList.contains('is-hidden')) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.searchResults.length > 0) {
          this.activeResultIndex =
            (this.activeResultIndex + 1) % this.searchResults.length;
          this._highlightActiveResult();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.searchResults.length > 0) {
          this.activeResultIndex =
            (this.activeResultIndex - 1 + this.searchResults.length) %
            this.searchResults.length;
          this._highlightActiveResult();
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const chosen =
          this.searchResults[this.activeResultIndex] || this.searchResults[0];
        if (chosen) {
          this._chooseOrganelle(chosen.organelle.id);
        }
      } else if (event.key === 'Escape') {
        this.closeSearchDropdown();
      }
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearSearchBtn.classList.add('is-hidden');
      this.closeSearchDropdown();
      this.searchInput.focus();
    });

    this._onDocumentPointerDown = (event) => {
      if (!this.container.contains(event.target)) {
        this.closeSearchDropdown();
      }
    };
    document.addEventListener('pointerdown', this._onDocumentPointerDown);

    this.tourBtn.addEventListener('click', () => {
      if (this.onStartTour) this.onStartTour();
    });

    this.compareBtn.addEventListener('click', (e) => {
      if (this.onOpenModal) this.onOpenModal('compare', e.currentTarget);
    });

    this.glossaryBtn.addEventListener('click', (e) => {
      if (this.onOpenModal) this.onOpenModal('glossary', e.currentTarget);
    });

    this.quizBtn.addEventListener('click', (e) => {
      if (this.onOpenModal) this.onOpenModal('quiz', e.currentTarget);
    });

    this.limitationsBtn.addEventListener('click', (e) => {
      if (this.onOpenModal) this.onOpenModal('limitations', e.currentTarget);
    });

    this.presentationBtn.addEventListener('click', () => {
      if (this.onTogglePresentationMode) this.onTogglePresentationMode();
    });
  }

  _scoreOrganelleMatch(organelle, rawQuery) {
    const q = rawQuery.toLowerCase();
    const nameMatch = organelle.name.toLowerCase().includes(q);
    const sciMatch = (organelle.scientificName || '')
      .toLowerCase()
      .includes(q);
    const synMatch = (organelle.synonyms || []).find((s) =>
      s.toLowerCase().includes(q)
    );
    const catMatch = (organelle.category || '').toLowerCase().includes(q);
    const fnMatch =
      (organelle.function || '').toLowerCase().includes(q) ||
      (organelle.summary || '').toLowerCase().includes(q);
    const structMatch =
      (organelle.structure || '').toLowerCase().includes(q) ||
      (organelle.overview || '').toLowerCase().includes(q) ||
      (organelle.interactions || '').toLowerCase().includes(q);

    if (nameMatch) {
      return { score: 100, matchReason: 'Primary Name' };
    }
    if (synMatch) {
      return { score: 90, matchReason: `Synonym: ${synMatch}` };
    }
    if (sciMatch) {
      return { score: 85, matchReason: `Scientific: ${organelle.scientificName}` };
    }
    if (fnMatch) {
      return { score: 75, matchReason: 'Biological Function match' };
    }
    if (structMatch) {
      return { score: 65, matchReason: 'Structure / Interaction match' };
    }
    if (catMatch) {
      return { score: 50, matchReason: `Category: ${organelle.category}` };
    }
    return null;
  }

  _updateSearchResults(query) {
    if (!query) {
      this.closeSearchDropdown();
      return;
    }

    const matches = [];
    ORGANELLES.forEach((org) => {
      const scored = this._scoreOrganelleMatch(org, query);
      if (scored) {
        matches.push({
          organelle: org,
          score: scored.score,
          matchReason: scored.matchReason
        });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    this.searchResults = matches;
    this.activeResultIndex = matches.length > 0 ? 0 : -1;

    if (matches.length === 0) {
      this.resultsDropdown.innerHTML = `
        <li class="search-empty-item">
          No organelles matched "<strong>${this._escapeHtml(query)}</strong>". Try terms like <em>ATP</em>, <em>MTOC</em>, <em>cristae</em>, or <em>glycosylation</em>.
        </li>
      `;
    } else {
      this.resultsDropdown.innerHTML = matches
        .map(
          (item, idx) => `
          <li
            class="search-result-item ${idx === 0 ? 'is-active' : ''}"
            role="option"
            aria-selected="${idx === 0 ? 'true' : 'false'}"
            data-result-id="${item.organelle.id}"
          >
            <div class="search-result-top">
              <span class="search-result-name">
                <span class="color-swatch" style="background-color: ${item.organelle.color}"></span>
                ${item.organelle.name}
              </span>
              <span class="search-match-badge">${item.matchReason}</span>
            </div>
            <p class="search-result-summary">${item.organelle.summary}</p>
          </li>
        `
        )
        .join('');

      const items = this.resultsDropdown.querySelectorAll(
        'li[data-result-id]'
      );
      items.forEach((li) => {
        li.addEventListener('click', () => {
          const id = li.getAttribute('data-result-id');
          this._chooseOrganelle(id);
        });
      });
    }

    this.resultsDropdown.classList.remove('is-hidden');
    this.searchInput.setAttribute('aria-expanded', 'true');
  }

  _highlightActiveResult() {
    const items = Array.from(
      this.resultsDropdown.querySelectorAll('li[data-result-id]')
    );
    items.forEach((li, idx) => {
      const active = idx === this.activeResultIndex;
      li.classList.toggle('is-active', active);
      li.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) {
        li.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  _chooseOrganelle(organelleId) {
    this.closeSearchDropdown();
    if (this.onSelectOrganelle) {
      this.onSelectOrganelle(organelleId);
    }
  }

  closeSearchDropdown() {
    this.resultsDropdown.classList.add('is-hidden');
    this.searchInput.setAttribute('aria-expanded', 'false');
    this.activeResultIndex = -1;
  }

  dispose() {
    if (this._onDocumentPointerDown) {
      document.removeEventListener('pointerdown', this._onDocumentPointerDown);
    }
  }

  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}