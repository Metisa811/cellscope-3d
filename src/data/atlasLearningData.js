export const GUIDED_TOUR_STEPS = [
  {
    stepNumber: 1,
    organelleId: 'plasma-membrane',
    title: 'Selective Cell Boundary: Plasma Membrane',
    narration:
      'Our tour begins at the plasma membrane—a ~5–10 nm asymmetric phospholipid bilayer embedded with integral proteins and cholesterol–sphingolipid microdomains (lipid rafts) that regulate ion gradients, receptor signaling, and cell adhesion while tethering to the underlying actin cortex.',
    explodeFactor: 0,
    crossSectionMode: 'standard',
    refIds: ['singer-nicolson-1972', 'simons-ikonen-1997', 'nicolson-2014']
  },
  {
    stepNumber: 2,
    organelleId: 'cytoplasm',
    title: 'Crowded Intracellular Matrix: Cytoplasm (Cytosol)',
    narration:
      'Stepping inside the plasma membrane reveals the cytosol. Rather than a dilute aqueous buffer, the cytosol is a viscoelastic, macromolecularly crowded medium (20–30% volume occupancy) that hosts glycolysis, protein synthesis, and restricted metabolite diffusion.',
    explodeFactor: 0,
    crossSectionMode: 'standard',
    refIds: ['luby-phelps-2000', 'ellis-2001']
  },
  {
    stepNumber: 3,
    organelleId: 'nuclear-envelope',
    title: 'Gated Genome Barrier: Nuclear Envelope & Pore Complexes',
    narration:
      'At the center of the cell, the double-membraned nuclear envelope isolates genomic DNA from cytosolic translation. Its inner and outer membranes fuse at nuclear pore complexes (NPCs) built from ~32 nucleoporins, which gate bidirectional RNA/protein transport and act as gene-regulation scaffolds.',
    explodeFactor: 0,
    crossSectionMode: 'standard',
    refIds: ['dangelo-2018', 'westrate-voeltz-2015']
  },
  {
    stepNumber: 4,
    organelleId: 'nucleolus',
    title: 'Biomolecular Condensate: Nucleolus & Chromatin Territories',
    narration:
      'Within the nucleoplasm, interphase chromosomes occupy non-random 3D chromosome territories surrounding the nucleolus—a membraneless multiphase liquid condensate where ribosomal DNA (rDNA) is transcribed and assembled into 40S and 60S pre-ribosomal subunits.',
    explodeFactor: 0.15,
    crossSectionMode: 'standard',
    refIds: ['lafontaine-2021', 'cremer-cremer-2010']
  },
  {
    stepNumber: 5,
    organelleId: 'rough-er',
    title: 'Co-Translational Protein Factory: Rough ER & 80S Ribosomes',
    narration:
      'Continuous with the outer nuclear membrane, the rough endoplasmic reticulum forms stacked cisternal sheets studded with 80S ribosomes (~4.3 MDa). Polypeptides bearing signal sequences are co-translationally translocated into the ER lumen, folded, and exported in COPII vesicles.',
    explodeFactor: 0.2,
    crossSectionMode: 'standard',
    refIds: ['westrate-voeltz-2015', 'khatter-2015', 'jensen-schekman-2011']
  },
  {
    stepNumber: 6,
    organelleId: 'golgi-apparatus',
    title: 'Polarized Sorting Hub: Golgi Apparatus & Transport Vesicles',
    narration:
      'Cargo exported from the ER arrives at the cis face of the Golgi apparatus. Across stacked cis, medial, and trans cisternae, proteins undergo sequential glycan remodeling before sorting at the trans-Golgi network into secretory vesicles or lysosomes, while COPI vesicles recycle ER residents.',
    explodeFactor: 0.25,
    crossSectionMode: 'standard',
    refIds: ['liu-2021', 'arakel-schwappach-2018']
  },
  {
    stepNumber: 7,
    organelleId: 'mitochondria',
    title: 'Bioenergetic Powerhouse: Mitochondria & Peroxisomes',
    narration:
      'Mitochondria enclose an inner membrane folded into cristae invaginations separated by narrow cristae junctions, concentrating the electron transport chain and F₁F₀-ATP synthase for oxidative phosphorylation. Nearby single-membrane peroxisomes perform VLCFA β-oxidation and detoxify H₂O₂ via catalase.',
    explodeFactor: 0.2,
    crossSectionMode: 'standard',
    refIds: ['caron-bertolin-2024', 'wanders-waterham-2006']
  },
  {
    stepNumber: 8,
    organelleId: 'centrosome',
    title: 'Mechanical & Transport Architecture: Centrosome & Cytoskeleton',
    narration:
      'Finally, cellular architecture and transport depend on three polymer systems: 25 nm microtubules nucleated at γ-TuRCs in the centrosome, the ~130 nm sub-membranous actin cortex generating surface tension, and 10 nm apolar intermediate filaments absorbing mechanical stress.',
    explodeFactor: 0,
    crossSectionMode: 'standard',
    refIds: [
      'conduit-2015',
      'muroyama-lechler-2017',
      'chugh-paluch-2018',
      'herrmann-2007'
    ]
  }
];

