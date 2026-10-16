export const SCALE_LEVELS = [
  {
    id: 'whole-cell',
    step: 1,
    label: 'Whole Cell',
    typicalRange: '10 – 30 µm',
    scaleBarLabel: '5 µm',
    orderOfMagnitude: '10⁻⁵ m',
    representationType: 'Actual Project 3D Cell Model',
    isSchematicMolecular: false,
    transitionNote:
      'Viewing the complete generalized eukaryotic animal cell model (~20 µm nominal diameter).'
  },
  {
    id: 'organelle',
    step: 2,
    label: 'Organelle',
    typicalRange: '0.1 – 6 µm',
    scaleBarLabel: '1 µm',
    orderOfMagnitude: '10⁻⁶ m',
    representationType: 'Actual Project 3D Organelle Mesh',
    isSchematicMolecular: false,
    transitionNote:
      'Focused on the selected organelle mesh within the 3D cellular architecture.'
  },
  {
    id: 'molecular-complex',
    step: 3,
    label: 'Molecular Complex',
    typicalRange: '10 – 120 nm',
    scaleBarLabel: '10 nm',
    orderOfMagnitude: '10⁻⁸ m',
    representationType: 'Isolated Schematic Proxy + Verified PDB Reference',
    isSchematicMolecular: true,
    transitionNote:
      'Scale Discontinuity Note: This view transitions from the micron-scale cell mesh to an isolated nanometer-scale inspection stage. Geometry is a labeled schematic proxy (with optional RCSB PDB Cα trace), not a continuous zoom of the whole-cell mesh.'
  },
  {
    id: 'molecule',
    step: 4,
    label: 'Molecule',
    typicalRange: '0.5 – 8 nm',
    scaleBarLabel: '1 nm',
    orderOfMagnitude: '10⁻⁹ m',
    representationType: 'Isolated Monomer Proxy + Verified PDB Reference',
    isSchematicMolecular: true,
    transitionNote:
      'Scale Discontinuity Note: Sub-nanometer/monomeric building blocks are shown on an isolated schematic stage rather than fabricated atomic coordinates inside the whole-cell model.'
  }
];

export const SCALE_LEVEL_MAP = new Map(
  SCALE_LEVELS.map((lvl) => [lvl.id, lvl])
);

