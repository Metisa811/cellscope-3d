import { ORGANELLES, ORGANELLE_MAP } from '../data/organelles.js';
import { resolveOrganelleReferences, REFERENCES } from '../data/references.js';
import { ORGANELLE_MOLECULAR_DATA } from '../data/scaleLevels.js';
import {
  GUIDED_TOUR_STEPS,
  GLOSSARY_TERMS,
  VERIFIED_QUIZ_QUESTIONS,
  SCIENTIFIC_LIMITATIONS_POINTS
} from '../data/atlasLearningData.js';

function safeField(value, fallback = 'Not specified in current record') {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : fallback;
  }
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export class AtlasModals {
  constructor(
    container,
    { onSelectAndFocusOrganelle, onApplyTourStepState } = {}
  ) {
    this.container = container;
    this.onSelectAndFocusOrganelle = onSelectAndFocusOrganelle;
    this.onApplyTourStepState = onApplyTourStepState;

    this.tourActive = false;
    this.tourIndex = 0;
    this.tourAutoPlaying = false;
    this.tourTimer = null;

    this.compareIdA = 'mitochondria';
    this.compareIdB = 'peroxisomes';

    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnsweredMap = new Map();

    this.activeModal = null;
    this.lastTriggerEl = null;

    this._renderShell();
    this._bindEvents();
  }

  _renderShell() {
    const organelleOptionsMarkup = ORGANELLES.map(
      (org) => `<option value="${org.id}">${org.name}</option>`
    ).join('');

    this.container.innerHTML = `
      <section
        id="guided-tour-dock"
        class="tour-dock is-hidden"
        role="region"
        aria-label="Guided Educational Cell Tour"
        aria-live="polite"
      >
        <div class="tour-dock-header">
          <div class="tour-step-meta">
            <span id="tour-step-badge" class="tour-step-badge">Step 1 of ${GUIDED_TOUR_STEPS.length}</span>
            <h3 id="tour-step-title" class="tour-step-title"></h3>
          </div>
          <button
            id="btn-tour-exit"
            type="button"
            class="btn-icon-close"
            aria-label="Exit guided tour"
            title="Exit Guided Tour"
          >
            &times;
          </button>
        </div>

        <p id="tour-step-narration" class="tour-step-narration"></p>

        <div id="tour-step-refs" class="tour-step-refs"></div>

        <div class="tour-dock-controls">
          <button
            id="btn-tour-prev"
            type="button"
            class="btn-secondary btn-compact"
            aria-label="Previous tour stop"
          >
            &#8592; Previous
          </button>
          <button
            id="btn-tour-pause"
            type="button"
            class="btn-secondary btn-compact"
            aria-label="Pause or resume automatic tour playback"
          >
            Auto-Advance: Paused
          </button>
          <button
            id="btn-tour-next"
            type="button"
            class="btn-primary-solid btn-compact"
            aria-label="Next tour stop"
          >
            Next &#8594;
          </button>
          <button
            id="btn-tour-exit-text"
            type="button"
            class="btn-link"
          >
            Exit Tour
          </button>
        </div>
      </section>

      <div
        id="atlas-modal-backdrop"
        class="atlas-modal-backdrop is-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="atlas-modal-heading"
      >
        <div class="atlas-modal-card">
          <div class="atlas-modal-header">
            <h2 id="atlas-modal-heading" class="atlas-modal-title">Atlas Tool</h2>
            <button
              id="btn-close-modal"
              type="button"
              class="btn-icon-close"
              aria-label="Close panel"
            >
              &times;
            </button>
          </div>

          <div id="modal-view-compare" class="modal-view is-hidden">
            <div class="compare-selector-bar">
              <div class="compare-picker">
                <label for="select-compare-a" class="compare-label">Organelle A</label>
                <select id="select-compare-a" class="compare-select">
                  ${organelleOptionsMarkup}
                </select>
                <button
                  id="btn-focus-compare-a"
                  type="button"
                  class="btn-link"
                >
                  Inspect A in 3D &#8599;
                </button>
              </div>

              <button
                id="btn-swap-compare"
                type="button"
                class="btn-secondary btn-compact"
                aria-label="Swap compared organelles"
              >
                &#8646; Swap
              </button>

              <div class="compare-picker">
                <label for="select-compare-b" class="compare-label">Organelle B</label>
                <select id="select-compare-b" class="compare-select">
                  ${organelleOptionsMarkup}
                </select>
                <button
                  id="btn-focus-compare-b"
                  type="button"
                  class="btn-link"
                >
                  Inspect B in 3D &#8599;
                </button>
              </div>
            </div>

            <div id="compare-table-container" class="compare-table-wrapper"></div>
          </div>

          <div id="modal-view-glossary" class="modal-view is-hidden">
            <div class="glossary-filter-bar">
              <input
                id="glossary-filter-input"
                type="search"
                class="atlas-search-input"
                placeholder="Filter glossary terms (e.g. LLPS, cristae, COPII, crowding)..."
                aria-label="Filter glossary terms"
              />
            </div>
            <div id="glossary-list-container" class="glossary-list"></div>
          </div>

          <div id="modal-view-quiz" class="modal-view is-hidden">
            <div id="quiz-body-container" class="quiz-container"></div>
          </div>

          <div id="modal-view-limitations" class="modal-view is-hidden">
            <p class="limitations-intro">
              CellScope 3D is designed for scientific transparency. Please review the following methodological boundaries distinguishing established cell biology from context-dependent variations and 3D visual simplifications:
            </p>
            <div class="limitations-grid">
              ${SCIENTIFIC_LIMITATIONS_POINTS.map(
                (item) => `
                <article class="limitation-card">
                  <h3 class="limitation-title">${item.title}</h3>
                  <p class="limitation-detail">${item.detail}</p>
                </article>
              `
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.tourDockEl = this.container.querySelector('#guided-tour-dock');
    this.tourBadgeEl = this.container.querySelector('#tour-step-badge');
    this.tourTitleEl = this.container.querySelector('#tour-step-title');
    this.tourNarrationEl = this.container.querySelector('#tour-step-narration');
    this.tourRefsEl = this.container.querySelector('#tour-step-refs');
    this.tourPrevBtn = this.container.querySelector('#btn-tour-prev');
    this.tourPauseBtn = this.container.querySelector('#btn-tour-pause');
    this.tourNextBtn = this.container.querySelector('#btn-tour-next');
    this.tourExitBtn = this.container.querySelector('#btn-tour-exit');
    this.tourExitTextBtn = this.container.querySelector('#btn-tour-exit-text');

    this.backdropEl = this.container.querySelector('#atlas-modal-backdrop');
    this.modalHeadingEl = this.container.querySelector('#atlas-modal-heading');
    this.closeModalBtn = this.container.querySelector('#btn-close-modal');

    this.viewCompareEl = this.container.querySelector('#modal-view-compare');
    this.viewGlossaryEl = this.container.querySelector('#modal-view-glossary');
    this.viewQuizEl = this.container.querySelector('#modal-view-quiz');
    this.viewLimitationsEl = this.container.querySelector(
      '#modal-view-limitations'
    );

    this.selectCompareA = this.container.querySelector('#select-compare-a');
    this.selectCompareB = this.container.querySelector('#select-compare-b');
    this.swapCompareBtn = this.container.querySelector('#btn-swap-compare');
    this.focusCompareABtn = this.container.querySelector(
      '#btn-focus-compare-a'
    );
    this.focusCompareBBtn = this.container.querySelector(
      '#btn-focus-compare-b'
    );
    this.compareTableContainer = this.container.querySelector(
      '#compare-table-container'
    );

    this.glossaryFilterInput = this.container.querySelector(
      '#glossary-filter-input'
    );
    this.glossaryListContainer = this.container.querySelector(
      '#glossary-list-container'
    );

    this.quizBodyContainer = this.container.querySelector(
      '#quiz-body-container'
    );
  }

  _bindEvents() {
    this.tourPrevBtn.addEventListener('click', () => {
      this._pauseTourTimer();
      this.goToTourStep(this.tourIndex - 1);
    });

    this.tourNextBtn.addEventListener('click', () => {
      this._pauseTourTimer();
      this.goToTourStep(this.tourIndex + 1);
    });

    this.tourPauseBtn.addEventListener('click', () => {
      this.toggleTourAutoPlay();
    });

    this.tourExitBtn.addEventListener('click', () => this.stopTour());
    this.tourExitTextBtn.addEventListener('click', () => this.stopTour());

    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.backdropEl.addEventListener('click', (event) => {
      if (event.target === this.backdropEl) {
        this.closeModal();
      }
    });

    this.selectCompareA.value = this.compareIdA;
    this.selectCompareB.value = this.compareIdB;

    this.selectCompareA.addEventListener('change', (e) => {
      this.compareIdA = e.target.value;
      this._renderComparisonTable();
    });

    this.selectCompareB.addEventListener('change', (e) => {
      this.compareIdB = e.target.value;
      this._renderComparisonTable();
    });

    this.swapCompareBtn.addEventListener('click', () => {
      const temp = this.compareIdA;
      this.compareIdA = this.compareIdB;
      this.compareIdB = temp;
      this.selectCompareA.value = this.compareIdA;
      this.selectCompareB.value = this.compareIdB;
      this._renderComparisonTable();
    });

    this.focusCompareABtn.addEventListener('click', () => {
      const targetId = this.compareIdA;
      this.closeModal();
      if (this.onSelectAndFocusOrganelle) {
        this.onSelectAndFocusOrganelle(targetId);
      }
    });

    this.focusCompareBBtn.addEventListener('click', () => {
      const targetId = this.compareIdB;
      this.closeModal();
      if (this.onSelectAndFocusOrganelle) {
        this.onSelectAndFocusOrganelle(targetId);
      }
    });

    this.glossaryFilterInput.addEventListener('input', () => {
      this._renderGlossaryList(this.glossaryFilterInput.value.trim());
    });
  }

  startTour() {
    this.closeModal();
    this.tourActive = true;
    this.tourIndex = 0;
    this.tourDockEl.classList.remove('is-hidden');
    this._startTourTimer();
    this.goToTourStep(0);
  }

  stopTour() {
    this.tourActive = false;
    this._pauseTourTimer();
    this.tourDockEl.classList.add('is-hidden');
  }

  toggleTourAutoPlay() {
    if (this.tourAutoPlaying) {
      this._pauseTourTimer();
    } else {
      this._startTourTimer();
    }
  }

  _startTourTimer() {
    this._clearTourInterval();
    this.tourAutoPlaying = true;
    this.tourPauseBtn.textContent = 'Pause Auto-Play (9s)';
    this.tourTimer = setInterval(() => {
      if (!this.tourActive) return;
      const nextIdx = (this.tourIndex + 1) % GUIDED_TOUR_STEPS.length;
      this.goToTourStep(nextIdx);
    }, 9000);
  }

  _pauseTourTimer() {
    this._clearTourInterval();
    this.tourAutoPlaying = false;
    if (this.tourPauseBtn) {
      this.tourPauseBtn.textContent = 'Resume Auto-Play';
    }
  }

  _clearTourInterval() {
    if (this.tourTimer) {
      clearInterval(this.tourTimer);
      this.tourTimer = null;
    }
  }

  goToTourStep(index) {
    const total = GUIDED_TOUR_STEPS.length;
    this.tourIndex = ((index % total) + total) % total;
    const step = GUIDED_TOUR_STEPS[this.tourIndex];
    const org = ORGANELLE_MAP.get(step.organelleId);

    this.tourBadgeEl.textContent = `Step ${this.tourIndex + 1} of ${total} • ${
      org ? org.name : step.organelleId
    }`;
    this.tourTitleEl.textContent = step.title;
    this.tourNarrationEl.textContent = step.narration;

    const refLinks = step.refIds
      .map((id) => REFERENCES[id])
      .filter(Boolean)
      .map(
        (ref) =>
          `<a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="tour-ref-chip" title="${ref.title}">${ref.authors.split(',')[0]} (${ref.year}) &#8599;</a>`
      )
      .join('');

    this.tourRefsEl.innerHTML = `
      <span class="tour-ref-label">Verified Sources:</span>
      ${refLinks}
    `;

    if (this.onApplyTourStepState) {
      this.onApplyTourStepState(step);
    }
  }

  openModal(modalName, triggerEl = null) {
    this.activeModal = modalName;
    this.lastTriggerEl = triggerEl || document.activeElement;
    this.backdropEl.classList.remove('is-hidden');

    this.viewCompareEl.classList.toggle('is-hidden', modalName !== 'compare');
    this.viewGlossaryEl.classList.toggle('is-hidden', modalName !== 'glossary');
    this.viewQuizEl.classList.toggle('is-hidden', modalName !== 'quiz');
    this.viewLimitationsEl.classList.toggle(
      'is-hidden',
      modalName !== 'limitations'
    );

    if (modalName === 'compare') {
      this.modalHeadingEl.textContent =
        'Side-by-Side Organelle Comparison Matrix';
      this._renderComparisonTable();
      this.selectCompareA.focus();
    } else if (modalName === 'glossary') {
      this.modalHeadingEl.textContent =
        'Cellular & Ultrastructural Glossary (Verified Sources)';
      this.glossaryFilterInput.value = '';
      this._renderGlossaryList('');
      this.glossaryFilterInput.focus();
    } else if (modalName === 'quiz') {
      this.modalHeadingEl.textContent =
        'CellScope 3D Knowledge Check (Literature-Grounded)';
      this._renderQuizView();
      this.closeModalBtn.focus();
    } else if (modalName === 'limitations') {
      this.modalHeadingEl.textContent =
        'Scientific Scope, Representation & Limitations';
      this.closeModalBtn.focus();
    }
  }

  closeModal() {
    this.activeModal = null;
    this.backdropEl.classList.add('is-hidden');
    if (this.lastTriggerEl && typeof this.lastTriggerEl.focus === 'function') {
      this.lastTriggerEl.focus();
      this.lastTriggerEl = null;
    }
  }

  _renderComparisonTable() {
    const orgA = ORGANELLE_MAP.get(this.compareIdA) || {};
    const orgB = ORGANELLE_MAP.get(this.compareIdB) || {};

    const molA = ORGANELLE_MOLECULAR_DATA[this.compareIdA]?.complex;
    const molB = ORGANELLE_MOLECULAR_DATA[this.compareIdB]?.complex;

    const refsA = resolveOrganelleReferences(orgA.references || []);
    const refsB = resolveOrganelleReferences(orgB.references || []);

    const rows = [
      {
        label: 'Scientific Name',
        valA: safeField(orgA.scientificName),
        valB: safeField(orgB.scientificName)
      },
      {
        label: 'Compartment Category',
        valA: safeField(orgA.category),
        valB: safeField(orgB.category)
      },
      {
        label: 'GO / UniProt Ontology ID',
        valA: `<code>${safeField(orgA.ontologyId)}</code>`,
        valB: `<code>${safeField(orgB.ontologyId)}</code>`
      },
      {
        label: 'Synonyms',
        valA: safeField(orgA.synonyms),
        valB: safeField(orgB.synonyms)
      },
      {
        label: 'Structural Architecture',
        valA: safeField(orgA.structure),
        valB: safeField(orgB.structure)
      },
      {
        label: 'Biological Function',
        valA: safeField(orgA.function),
        valB: safeField(orgB.function)
      },
      {
        label: 'Key Interactions',
        valA: safeField(orgA.interactions),
        valB: safeField(orgB.interactions)
      },
      {
        label: 'Context-Dependent Biology',
        valA: safeField(orgA.contextDependency),
        valB: safeField(orgB.contextDependency)
      },
      {
        label: '3D Schematic Simplification',
        valA: safeField(orgA.visualSimplification),
        valB: safeField(orgB.visualSimplification)
      },
      {
        label: 'Representative Molecular Complex (PDB)',
        valA: molA
          ? `<strong>${safeField(molA.name)}</strong> (${safeField(
              molA.size
            )}) — <a href="${molA.pdbUrl}" target="_blank" rel="noopener noreferrer" class="ref-title-link">PDB ${
              molA.pdbId
            } &#8599;</a>`
          : 'Not specified in current record',
        valB: molB
          ? `<strong>${safeField(molB.name)}</strong> (${safeField(
              molB.size
            )}) — <a href="${molB.pdbUrl}" target="_blank" rel="noopener noreferrer" class="ref-title-link">PDB ${
              molB.pdbId
            } &#8599;</a>`
          : 'Not specified in current record'
      },
      {
        label: 'Verified Supporting Literature',
        valA:
          refsA.length > 0
            ? refsA
                .map(
                  (r) =>
                    `<div class="cmp-ref-item"><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="ref-title-link">${r.title} (${r.year}) &#8599;</a></div>`
                )
                .join('')
            : 'No verified references linked',
        valB:
          refsB.length > 0
            ? refsB
                .map(
                  (r) =>
                    `<div class="cmp-ref-item"><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="ref-title-link">${r.title} (${r.year}) &#8599;</a></div>`
                )
                .join('')
            : 'No verified references linked'
      }
    ];

    this.compareTableContainer.innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th class="cmp-col-feature">Dimension / Attribute</th>
            <th class="cmp-col-org">
              <span class="color-swatch" style="background-color: ${safeField(
                orgA.color,
                '#0284c7'
              )}"></span>
              ${safeField(orgA.name)}
            </th>
            <th class="cmp-col-org">
              <span class="color-swatch" style="background-color: ${safeField(
                orgB.color,
                '#0284c7'
              )}"></span>
              ${safeField(orgB.name)}
            </th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) => `
            <tr>
              <th scope="row" class="cmp-row-head">${r.label}</th>
              <td>${r.valA}</td>
              <td>${r.valB}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  _renderGlossaryList(query) {
    const q = query.toLowerCase();
    const filtered = GLOSSARY_TERMS.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      this.glossaryListContainer.innerHTML = `
        <p class="sidebar-description">No glossary entries matched your filter.</p>
      `;
      return;
    }

    this.glossaryListContainer.innerHTML = filtered
      .map((item) => {
        const org = ORGANELLE_MAP.get(item.organelleId);
        const ref = REFERENCES[item.refId];
        return `
          <article class="glossary-card">
            <div class="glossary-card-top">
              <h3 class="glossary-term-title">${item.term}</h3>
              ${
                org
                  ? `<button type="button" class="btn-glossary-org" data-glossary-org="${org.id}">
                      <span class="color-swatch" style="background-color: ${org.color}"></span>
                      Inspect ${org.name} in 3D
                    </button>`
                  : ''
              }
            </div>
            <p class="glossary-term-def">${item.definition}</p>
            ${
              ref
                ? `<div class="glossary-ref-line">
                    <span>Source:</span>
                    <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="ref-title-link">
                      ${ref.title} (${ref.journal},${ref.year}) &#8599;
                    </a>
                  </div>`
                : ''
            }
          </article>
        `;
      })
      .join('');

    const orgBtns = this.glossaryListContainer.querySelectorAll(
      'button[data-glossary-org]'
    );
    orgBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const orgId = btn.getAttribute('data-glossary-org');
        this.closeModal();
        if (this.onSelectAndFocusOrganelle) {
          this.onSelectAndFocusOrganelle(orgId);
        }
      });
    });
  }

  _renderQuizView() {
    const total = VERIFIED_QUIZ_QUESTIONS.length;
    const qObj = VERIFIED_QUIZ_QUESTIONS[this.quizIndex];
    const selectedOption = this.quizAnsweredMap.get(qObj.id);
    const hasAnswered = selectedOption !== undefined;
    const org = ORGANELLE_MAP.get(qObj.organelleId);

    const refsMarkup = qObj.refIds
      .map((id) => REFERENCES[id])
      .filter(Boolean)
      .map(
        (ref) => `
        <div class="quiz-ref-item">
          <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="ref-title-link">
            ${ref.title} &#8599;
          </a>
          <span class="quiz-ref-meta">${ref.authors} • <em>${ref.journal}</em> (${ref.year}) • DOI: ${ref.doi}</span>
        </div>
      `
      )
      .join('');

    this.quizBodyContainer.innerHTML = `
      <div class="quiz-top-bar">
        <span class="quiz-progress-badge">
          Question ${this.quizIndex + 1} of ${total}
        </span>
        <span class="quiz-score-badge">
          Verified Score: ${this.quizScore} / ${this.quizAnsweredMap.size} answered
        </span>
      </div>

      <h3 class="quiz-question-text">${qObj.question}</h3>

      <div class="quiz-options-list" role="radiogroup" aria-label="Quiz answer choices">
        ${qObj.options
          .map((optText, idx) => {
            let stateClass = '';
            if (hasAnswered) {
              if (idx === qObj.correctIndex) {
                stateClass = 'is-correct';
              } else if (idx === selectedOption) {
                stateClass = 'is-incorrect';
              }
            }
            return `
              <button
                type="button"
                class="quiz-option-btn ${stateClass}"
                data-quiz-opt="${idx}"
                ${hasAnswered ? 'disabled' : ''}
              >
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${optText}</span>
              </button>
            `;
          })
          .join('')}
      </div>

      ${
        hasAnswered
          ? `
        <div class="quiz-feedback-box ${
          selectedOption === qObj.correctIndex
            ? 'feedback-correct'
            : 'feedback-incorrect'
        }">
          <div class="feedback-header">
            <strong>${
              selectedOption === qObj.correctIndex
                ? 'Correct — Grounded in Verified Literature'
                : 'Not Quite — Review Verified Mechanism Below'
            }</strong>
            ${
              org
                ? `<button type="button" id="btn-quiz-inspect-org" class="btn-link">
                    Inspect ${org.name} in 3D &#8599;
                  </button>`
                : ''
            }
          </div>
          <p class="feedback-explanation">${qObj.explanation}</p>
          <div class="quiz-refs-box">
            <span class="quiz-refs-heading">Supporting Peer-Reviewed References:</span>
            ${refsMarkup}
          </div>
        </div>
      `
          : ''
      }

      <div class="quiz-footer-nav">
        <button
          id="btn-quiz-prev"
          type="button"
          class="btn-secondary btn-compact"
          ${this.quizIndex === 0 ? 'disabled' : ''}
        >
          &#8592; Previous Question
        </button>
        <button
          id="btn-quiz-restart"
          type="button"
          class="btn-link"
        >
          Reset Quiz
        </button>
        <button
          id="btn-quiz-next"
          type="button"
          class="btn-primary-solid btn-compact"
          ${this.quizIndex === total - 1 ? 'disabled' : ''}
        >
          Next Question &#8594;
        </button>
      </div>
    `;

    const optBtns = this.quizBodyContainer.querySelectorAll(
      'button[data-quiz-opt]'
    );
    optBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosenIdx = Number(btn.getAttribute('data-quiz-opt'));
        if (!this.quizAnsweredMap.has(qObj.id)) {
          this.quizAnsweredMap.set(qObj.id, chosenIdx);
          if (chosenIdx === qObj.correctIndex) {
            this.quizScore += 1;
          }
          this._renderQuizView();
        }
      });
    });

    const inspectBtn = this.quizBodyContainer.querySelector(
      '#btn-quiz-inspect-org'
    );
    if (inspectBtn && org) {
      inspectBtn.addEventListener('click', () => {
        this.closeModal();
        if (this.onSelectAndFocusOrganelle) {
          this.onSelectAndFocusOrganelle(org.id);
        }
      });
    }

    this.quizBodyContainer
      .querySelector('#btn-quiz-prev')
      .addEventListener('click', () => {
        if (this.quizIndex > 0) {
          this.quizIndex -= 1;
          this._renderQuizView();
        }
      });

    this.quizBodyContainer
      .querySelector('#btn-quiz-next')
      .addEventListener('click', () => {
        if (this.quizIndex < total - 1) {
          this.quizIndex += 1;
          this._renderQuizView();
        }
      });

    this.quizBodyContainer
      .querySelector('#btn-quiz-restart')
      .addEventListener('click', () => {
        this.quizIndex = 0;
        this.quizScore = 0;
        this.quizAnsweredMap.clear();
        this._renderQuizView();
      });
  }

  dispose() {
    this._clearTourInterval();
  }
}