export const GLOSSARY_TERMS = [
  {
    term: 'Chromosome Territories (CTs)',
    organelleId: 'chromatin',
    definition:
      'Discrete, non-randomly positioned 3D subvolumes occupied by individual chromosomes within the interphase nucleus, bordered by an interchromatin compartment.',
    refId: 'cremer-cremer-2010'
  },
  {
    term: 'COPI & COPII Coat Complexes',
    organelleId: 'vesicles',
    definition:
      'Cytosolic protein coat machineries that sculpt transport vesicles: COPII (Sar1, Sec23/24, Sec13/31) drives anterograde ER-to-Golgi export, whereas COPI (Arf1 + heptameric coatomer) mediates retrograde Golgi-to-ER retrieval.',
    refId: 'jensen-schekman-2011'
  },
  {
    term: 'Cortical Actin Meshwork',
    organelleId: 'actin-filaments',
    definition:
      'A ~100–200 nm thick sub-membranous network of F-actin filaments nucleated by formins and the Arp2/3 complex and crosslinked with myosin-II motors to govern cell shape and cortical tension.',
    refId: 'chugh-paluch-2018'
  },
  {
    term: 'Cristae & Cristae Junctions',
    organelleId: 'mitochondria',
    definition:
      'Tubular or lamellar invaginations of the inner mitochondrial membrane housing oxidative phosphorylation complexes, connected to the inner boundary membrane via narrow neck-like cristae junctions.',
    refId: 'caron-bertolin-2024'
  },
  {
    term: 'Eukaryotic 80S Ribosome',
    organelleId: 'ribosomes',
    definition:
      'Ribonucleoprotein particle (~4.3 MDa in humans) formed by a 40S decoding subunit (18S rRNA) and a 60S peptidyl-transferase subunit (28S, 5.8S, 5S rRNAs).',
    refId: 'khatter-2015'
  },
  {
    term: 'Fluid-Mosaic & Lipid Rafts',
    organelleId: 'plasma-membrane',
    definition:
      'Membrane architecture in which amphipathic phospholipids form a fluid bilayer mosaic organized into lateral sphingolipid–cholesterol microdomains and actin-delimited corrals.',
    refId: 'simons-ikonen-1997'
  },
  {
    term: 'γ-Tubulin Ring Complex (γ-TuRC)',
    organelleId: 'centrosome',
    definition:
      'Cone-shaped multi-protein complex embedded in the pericentriolar material of the centrosome that templates and caps microtubule minus (−) ends.',
    refId: 'conduit-2015'
  },
  {
    term: 'Liquid–Liquid Phase Separation (LLPS)',
    organelleId: 'nucleolus',
    definition:
      'Biophysical demixing process by which multivalent RNA–protein interactions form membraneless biomolecular condensates such as the multiphase nucleolus.',
    refId: 'lafontaine-2021'
  },
  {
    term: 'Macromolecular Crowding',
    organelleId: 'cytoplasm',
    definition:
      'Excluded-volume effect in the cytosol caused by high total concentrations of proteins and RNAs (occupying ~20–30% of volume), altering diffusion and equilibrium constants.',
    refId: 'ellis-2001'
  },
  {
    term: 'Mannose-6-Phosphate (M6P) Pathway',
    organelleId: 'lysosomes',
    definition:
      'Sorting mechanism in the trans-Golgi network where newly synthesized acid hydrolases receive M6P tags recognized by M6P receptors for delivery to endolysosomes.',
    refId: 'saftig-klumperman-2009'
  },
  {
    term: 'Nuclear Pore Complex (NPC)',
    organelleId: 'nuclear-envelope',
    definition:
      'Eight-fold symmetric macromolecular channel built from multiples of ~32 nucleoporins spanning the nuclear envelope to regulate nucleocytoplasmic transport and chromatin organization.',
    refId: 'dangelo-2018'
  },
  {
    term: 'Reticulons & Atlastin GTPases',
    organelleId: 'smooth-er',
    definition:
      'Membrane-shaping proteins of the endoplasmic reticulum: wedge-like reticulon hairpins stabilize high tubule curvature while atlastin GTPases fuse tubules into three-way junctions.',
    refId: 'westrate-voeltz-2015'
  }
];