export const ORGANELLE_MOLECULAR_DATA = {
  'plasma-membrane': {
    complex: {
      name: 'Na⁺/K⁺-ATPase Ion Pump in Phospholipid Bilayer',
      size: '~7 × 12 nm transmembrane complex',
      shapeType: 'membrane-pump',
      summary:
        'Heterotrimeric P-type ATPase embedded in the asymmetric plasma membrane bilayer that pumps 3 Na⁺ ions out and 2 K⁺ ions in per ATP hydrolyzed.',
      pdbId: '2ZXE',
      pdbTitle:
        'Crystal structure of the sodium-potassium pump in the E2.2K+.Pi state (2.4 Å)',
      pdbUrl: 'https://www.rcsb.org/structure/2ZXE',
      pdbDoi: 'https://doi.org/10.2210/pdb2ZXE/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Phosphatidylcholine & Cholesterol Leaflet Pair',
      size: '~2.5 – 3.5 nm lipid length',
      shapeType: 'lipid-pair',
      summary:
        'Amphipathic glycerophospholipid with polar choline headgroup and acyl chains paired with a rigid sterol ring system that modulates membrane fluidity.',
      pdbId: '2ZXE',
      pdbTitle:
        'Co-crystallized cholesterol and phospholipid ligands in Na⁺/K⁺-ATPase (PDB 2ZXE)',
      pdbUrl: 'https://www.rcsb.org/structure/2ZXE',
      pdbDoi: 'https://doi.org/10.2210/pdb2ZXE/pdb',
      supportsLiveTrace: true
    }
  },
  cytoplasm: {
    complex: {
      name: 'Human GAPDH Glycolytic Homotetramer (O-P-Q-R Assembly)',
      size: '~9 × 9 × 8 nm homotetramer (~146 kDa)',
      shapeType: 'globular-tetramer',
      summary:
        'Abundant cytosolic glycolytic enzyme tetramer (glyceraldehyde-3-phosphate dehydrogenase) operating within the macromolecularly crowded aqueous matrix.',
      pdbId: '1U8F',
      pdbTitle:
        'Crystal structure of human GAPDH tetramer complexed with NAD⁺ (1.75 Å)',
      pdbUrl: 'https://www.rcsb.org/structure/1U8F',
      pdbDoi: 'https://doi.org/10.2210/pdb1U8F/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'GAPDH Rossmann-Fold Monomer with Bound NAD⁺ Cofactor',
      size: '~4.5 nm monomer (335 residues, ~36 kDa)',
      shapeType: 'nucleotide-monomer',
      summary:
        'Single GAPDH catalytic subunit containing an N-terminal NAD⁺-binding Rossmann fold and a C-terminal glyceraldehyde-3-phosphate catalytic domain (active-site Cys152).',
      pdbId: '1U8F',
      pdbTitle: 'Human GAPDH subunit and bound NAD⁺ cofactor (PDB 1U8F)',
      pdbUrl: 'https://www.rcsb.org/structure/1U8F',
      pdbDoi: 'https://doi.org/10.2210/pdb1U8F/pdb',
      supportsLiveTrace: true
    }
  },
  nucleus: {
    complex: {
      name: 'Nucleosome Core Particle (Chromatin Repeat Unit)',
      size: '~11 nm diameter × 5.5 nm height (184.5 kDa)',
      shapeType: 'nucleosome',
      summary:
        '146 base pairs of duplex DNA wrapped 1.65 turns in a left-handed superhelix around a central histone octamer (two copies each of H2A, H2B, H3, and H4).',
      pdbId: '1AOI',
      pdbTitle:
        'Complex between nucleosome core particle (H3,H4,H2A,H2B) and 146 bp DNA fragment (2.8 Å)',
      pdbUrl: 'https://www.rcsb.org/structure/1AOI',
      pdbDoi: 'https://doi.org/10.2210/pdb1AOI/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'B-Form DNA Duplex & Histone-Fold Heterodimer',
      size: '~2.0 nm DNA helix diameter; 0.34 nm/bp rise',
      shapeType: 'dna-helix',
      summary:
        'Antiparallel right-handed double helix of deoxyribonucleotides complexed with positively charged α-helical histone-fold dimers.',
      pdbId: '1AOI',
      pdbTitle: 'Nucleosomal DNA superhelix and histone chains (PDB 1AOI)',
      pdbUrl: 'https://www.rcsb.org/structure/1AOI',
      pdbDoi: 'https://doi.org/10.2210/pdb1AOI/pdb',
      supportsLiveTrace: true
    }
  },
  'nuclear-envelope': {
    complex: {
      name: 'Human Nuclear Pore Complex (NPC)',
      size: '~120 nm outer diameter (~110 – 120 MDa)',
      shapeType: 'npc-ring',
      summary:
        'Eight-fold rotationally symmetric macromolecular assembly of ~32 nucleoporins forming cytoplasmic, inner, and nuclear rings around a central FG-repeat transport channel.',
      pdbId: '7R5K',
      pdbTitle:
        'Composite cryo-EM structure of the human Nuclear Pore Complex in constricted state',
      pdbUrl: 'https://www.rcsb.org/structure/7R5K',
      pdbDoi: 'https://doi.org/10.2210/pdb7R5K/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Nucleoporin Nup155 Scaffold Subunit',
      size: '~155 kDa α-solenoid / β-propeller protein',
      shapeType: 'protein-subunit',
      summary:
        'Core structural nucleoporin containing an N-terminal β-propeller and C-terminal α-helical solenoid domain that anchors the inner ring to the nuclear pore membrane.',
      pdbId: '7R5K',
      pdbTitle: 'Nucleoporin Nup155 within Human Nuclear Pore Complex (PDB 7R5K)',
      pdbUrl: 'https://www.rcsb.org/structure/7R5K',
      pdbDoi: 'https://doi.org/10.2210/pdb7R5K/pdb',
      supportsLiveTrace: false
    }
  },
  nucleolus: {
    complex: {
      name: 'Pre-Ribosomal 90S / Nascent Ribosomal Subunit Assembly',
      size: '~30 – 35 nm ribonucleoprotein particle',
      shapeType: 'ribosome-80s',
      summary:
        'Nascent pre-rRNA transcript co-transcriptionally assembled with snoRNPs and ribosomal proteins inside the multiphase nucleolar condensate prior to export.',
      pdbId: '4UG0',
      pdbTitle: 'Structure of the mature human 80S ribosome product (3.6 Å)',
      pdbUrl: 'https://www.rcsb.org/structure/4UG0',
      pdbDoi: 'https://doi.org/10.2210/pdb4UG0/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Ribosomal RNA (rRNA) Hairpin Stem-Loop Domain',
      size: '~2.5 – 4 nm RNA stem-loop motif',
      shapeType: 'dna-helix',
      summary:
        'Folded ribosomal RNA secondary structure undergoing 2′-O-methylation and pseudouridylation within the dense fibrillar component of the nucleolus.',
      pdbId: '4UG0',
      pdbTitle: 'Human ribosomal RNA chains (18S, 28S, 5.8S, 5S) in PDB 4UG0',
      pdbUrl: 'https://www.rcsb.org/structure/4UG0',
      pdbDoi: 'https://doi.org/10.2210/pdb4UG0/pdb',
      supportsLiveTrace: false
    }
  },
  chromatin: {
    complex: {
      name: 'Nucleosome Core Particle Array (11 nm "Beads-on-a-String")',
      size: '~11 nm core diameter (184.5 kDa per nucleosome)',
      shapeType: 'nucleosome',
      summary:
        'Fundamental repeating unit of eukaryotic chromatin comprising 146 bp of DNA wrapped 1.65 times around the H2A/H2B/H3/H4 histone octamer.',
      pdbId: '1AOI',
      pdbTitle:
        'Crystal structure of the nucleosome core particle at 2.8 Å resolution (Luger et al., 1997)',
      pdbUrl: 'https://www.rcsb.org/structure/1AOI',
      pdbDoi: 'https://doi.org/10.2210/pdb1AOI/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Histone H3/H4 Heterodimer & 146 bp Duplex DNA',
      size: '~4.5 nm histone-fold handshake motif',
      shapeType: 'dna-helix',
      summary:
        'Central tetrameric H3/H4 histone-fold scaffold and N-terminal epigenetic tail domains that bind the minor groove of superhelical DNA.',
      pdbId: '1AOI',
      pdbTitle: 'Histone H3/H4 chains and superhelical DNA in PDB 1AOI',
      pdbUrl: 'https://www.rcsb.org/structure/1AOI',
      pdbDoi: 'https://doi.org/10.2210/pdb1AOI/pdb',
      supportsLiveTrace: true
    }
  },
  'rough-er': {
    complex: {
      name: '80S Ribosome–Sec61 Translocon–OST Co-Translational Complex',
      size: '~32 nm holocomplex (~2.29 MDa)',
      shapeType: 'sec61-translocon',
      summary:
        'Programmed 80S ribosome docked onto the ER-membrane Sec61 protein-conducting channel and oligosaccharyltransferase (OST) for coupled translation, translocation, and N-glycosylation.',
      pdbId: '6FTI',
      pdbTitle:
        'Cryo-EM structure of mammalian oligosaccharyltransferase bound to Sec61 and 80S ribosome (4.2 Å)',
      pdbUrl: 'https://www.rcsb.org/structure/6FTI',
      pdbDoi: 'https://doi.org/10.2210/pdb6FTI/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Sec61α Hourglass Transmembrane Channel Subunit',
      size: '~5 × 6 nm 10-helix transmembrane bundle',
      shapeType: 'membrane-pump',
      summary:
        'Ten-transmembrane-helix core subunit forming an aqueous hourglass pore with a central hydrophobic pore ring and a lateral gate that opens toward the lipid bilayer.',
      pdbId: '6FTI',
      pdbTitle: 'Mammalian Sec61 channel complex in PDB 6FTI',
      pdbUrl: 'https://www.rcsb.org/structure/6FTI',
      pdbDoi: 'https://doi.org/10.2210/pdb6FTI/pdb',
      supportsLiveTrace: false
    }
  },
  'smooth-er': {
    complex: {
      name: 'Human Atlastin-1 Dynamin-Like ER-Fusion GTPase Assembly',
      size: '~11 × 9 nm homodimer (~207 kDa crystal unit)',
      shapeType: 'membrane-pump',
      summary:
        'Dynamin-superfamily large GTPase anchored in smooth ER tubules that dimerizes across opposing membranes in a GTP-dependent cycle to catalyze homotypic three-way tubular junctions.',
      pdbId: '3Q5E',
      pdbTitle:
        'Crystal structure of human Atlastin-1 (residues 1-447) bound to GDP at 3.01 Å (Byrnes & Sondermann, 2011)',
      pdbUrl: 'https://www.rcsb.org/structure/3Q5E',
      pdbDoi: 'https://doi.org/10.2210/pdb3Q5E/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Atlastin-1 Cytosolic GTPase & Three-Helix Bundle Monomer (Bound GDP·Mg²⁺)',
      size: '~6.5 nm monomer (residues 1–447, ~52 kDa)',
      shapeType: 'protein-subunit',
      summary:
        'Monomeric human Atlastin-1 cytosolic domain comprising an N-terminal GTPase head connected via a flexible linker to a middle three-helix bundle (3HB) with bound GDP and Mg²⁺.',
      pdbId: '3Q5E',
      pdbTitle:
        'Human Atlastin-1 monomer with bound GDP and Mg²⁺ (PDB 3Q5E)',
      pdbUrl: 'https://www.rcsb.org/structure/3Q5E',
      pdbDoi: 'https://doi.org/10.2210/pdb3Q5E/pdb',
      supportsLiveTrace: true
    }
  },
  ribosomes: {
    complex: {
      name: 'Human 80S Ribosome (40S + 60S Subunits)',
      size: '~28 – 30 nm diameter (~3.84 – 4.3 MDa, 81 chains)',
      shapeType: 'ribosome-80s',
      summary:
        'Complete human cytoplasmic 80S ribonucleoprotein machine comprising the 40S decoding subunit (18S rRNA + 33 proteins) and 60S catalytic subunit (28S, 5.8S, 5S rRNAs + 47 proteins).',
      pdbId: '4UG0',
      pdbTitle:
        'Structure of the human 80S ribosome by single-particle cryo-EM at 3.60 Å (Khatter et al., 2015)',
      pdbUrl: 'https://www.rcsb.org/structure/4UG0',
      pdbDoi: 'https://doi.org/10.2210/pdb4UG0/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Aminoacyl-tRNA L-Shaped Cloverleaf & Nascent Polypeptide',
      size: '~7.5 nm L-shaped tRNA (~25 kDa)',
      shapeType: 'dna-helix',
      summary:
        'Transfer RNA adaptor molecule presenting a 3-nucleotide anticodon at one end and an esterified amino acid at the 3′-CCA acceptor stem.',
      pdbId: '4UG0',
      pdbTitle: 'Ribosomal RNA and tRNA binding sites in Human 80S Ribosome (PDB 4UG0)',
      pdbUrl: 'https://www.rcsb.org/structure/4UG0',
      pdbDoi: 'https://doi.org/10.2210/pdb4UG0/pdb',
      supportsLiveTrace: false
    }
  },
  'golgi-apparatus': {
    complex: {
      name: 'Complete COPI Coatomer Coat Triad on Golgi Membrane',
      size: '~22 – 28 nm triad linkage (~1.8 MDa)',
      shapeType: 'clathrin-cage',
      summary:
        'Three heptameric COPI coatomer complexes (α, β, β′, γ, δ, ε, ζ subunits) recruited by GTP-bound Arf1 to assemble flexible triads that sculpt retrograde Golgi transport vesicles.',
      pdbId: '5A1U',
      pdbTitle:
        'Cryo-EM/tomography structure of the complete COPI coat triad (Dodonova et al., 2015)',
      pdbUrl: 'https://www.rcsb.org/structure/5A1U',
      pdbDoi: 'https://doi.org/10.2210/pdb5A1U/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Arf1 Small GTPase & COPI Coatomer Cage Subunit',
      size: '~3.5 nm Arf1 GTPase (~20 kDa) + α/β′-COP β-propeller',
      shapeType: 'protein-subunit',
      summary:
        'Myristoylated Arf1 switch protein that inserts into Golgi cisternal membranes upon GTP binding to anchor the arch-like α/β′-COP and adaptor subunits.',
      pdbId: '5A1U',
      pdbTitle: 'Arf1 and COPI coatomer subunits in the COPI triad (PDB 5A1U)',
      pdbUrl: 'https://www.rcsb.org/structure/5A1U',
      pdbDoi: 'https://doi.org/10.2210/pdb5A1U/pdb',
      supportsLiveTrace: false
    }
  },
  mitochondria: {
    complex: {
      name: 'Mitochondrial F₁F₀-ATP Synthase Rotary Motor',
      size: '~11 × 21 nm (~519 kDa, 22 subunit chains)',
      shapeType: 'atp-synthase',
      summary:
        'Membrane-embedded rotary nanomachine along cristae ridges; proton translocation through the Fo c8-ring drives rotation of the central γ/δ/ε stalk to synthesize ATP in the catalytic α₃β₃ F₁ head.',
      pdbId: '5ARA',
      pdbTitle:
        'Bovine mitochondrial ATP synthase state 1a by cryo-EM (7.4 Å, Zhou et al., 2015)',
      pdbUrl: 'https://www.rcsb.org/structure/5ARA',
      pdbDoi: 'https://doi.org/10.2210/pdb5ARA/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Adenosine Triphosphate (ATP) & F₁ Catalytic β-Subunit',
      size: '~1.4 nm ATP molecule / ~52 kDa β-subunit',
      shapeType: 'nucleotide-monomer',
      summary:
        'ATP molecule synthesized from ADP and inorganic phosphate (Pi) via conformational transitions (open, loose, tight) of the F₁ β-subunit catalytic cleft.',
      pdbId: '5ARA',
      pdbTitle: 'Mitochondrial ATP synthase α/β catalytic subunits (PDB 5ARA)',
      pdbUrl: 'https://www.rcsb.org/structure/5ARA',
      pdbDoi: 'https://doi.org/10.2210/pdb5ARA/pdb',
      supportsLiveTrace: false
    }
  },
  lysosomes: {
    complex: {
      name: 'Human Vacuolar H⁺-ATPase (V-ATPase) Proton Pump',
      size: '~14 × 26 nm (~1.28 MDa, 35 subunit chains)',
      shapeType: 'atp-synthase',
      summary:
        'ATP-driven rotary proton pump (cytosolic V₁ catalytic hexamer coupled to the membrane-embedded V₀ proteolipid c-ring) that acidifies the lysosomal lumen to pH ~4.5–5.0.',
      pdbId: '6WM2',
      pdbTitle:
        'Human V-ATPase in state 1 with SidK and ADP by cryo-EM at 3.10 Å (Wang et al., 2020)',
      pdbUrl: 'https://www.rcsb.org/structure/6WM2',
      pdbDoi: 'https://doi.org/10.2210/pdb6WM2/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Acid Hydrolase Monomer & Glycosylated V₀ Luminal Subunit',
      size: '~4 – 6 nm luminal glycoprotein domain',
      shapeType: 'protein-subunit',
      summary:
        'Mannose-6-phosphate-targeted lysosomal acid hydrolase operating at low pH alongside heavily glycosylated membrane subunits that shield the limiting bilayer.',
      pdbId: '6WM2',
      pdbTitle: 'Glycosylated luminal subunits of Human V-ATPase (PDB 6WM2)',
      pdbUrl: 'https://www.rcsb.org/structure/6WM2',
      pdbDoi: 'https://doi.org/10.2210/pdb6WM2/pdb',
      supportsLiveTrace: false
    }
  },
  vesicles: {
    complex: {
      name: 'Clathrin Hexagonal/Pentagonal Coat Cage (36 Triskelia)',
      size: '~60 – 70 nm polyhedral cage (~6.5 MDa)',
      shapeType: 'clathrin-cage',
      summary:
        'Self-assembling polyhedral protein lattice built from 36 three-legged clathrin triskelions that sculpts coated transport vesicles from the TGN and plasma membrane.',
      pdbId: '1XI4',
      pdbTitle:
        'Cryo-EM molecular model of a complete D6 clathrin coat barrel (Fotin et al., 2004)',
      pdbUrl: 'https://www.rcsb.org/structure/1XI4',
      pdbDoi: 'https://doi.org/10.2210/pdb1XI4/pdb',
      supportsLiveTrace: false
    },
    molecule: {
      name: 'Clathrin Triskelion Heavy & Light Chain Protomer',
      size: '~47 nm leg span (~190 kDa heavy chain + ~25 kDa light chain)',
      shapeType: 'triskelion',
      summary:
        'Three-legged pinwheel protomer composed of three clathrin heavy chains trimerized at their C-terminal vertex and paired with regulatory light chains.',
      pdbId: '1XI4',
      pdbTitle: 'Clathrin heavy and light chain triskelion legs in PDB 1XI4',
      pdbUrl: 'https://www.rcsb.org/structure/1XI4',
      pdbDoi: 'https://doi.org/10.2210/pdb1XI4/pdb',
      supportsLiveTrace: false
    }
  },
  peroxisomes: {
    complex: {
      name: 'Tetrameric Human Catalase Holoenzyme',
      size: '~10 × 10 × 8 nm homotetramer (~240 kDa)',
      shapeType: 'globular-tetramer',
      summary:
        'Dumbbell-shaped homotetrameric antioxidant enzyme in the peroxisomal matrix that decomposes two molecules of toxic H₂O₂ into 2 H₂O + O₂ at near-diffusion-limited rates.',
      pdbId: '1DGF',
      pdbTitle:
        'Human erythrocyte catalase X-ray crystal structure at 1.50 Å resolution (Putnam et al., 2000)',
      pdbUrl: 'https://www.rcsb.org/structure/1DGF',
      pdbDoi: 'https://doi.org/10.2210/pdb1DGF/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Iron-Protoporphyrin IX (Heme b) & Bound NADPH Cofactor',
      size: '~1.2 nm porphyrin macrocycle',
      shapeType: 'nucleotide-monomer',
      summary:
        'Deeply buried ferric heme prosthetic group (protoporphyrin IX containing Fe³⁺) coordinated by a proximal tyrosine residue at the catalytic center of each catalase subunit.',
      pdbId: '1DGF',
      pdbTitle:
        'Protoporphyrin IX containing Fe and NADPH ligands in Human Catalase (PDB 1DGF)',
      pdbUrl: 'https://www.rcsb.org/structure/1DGF',
      pdbDoi: 'https://doi.org/10.2210/pdb1DGF/pdb',
      supportsLiveTrace: true
    }
  },
  centrosome: {
    complex: {
      name: 'γ-Tubulin Ring Complex (γ-TuRC) & Triplet Microtubule Blade',
      size: '~25 – 32 nm lock-washer ring (~2.2 MDa)',
      shapeType: 'tubulin-lattice',
      summary:
        'Cone-shaped 14-spoke γ-tubulin ring complex in the pericentriolar material that templates 13-protofilament microtubule nucleation above the 9-fold centriole triplet blades.',
      pdbId: '1JFF',
      pdbTitle:
        'Refined structure of α/β-tubulin heterodimer at 3.5 Å resolution (Lowe et al., 2001)',
      pdbUrl: 'https://www.rcsb.org/structure/1JFF',
      pdbDoi: 'https://doi.org/10.2210/pdb1JFF/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'α/β-Tubulin Heterodimer with Bound GTP/GDP',
      size: '~8 nm length × 4.5 nm width (~102 kDa)',
      shapeType: 'tubulin-dimer',
      summary:
        'Head-to-tail heterodimer of α-tubulin (bound to non-exchangeable GTP) and β-tubulin (bound to exchangeable GTP/GDP at the E-site).',
      pdbId: '1JFF',
      pdbTitle: 'Bovine α/β-tubulin heterodimer bound to GTP and GDP (PDB 1JFF)',
      pdbUrl: 'https://www.rcsb.org/structure/1JFF',
      pdbDoi: 'https://doi.org/10.2210/pdb1JFF/pdb',
      supportsLiveTrace: true
    }
  },
  microtubules: {
    complex: {
      name: '13-Protofilament Hollow Microtubule Lattice Segment',
      size: '~25 nm outer diameter; ~15 nm lumen',
      shapeType: 'tubulin-lattice',
      summary:
        'Cylindrical wall assembled from 13 laterally associated protofilaments of head-to-tail α/β-tubulin dimers with a B-lattice helical seam.',
      pdbId: '1JFF',
      pdbTitle:
        'Refined structure of α/β-tubulin from protofilament sheets at 3.50 Å (Lowe et al., 2001)',
      pdbUrl: 'https://www.rcsb.org/structure/1JFF',
      pdbDoi: 'https://doi.org/10.2210/pdb1JFF/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'α/β-Tubulin Heterodimer (101.9 kDa, 6,702 Atoms)',
      size: '~8 × 4.5 × 4.5 nm heterodimer',
      shapeType: 'tubulin-dimer',
      summary:
        'Fundamental 102 kDa building block of microtubules consisting of one α-tubulin and one β-tubulin polypeptide chain.',
      pdbId: '1JFF',
      pdbTitle: 'α/β-Tubulin heterodimer atomic coordinates (PDB 1JFF)',
      pdbUrl: 'https://www.rcsb.org/structure/1JFF',
      pdbDoi: 'https://doi.org/10.2210/pdb1JFF/pdb',
      supportsLiveTrace: true
    }
  },
  'actin-filaments': {
    complex: {
      name: 'Double-Stranded Helical F-Actin Microfilament Segment',
      size: '~7 nm diameter; 37 nm helical half-pitch',
      shapeType: 'actin-helix',
      summary:
        'Polarized two-start right-handed helical polymer of actin protomers with a fast-growing barbed (+) end and a slow-growing pointed (−) end.',
      pdbId: '1ATN',
      pdbTitle:
        'Atomic structure of the actin:DNase I complex at 2.8 Å (Kabsch et al., 1990)',
      pdbUrl: 'https://www.rcsb.org/structure/1ATN',
      pdbDoi: 'https://doi.org/10.2210/pdb1ATN/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Globular Actin (G-Actin) Monomer with Bound ATP & Ca²⁺',
      size: '~5.5 × 5.5 × 3.5 nm (42 kDa, 4 Subdomains)',
      shapeType: 'protein-subunit',
      summary:
        'Monomeric G-actin folded into four subdomains (SD1–SD4) flanking a central nucleotide-binding cleft that coordinates ATP/ADP and a divalent cation (Mg²⁺ or Ca²⁺).',
      pdbId: '1ATN',
      pdbTitle: 'G-Actin monomer bound to ATP and Ca²⁺ (PDB 1ATN)',
      pdbUrl: 'https://www.rcsb.org/structure/1ATN',
      pdbDoi: 'https://doi.org/10.2210/pdb1ATN/pdb',
      supportsLiveTrace: true
    }
  },
  'intermediate-filaments': {
    complex: {
      name: 'Staggered Antiparallel Vimentin Tetramer & 10 nm Unit Filament',
      size: '~10 nm filament diameter; ~60 nm unit-length filament',
      shapeType: 'coiled-coil',
      summary:
        'Apolar rope-like assembly formed by lateral association of staggered antiparallel coiled-coil tetramers lacking intrinsic plus/minus polarity.',
      pdbId: '1GK4',
      pdbTitle:
        'Human vimentin coil 2B fragment X-ray crystal structure at 2.30 Å (Strelkov et al., 2002)',
      pdbUrl: 'https://www.rcsb.org/structure/1GK4',
      pdbDoi: 'https://doi.org/10.2210/pdb1GK4/pdb',
      supportsLiveTrace: true
    },
    molecule: {
      name: 'Vimentin α-Helical Coiled-Coil Dimer (Segment 2B)',
      size: '~13 nm fragment length (~59.6 kDa dimer, 4,169 atoms)',
      shapeType: 'coiled-coil',
      summary:
        'Parallel two-stranded α-helical coiled-coil dimer driven by heptad-repeat hydrophobic seams—the elementary building block of intermediate filaments.',
      pdbId: '1GK4',
      pdbTitle: 'Human vimentin coil 2B homodimer at 2.30 Å (PDB 1GK4)',
      pdbUrl: 'https://www.rcsb.org/structure/1GK4',
      pdbDoi: 'https://doi.org/10.2210/pdb1GK4/pdb',
      supportsLiveTrace: true
    }
  }
};