export const VERIFIED_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    organelleId: 'cytoplasm',
    question:
      'Approximately what percentage of the aqueous cytosolic volume is occupied by macromolecules, producing steric excluded-volume ("macromolecular crowding") effects?',
    options: [
      'Less than 1% (behaving as an ideal dilute buffer)',
      'Roughly 20–30% of total volume',
      'Over 85% crystalline solid phase',
      'Exactly 50% lipid bilayer micelles'
    ],
    correctIndex: 1,
    explanation:
      'Biophysical studies establish that macromolecules occupy roughly 20–30% of the intracellular aqueous volume, restricting diffusion and promoting protein association through excluded-volume effects.',
    refIds: ['ellis-2001', 'luby-phelps-2000']
  },
  {
    id: 'q2',
    organelleId: 'nucleolus',
    question:
      'How is the nucleolus structurally compartmentalized to drive ribosomal RNA transcription and pre-ribosome assembly without a bounding lipid bilayer?',
    options: [
      'By a double phospholipid membrane perforated by porins',
      'As a multiphase biomolecular condensate formed via liquid–liquid phase separation (LLPS)',
      'Inside a rigid icosahedral clathrin protein shell',
      'Within a crystalline urate oxidase octahedron'
    ],
    correctIndex: 1,
    explanation:
      'The nucleolus is a paradigmatic membraneless organelle organized via liquid–liquid phase separation into coaxial immiscible subphases (fibrillar center, dense fibrillar component, and granular component).',
    refIds: ['lafontaine-2021']
  },
  {
    id: 'q3',
    organelleId: 'smooth-er',
    question:
      'Which protein families generate high membrane curvature and catalyze homotypic three-way tubular junctions in the smooth endoplasmic reticulum?',
    options: [
      'Reticulons/REEP hairpin proteins and atlastin dynamin-like GTPases',
      'Clathrin triskelions and LAMP1 glycoproteins',
      'Histone octamers and nuclear lamins',
      'Kinesin-1 and cytoplasmic dynein motors'
    ],
    correctIndex: 0,
    explanation:
      'Wedge-like transmembrane hairpins of reticulon and REEP/DP1 proteins stabilize high cylinder curvature in ER tubules, while atlastin GTPases tether and fuse tubules into polygonal networks.',
    refIds: ['westrate-voeltz-2015']
  },
  {
    id: 'q4',
    organelleId: 'vesicles',
    question:
      'How are anterograde ER-to-Golgi export and retrograde Golgi-to-ER retrieval partitioned between coated transport vesicles?',
    options: [
      'COPI mediates anterograde export; clathrin mediates ER import',
      'COPII coats mediate anterograde ER export, whereas COPI coats mediate retrograde Golgi-to-ER retrieval',
      'Both directions rely exclusively on uncoated peroxisomal buds',
      'Mannose-6-phosphate coats bud directly from the inner nuclear membrane'
    ],
    correctIndex: 1,
    explanation:
      'Sar1 and Sec23/24/Sec13/31 assemble COPII coats at ER exit sites for anterograde transport to the Golgi, while Arf1 and heptameric coatomer form COPI vesicles to retrieve escaped ER-resident proteins (such as KDEL chaperones) from the Golgi.',
    refIds: ['jensen-schekman-2011', 'arakel-schwappach-2018']
  },
  {
    id: 'q5',
    organelleId: 'peroxisomes',
    question:
      'Why is the dense crystalloid core shown inside many schematic mammalian peroxisomes considered a species- and context-dependent feature?',
    options: [
      'It only forms during metaphase chromosome condensation',
      'Rodent hepatic peroxisomes contain a crystalloid urate oxidase core, whereas human peroxisomes lack active urate oxidase and are typically acrystalloid',
      'It represents 55S mitoribosomes translated from peroxisomal DNA',
      'It is composed of polymerized α/β-tubulin protofilaments'
    ],
    correctIndex: 1,
    explanation:
      'Peroxisomes lack DNA and ribosomes; while many non-human mammalian liver peroxisomes display a para-crystalline urate oxidase core, human peroxisomes lack active urate oxidase.',
    refIds: ['wanders-waterham-2006']
  },
  {
    id: 'q6',
    organelleId: 'intermediate-filaments',
    question:
      'Which structural and tissue-expression property distinguishes cytoplasmic intermediate filaments (~10 nm) from microtubules (~25 nm) and actin filaments (~7 nm)?',
    options: [
      'Intermediate filaments are apolar coiled-coil polymers encoded by ~65–70 cell-type-specific genes that provide tensile nanomechanical resilience',
      'Intermediate filaments are hollow 13-protofilament cylinders with fast-growing plus ends',
      'Intermediate filaments hydrolyze ATP via rotary F₁ catalytic crowns',
      'Intermediate filaments are restricted exclusively to plant cell walls'
    ],
    correctIndex: 0,
    explanation:
      'Intermediate filaments assemble from staggered α-helical coiled-coil dimers into apolar 10 nm ropes lacking plus/minus polarity and exhibit strict lineage-specific expression (e.g., keratins in epithelia, vimentin in mesenchyme, neurofilaments in neurons).',
    refIds: ['herrmann-2007']
  }
];

export const SCIENTIFIC_LIMITATIONS_POINTS = [
  {
    title: '1. Generalized Schematic vs. Cell-Type Specificity',
    detail:
      'No single "universal" animal cell exists in vivo. CellScope 3D synthesizes canonical eukaryotic organelles into one composite reference cell. In living tissues, organelle abundance and organization vary dramatically by lineage (e.g., expanded Rough ER in pancreatic acinar cells, non-centrosomal microtubule arrays in differentiated epithelia, or absence of nuclei in mature mammalian erythrocytes).'
  },
  {
    title: '2. Ultrastructural Scale & Copy-Number Compression',
    detail:
      'To maintain real-time 3D legibility without visual occlusion, sub-resolution structures (such as the ~5–10 nm plasma membrane bilayer, ~25–30 nm 80S ribosomes, and 7–25 nm cytoskeletal filaments) are thickened relative to the ~20 µm cell envelope, and high-copy organelles (millions of ribosomes, hundreds of mitochondria, thousands of nuclear pores) are represented by curated sample counts.'
  },
  {
    title: '3. Static Geometry vs. Stochastic In Vivo Dynamics',
    detail:
      'Living organelles undergo continuous remodeling—mitochondria fuse and divide as a dynamic network, ER tubules slide along microtubules, vesicles bud and uncoat transiently, and the nucleolus behaves as a multiphase liquid condensate rather than a rigid solid.'
  },
  {
    title: '4. Cutaway Planes & Multi-Scale Discontinuity',
    detail:
      'Cross-section modes (Boundary Peel and Planar Clipping) and Exploded View trajectories are geometric inspection tools rather than physical histological sections. Similarly, stepping to Molecular Complex (10⁻⁸ m) and Molecule (10⁻⁹ m) transitions to an isolated nanometer stage with verified RCSB PDB references rather than claiming continuous atomic coordinates across the whole-cell mesh.'
  },
  {
    title: '5. Scope of Literature Verification',
    detail:
      'Every peer-reviewed reference in this atlas has been verified via DOI/PubMed to support the specific biological claims stated in its annotation. Citations validate those biological mechanisms and ultrastructural descriptions, not the artistic 3D mesh approximations.'
  }
];