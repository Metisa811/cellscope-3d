export const SCIENTIFIC_DISCLAIMER =
  'Scientific Scope & Limitations: CellScope 3D depicts a generalized schematic eukaryotic animal cell. Established ultrastructural and biochemical facts are distinguished below from cell-type-dependent biology and 3D visual simplifications. Literature citations verify the specific biological claims stated under each reference; they do not certify exact 3D mesh dimensions or copy numbers.';

export const ORGANELLES = [
  {
    id: 'plasma-membrane',
    name: 'Plasma Membrane',
    scientificName: 'Plasmalemma (Cell Membrane)',
    synonyms: ['Plasmalemma', 'Cell membrane', 'Cytoplasmic membrane'],
    ontologyId: 'GO:0005886 / SL-0039',
    category: 'Cell Surface & Cytosol',
    color: '#38bdf8',
    summary:
      'Asymmetric phospholipid bilayer boundary regulating transport, signaling, and cell adhesion.',
    overview:
      'The plasma membrane is the selectively permeable outer boundary of animal cells, composed of an amphipathic lipid bilayer embedded with integral and peripheral proteins, cholesterol, and surface glycoconjugates.',
    structure:
      'Organized as a fluid-mosaic phospholipid bilayer (~5–10 nm thick including protein ensembles) exhibiting trans-bilayer lipid asymmetry (sphingolipids and phosphatidylcholine enriched on the exoplasmic leaflet; phosphatidylserine and phosphatidylethanolamine on the cytosolic leaflet) and dynamic cholesterol–sphingolipid microdomains (lipid rafts).',
    function:
      'Maintains electrochemical gradients via ion pumps and channels, mediates active and passive solute transport, transduces extracellular signals through transmembrane receptors, and anchors cell–cell and cell–matrix junctions.',
    interactions:
      'Mechanically coupled to the underlying cortical actin cytoskeleton via linker proteins (producing membrane corrals), tethered to cortical ER at membrane contact sites, and continuously remodeled via exocytic and endocytic vesicles.',
    contextDependency:
      'In polarized epithelial or neuronal cells, the plasma membrane is segregated into distinct apical/basolateral or axonal/somatodendritic domains with specialized lipid and protein compositions.',
    visualSimplification:
      'Rendered as a 3/4 cutaway shell with exaggerated bilayer rim thickness so the boundary remains legible at whole-cell scale.',
    references: [
      {
        refId: 'singer-nicolson-1972',
        claimSupported:
          'Establishes the foundational thermodynamic fluid-mosaic model of integral globular proteins embedded within a fluid phospholipid bilayer.'
      },
      {
        refId: 'simons-ikonen-1997',
        claimSupported:
          'Demonstrates lateral sphingolipid–cholesterol microdomains (lipid rafts) that serve as sorting and signal-transduction platforms within cell membranes.'
      },
      {
        refId: 'nicolson-2014',
        claimSupported:
          'Documents how cortical cytoskeletal corrals, extracellular matrix attachments, and crowded protein-lipid mosaics restrain lateral diffusion in modern membrane models.'
      }
    ]
  },
  {
    id: 'cytoplasm',
    name: 'Cytoplasm (Cytosol)',
    scientificName: 'Cytosol / Intracellular Aqueous Matrix',
    synonyms: ['Cytosolic matrix', 'Hyaloplasm', 'Intracellular fluid'],
    ontologyId: 'GO:0005829 / SL-0086',
    category: 'Cell Surface & Cytosol',
    color: '#bae6fd',
    summary:
      'Macromolecularly crowded aqueous phase housing metabolic pathways and suspending subcellular organelles.',
    overview:
      'While "cytoplasm" broadly denotes the cell interior outside the nucleus, the cytosol specifically refers to the aqueous phase surrounding membrane-bound organelles and cytoskeletal networks.',
    structure:
      'Rather than a dilute buffer, the cytosol is a viscoelastic, macromolecularly crowded environment in which proteins, RNAs, and metabolites occupy roughly 20–30% of the total volume, creating steric excluded-volume effects and microcompartmentation.',
    function:
      'Serves as the primary site for glycolysis, the pentose phosphate pathway, cytosolic protein translation, ubiquitin–proteasome degradation, and second-messenger diffusion.',
    interactions:
      'Exchanges metabolites and ions with all organelles, supplies precursor polypeptides to mitochondria, peroxisomes, and the ER, and hosts dynamic liquid–liquid phase-separated ribonucleoprotein granules.',
    contextDependency:
      'Cytosolic viscosity, hydration state, and crowding fluctuate with osmotic stress, metabolic activity, and cell-cycle stage.',
    visualSimplification:
      'Represented as a translucent interior volume with cross-sectional cutaway planes so internal organelles are not visually obscured.',
    references: [
      {
        refId: 'luby-phelps-2000',
        claimSupported:
          'Demonstrates that the aqueous cytoplasm is crowded rather than dilute, restricting macromolecular and vesicular diffusion through steric hindrance and cytoarchitectural partitioning.'
      },
      {
        refId: 'ellis-2001',
        claimSupported:
          'Quantifies macromolecular crowding (20–30% volume occupancy) and explains how excluded-volume effects promote protein folding and oligomeric assembly in vivo.'
      },
      {
        refId: 'le-mercier-2022',
        claimSupported:
          'Provides standardized subcellular location nomenclature linking cytosolic and organellar visual mappings to Gene Ontology and UniProt annotations.'
      }
    ]
  },
  {
    id: 'nucleus',
    name: 'Nucleus (Nucleoplasm)',
    scientificName: 'Cell Nucleus & Nucleoplasm',
    synonyms: ['Karyoplasm', 'Nuclear interior', 'Nuclear compartment'],
    ontologyId: 'GO:0005634 / SL-0191',
    category: 'Genetic Compartment',
    color: '#6366f1',
    summary:
      'Membrane-enclosed compartment housing the nuclear genome and coordinating DNA replication and transcription.',
    overview:
      'The nucleus is the defining organelle of eukaryotic cells, isolating genomic DNA from cytosolic translation while organizing gene expression in three-dimensional space.',
    structure:
      'Bounded by the double-membraned nuclear envelope and supported internally by the nuclear lamina; the interior nucleoplasm contains non-randomly arranged chromosome territories, an interchromatin compartment, and membraneless nuclear bodies (such as nucleoli and splicing speckles).',
    function:
      'Coordinates chromosomal DNA replication, DNA damage repair, RNA transcription (mRNA, rRNA, tRNA, non-coding RNAs), and pre-mRNA splicing and processing.',
    interactions:
      'Communicates bidirectionally with the cytosol through nuclear pore complexes and is mechanically linked to the cytoplasmic cytoskeleton via LINC (linker of nucleoskeleton and cytoskeleton) complexes spanning the nuclear envelope.',
    contextDependency:
      'Nuclear morphology, volume, and position vary widely by cell type (e.g., multilobed nuclei in neutrophils, eccentric nuclei in secretory cells, or absent in mature mammalian erythrocytes); in vertebrate mitosis, the nucleus undergoes open disassembly.',
    visualSimplification:
      'Depicts a single spherical interphase nucleus with a 3/4 sector cutaway exposing the nucleoplasm, chromatin loops, and central nucleolus.',
    references: [
      {
        refId: 'dangelo-2018',
        claimSupported:
          'Describes how the nucleus compartmentalizes chromosome territories and transcriptional regulators within the nuclear space bounded by the nuclear envelope and lamina.'
      },
      {
        refId: 'cremer-cremer-2010',
        claimSupported:
          'Establishes that interphase nuclear architecture is compartmentalized into chromosome territories and an interchromatin compartment containing replication, transcription, and splicing complexes.'
      }
    ]
  },
  {
    id: 'nuclear-envelope',
    name: 'Nuclear Envelope',
    scientificName: 'Nuclear Envelope & Nuclear Pore Complexes',
    synonyms: ['Nuclear membrane', 'Karyotheca', 'Perinuclear cisterna'],
    ontologyId: 'GO:0005635 / SL-0178',
    category: 'Genetic Compartment',
    color: '#4f46e5',
    summary:
      'Double lipid bilayer perforated by multiprotein nuclear pore complexes that gate nucleocytoplasmic transport.',
    overview:
      'The nuclear envelope separates the genome from the cytoplasm and acts both as a selective transport barrier and a scaffold for chromatin organization.',
    structure:
      'Comprises an outer nuclear membrane (ONM) continuous with the rough endoplasmic reticulum, a perinuclear luminal space, an inner nuclear membrane (INM) enriched in specific transmembrane proteins (NETs) backed by the nuclear lamina, and nuclear pore complexes (NPCs) built from multiples of ~32 nucleoporins where the INM and ONM fuse.',
    function:
      'Regulates bidirectional transport of RNAs, ribosomal subunits, and proteins via NPCs, anchors peripheral heterochromatin via the lamina, and participates directly in gene regulation at NPC scaffolds.',
    interactions:
      'Luminally and membranously continuous with the rough ER; binds nuclear lamins and chromatin on its inner face and cytoplasmic intermediate filaments/microtubules on its outer face.',
    contextDependency:
      'Nucleoporin stoichiometry and NPC density vary across cell types and differentiation states, modulating tissue-specific transport and transcriptional programs.',
    visualSimplification:
      'Shows ~34 enlarged schematic nuclear pore rings across the cutaway envelope rather than the thousands of nanometer-scale NPCs present in a mammalian nucleus.',
    references: [
      {
        refId: 'dangelo-2018',
        claimSupported:
          'Details the structure of the inner and outer nuclear membranes, continuity with the rough ER, the underlying nuclear lamina, and NPCs built from ~32 nucleoporins acting as transport gates and gene-regulation hubs.'
      },
      {
        refId: 'westrate-voeltz-2015',
        claimSupported:
          'Confirms that the nuclear envelope is a specialized domain of the continuous ER membrane bilayer system stabilized by lamina, chromatin, and linker proteins.'
      }
    ]
  },
  {
    id: 'nucleolus',
    name: 'Nucleolus',
    scientificName: 'Nucleolus (Multiphase Biomolecular Condensate)',
    synonyms: ['Plasmosome', 'Ribosome factory'],
    ontologyId: 'GO:0005730 / SL-0188',
    category: 'Genetic Compartment',
    color: '#312e81',
    summary:
      'Membraneless subnuclear condensate driving ribosomal RNA transcription and pre-ribosomal subunit assembly.',
    overview:
      'The nucleolus is the largest subnuclear body, forming around tandemly repeated ribosomal DNA (rDNA) gene clusters (nucleolar organizer regions) without a bounding lipid membrane.',
    structure:
      'Organized via liquid–liquid phase separation (LLPS) into coaxial, immiscible subcompartments: the fibrillar center (FC), dense fibrillar component (DFC), and peripheral granular component (GC).',
    function:
      'Transcribes rDNA via RNA Polymerase I, processes and modifies pre-rRNA transcripts, and assembles ribonucleoprotein precursors into 40S and 60S ribosomal subunits prior to nuclear export; also acts as a stress sensor.',
    interactions:
      'Continuously exchanges ribosomal proteins and assembly factors with the surrounding nucleoplasm and exports pre-ribosomal particles through nuclear pore complexes into the cytosol.',
    contextDependency:
      'Nucleolar number (often 1–5 per mammalian nucleus), size, and multiphase morphology remodel dynamically with proliferation rate, viral infection, cellular stress, and mitosis.',
    visualSimplification:
      'Illustrated as a single prominent central spheroid with surface granular nodules rather than resolving internal FC/DFC/GC phase boundaries.',
    references: [
      {
        refId: 'lafontaine-2021',
        claimSupported:
          'Reviews the nucleolus as a paradigmatic membraneless organelle and multiphase liquid condensate driving ribosome biogenesis and cellular stress sensing.'
      }
    ]
  },
  {
    id: 'chromatin',
    name: 'Chromatin',
    scientificName: 'Interphase Chromatin & Chromosome Territories',
    synonyms: ['Euchromatin & Heterochromatin', 'Nucleoprotein fibers'],
    ontologyId: 'GO:0000785',
    category: 'Genetic Compartment',
    color: '#a855f7',
    summary:
      'Hierarchical complex of genomic DNA and histone proteins organized into discrete 3D nuclear territories.',
    overview:
      'Chromatin packages eukaryotic genomic DNA with histone and non-histone proteins, balancing physical compaction with dynamic accessibility for transcription, replication, and repair.',
    structure:
      'At the molecular scale, DNA wraps around histone octamers to form nucleosomes; at the micron scale during interphase, individual chromosomes occupy discrete, non-randomly positioned 3D chromosome territories (CTs) partitioned into transcriptionally permissive euchromatin and compact heterochromatin.',
    function:
      'Compacts meters of genomic DNA into a micron-scale nucleus, regulates gene expression through epigenetic histone modifications and 3D enhancer–promoter looping, and preserves genome stability.',
    interactions:
      'Silent lamina-associated domains (LADs) tether to the nuclear lamina and inner nuclear membrane, while active domains interact with nuclear pore complexes and interchromatin transcription factories.',
    contextDependency:
      'Radial positioning of gene-rich (often central) versus gene-poor (often peripheral) chromosome territories varies by cell lineage, differentiation state, and condenses into mitotic chromosomes during cell division.',
    visualSimplification:
      'Represented as 7 continuous 3D tubular fiber loops inside the cutaway nucleoplasm rather than individual nucleosomes or volumetric chromosome territories.',
    references: [
      {
        refId: 'cremer-cremer-2010',
        claimSupported:
          'Establishes that interphase chromosomes occupy discrete 3D chromosome territories with nonrandom radial arrangements and an interchromatin network.'
      },
      {
        refId: 'meaburn-misteli-2007',
        claimSupported:
          'Summarizes how the spatial positioning of chromosome territories and gene loci within the 3D nucleus influences gene activity and disease states.'
      }
    ]
  },
  {
    id: 'rough-er',
    name: 'Rough Endoplasmic Reticulum',
    scientificName: 'Granular Endoplasmic Reticulum (Cisternal ER Domain)',
    synonyms: ['Rough ER', 'RER', 'Ergastoplasm'],
    ontologyId: 'GO:0005791 / SL-0236',
    category: 'Endomembrane System',
    color: '#0d9488',
    summary:
      'Ribosome-studded cisternal membrane sheets specialized for co-translational protein translocation and folding.',
    overview:
      'The rough endoplasmic reticulum is the sheet-dominated domain of the continuous ER network, densely studded on its cytosolic face with translating ribosomes.',
    structure:
      'Consists of stacked, flattened cisternal membrane sheets (often fenestrated) whose lumen is continuous with the perinuclear space of the nuclear envelope; sheet edges are stabilized by curvature-inducing proteins such as reticulons.',
    function:
      'Mediates co-translational translocation of secretory, luminal, and transmembrane proteins via the Sec61 translocon, catalyzes N-linked glycosylation, disulfide bond formation, and chaperone-assisted folding, and performs ER-associated degradation (ERAD) quality control.',
    interactions:
      'Directly continuous with the outer nuclear membrane and smooth ER tubules; exports folded cargo at ribosome-free ER exit sites (ERES) via COPII vesicles toward the Golgi apparatus.',
    contextDependency:
      'Rough ER sheet abundance is highly expanded in professional secretory cells (such as pancreatic acinar cells and plasma cells) compared to non-secretory cells.',
    visualSimplification:
      'Modeled as four concentric fenestrated lamellar shells wrapping the nucleus with enlarged inter-cisternal spacing.',
    references: [
      {
        refId: 'westrate-voeltz-2015',
        claimSupported:
          'Demonstrates that the ER is a single continuous membrane system partitioned into nuclear envelope, ribosome-studded flat cisternal sheets, and dynamic peripheral tubules.'
      },
      {
        refId: 'jensen-schekman-2011',
        claimSupported:
          'Describes how newly synthesized secretory proteins exit the ER in COPII-coated transport vesicles for delivery to the Golgi apparatus.'
      }
    ]
  },
  {
    id: 'smooth-er',
    name: 'Smooth Endoplasmic Reticulum',
    scientificName: 'Agranular Endoplasmic Reticulum (Tubular ER Domain)',
    synonyms: ['Smooth ER', 'SER', 'Tubular endoplasmic reticulum'],
    ontologyId: 'GO:0005790 / SL-0246',
    category: 'Endomembrane System',
    color: '#14b8a6',
    summary:
      'Ribosome-free anastomosing tubular membrane network mediating lipid biosynthesis and calcium signaling.',
    overview:
      'The smooth endoplasmic reticulum forms a dynamic, ribosome-free polygonal network of interconnected membrane tubules extending throughout the peripheral cytoplasm.',
    structure:
      'Shaped into high-curvature cylindrical tubules by wedge-like transmembrane hairpin proteins (reticulons and REEP/DP1 family proteins) and fused into three-way tubular junctions by atlastin dynamin-like GTPases.',
    function:
      'Synthesizes phospholipids, cholesterol, and steroid hormones, detoxifies lipophilic xenobiotics via cytochrome P450 enzymes, and acts as the primary dynamic intracellular Ca²⁺ storage and release reservoir.',
    interactions:
      'Forms extensive membrane contact sites (MCS) with mitochondria (regulating lipid transfer and mitochondrial fission), the plasma membrane, endosomes, and peroxisomes, while sliding along microtubule tracks.',
    contextDependency:
      'Dominates ER volume in steroidogenic cells, hepatocytes, and striated muscle cells (where it specializes into the sarcoplasmic reticulum).',
    visualSimplification:
      'Rendered as a localized branched tubular lattice adjacent to the Rough ER rather than a cell-wide polygonal meshwork.',
    references: [
      {
        refId: 'westrate-voeltz-2015',
        claimSupported:
          'Details how reticulons and REEP/DP1 proteins generate ER tubule curvature, atlastin GTPases catalyze homotypic three-way junction fusion, and ER tubules form functional contact sites with other organelles.'
      }
    ]
  },
  {
    id: 'ribosomes',
    name: 'Ribosomes',
    scientificName: 'Eukaryotic 80S Ribonucleoprotein Particle',
    synonyms: ['80S ribosome', 'Polyribosomes', 'Polysomes', 'Translating ribosomes'],
    ontologyId: 'GO:0005840 / SL-0232',
    category: 'Endomembrane System',
    color: '#f43f5e',
    summary:
      'Macromolecular ribonucleoprotein machines that decode mRNA into polypeptide chains.',
    overview:
      'Eukaryotic 80S ribosomes are conserved macromolecular complexes of ribosomal RNA (rRNA) and proteins that catalyze mRNA-directed protein synthesis in the cytosol and on the rough ER.',
    structure:
      'Approximately 25–30 nm in diameter (~4.3 MDa in humans), composed of a small 40S subunit (18S rRNA and ~33 proteins, mediating mRNA decoding) and a large 60S subunit (28S, 5.8S, and 5S rRNAs and ~46–47 proteins, housing the peptidyl transferase center and polypeptide exit tunnel), surrounded by eukaryote-specific rRNA expansion segments.',
    function:
      'Translates genetic information encoded in mRNA codons into polypeptide chains through coordinated initiation, elongation, peptidyl transfer, translocation, and termination cycles.',
    interactions:
      'Pre-subunits are assembled in the nucleolus and exported via NPCs; in the cytoplasm, ribosomes cycle between free cytosolic polysome clusters and Sec61-tethered complexes on the rough ER membrane.',
    contextDependency:
      'Ribosomes are not permanent residents of either pool; individual subunits partition dynamically between cytosolic and ER-bound states depending on whether the nascent peptide carries a signal sequence.',
    visualSimplification:
      'Enlarged (~10× relative to cell diameter) and sub-sampled (~230 instances vs. millions in vivo) so ER-bound arrays and cytosolic polysome rosettes are selectable.',
    references: [
      {
        refId: 'khatter-2015',
        claimSupported:
          'Resolves the atomic structure of the human 80S ribosome (40S and 60S subunits, inter-subunit bridges, and rotational remodeling during translation).'
      },
      {
        refId: 'ben-shem-2011',
        claimSupported:
          'Establishes the 3.0 Å crystal structure of the eukaryotic 80S ribosome, defining the conserved catalytic core and eukaryote-specific rRNA expansion segments.'
      },
      {
        refId: 'ramakrishnan-2002',
        claimSupported:
          'Synthesizes the structural and biochemical mechanisms of mRNA decoding, peptidyl transfer, and translocation across the ribosomal subunits.'
      }
    ]
  },
  {
    id: 'golgi-apparatus',
    name: 'Golgi Apparatus',
    scientificName: 'Golgi Complex (Golgi Ribbon)',
    synonyms: ['Golgi complex', 'Golgi body', 'Dictyosome'],
    ontologyId: 'GO:0005794 / SL-0132',
    category: 'Endomembrane System',
    color: '#f59e0b',
    summary:
      'Polarized stack of flattened cisternae that modifies, sorts, and packages proteins and lipids.',
    overview:
      'The Golgi apparatus is the central sorting and post-translational processing hub of the eukaryotic secretory pathway.',
    structure:
      'Composed of stacked, flattened membrane disks (cisternae) functionally polarized into cis-Golgi network (CGN), cis-, medial-, and trans-cisternae, and the trans-Golgi network (TGN); in vertebrate cells, individual stacks are laterally linked by tubular bridges into a perinuclear Golgi ribbon supported by golgin matrix proteins (such as GM130 and giantin).',
    function:
      'Executes sequential N- and O-linked glycan remodeling, proteolytic cleavage, sulfation, and phosphorylation of cargo proteins, synthesizes sphingomyelin and glycosphingolipids, and sorts cargos at the TGN into distinct carriers for the plasma membrane, endosomes, or lysosomes.',
    interactions:
      'Receives anterograde cargo from the ER via COPII vesicles and the ER–Golgi intermediate compartment (ERGIC), recycles resident enzymes backward via COPI vesicles, and buds clathrin- and adaptor-coated carriers from the TGN; positioned near the centrosome via dynein motors on microtubules.',
    contextDependency:
      'While vertebrates form a single juxtanuclear Golgi ribbon that fragments during mitosis, invertebrates (e.g., Drosophila) and plants maintain dispersed individual Golgi stacks.',
    visualSimplification:
      'Shown as a single representative stack of 6 curved cisternae with dilated rims rather than an extended multi-stack ribbon.',
    references: [
      {
        refId: 'liu-2021',
        claimSupported:
          'Reviews the cis/medial/trans cisternal organization, vertebrate Golgi ribbon matrix proteins (GM130, giantin, BICD2), glycosylation processing, and TGN cargo sorting.'
      },
      {
        refId: 'arakel-schwappach-2018',
        claimSupported:
          'Details COPI-mediated retrograde retrieval of ER-resident proteins (such as KDEL-bearing chaperones and di-lysine tagged membrane proteins) from the Golgi back to the ER.'
      }
    ]
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria (with Cristae)',
    scientificName: 'Mitochondrion & Inner Membrane Cristae',
    synonyms: ['Chondriosome', 'Mitochondrial network'],
    ontologyId: 'GO:0005739 / SL-0173',
    category: 'Energy & Metabolism',
    color: '#ef4444',
    summary:
      'Double-membrane bioenergetic and signaling organelles generating ATP via oxidative phosphorylation.',
    overview:
      'Mitochondria are semi-autonomous, endosymbiont-derived organelles that power aerobic eukaryotic cells and serve as central hubs for metabolism, calcium buffering, and apoptosis.',
    structure:
      'Enclosed by a smooth outer mitochondrial membrane (OMM) and a protein-rich inner mitochondrial membrane (IMM) subdivided into the inner boundary membrane and tubular or lamellar invaginations called cristae, which are separated by narrow cristae junctions (CJs); the internal matrix houses circular mitochondrial DNA (mtDNA) and 55S mitoribosomes.',
    function:
      'Generates ATP via the electron transport chain and F₁F₀-ATP synthase localized within cristae membranes, catalyzes the tricarboxylic acid (TCA) cycle and fatty acid β-oxidation in the matrix, synthesizes iron–sulfur (Fe–S) clusters and heme precursors, and regulates intrinsic apoptosis.',
    interactions:
      'Imports ~99% of its proteome (~1,000–4,000 nuclear-encoded proteins) from the cytosol, forms tight ER–mitochondria contact sites (MAMs) for lipid and Ca²⁺ exchange, and undergoes continuous fission and fusion along microtubule tracks.',
    contextDependency:
      'Rather than isolated bean-shaped capsules, mitochondria in living cells form a dynamic, interconnected tubular network whose cristae density and fission/fusion balance adapt to bioenergetic demand.',
    visualSimplification:
      'Four discrete organelles are shown (two with longitudinal cutaways exposing lamellar cristae baffles) in place of hundreds of interconnected mitochondrial tubules.',
    references: [
      {
        refId: 'caron-bertolin-2024',
        claimSupported:
          'Reviews mitochondrial endosymbiotic evolution, OMM/IMM compartmentalization, dynamic remodeling of cristae and cristae junctions, and bioenergetic/signaling functions.'
      }
    ]
  },
  {
    id: 'lysosomes',
    name: 'Lysosomes',
    scientificName: 'Lysosome (Terminal Endolysosomal Compartment)',
    synonyms: ['Endolysosome', 'Acidic degradative vacuole'],
    ontologyId: 'GO:0005764 / SL-0158',
    category: 'Endomembrane System',
    color: '#d946ef',
    summary:
      'Acidic membrane-bound organelles containing hydrolytic enzymes for macromolecular degradation and nutrient sensing.',
    overview:
      'Lysosomes are the terminal degradative compartments of the endocytic and autophagic pathways, also acting as metabolic signaling hubs on their cytosolic surface.',
    structure:
      'Spherical or tubular-vacuolar organelles (typically ~0.2–0.5 µm in diameter) bounded by a single phospholipid bilayer lined with heavily glycosylated lysosomal membrane proteins (such as LAMP1 and LAMP2) that protect the limiting membrane from the acidic lumen (pH ~4.5–5.0) maintained by vacuolar H⁺-ATPases (V-ATPases).',
    function:
      'Degrades extracellular cargo (delivered via endocytosis/phagocytosis) and intracellular components (delivered via autophagy) using >50 acid hydrolases, recycles catabolites to the cytosol, repairs plasma membrane lesions, and scaffolds mTORC1/TFEB nutrient sensing.',
    interactions:
      'Receives mannose-6-phosphate (M6P)-tagged hydrolases from the trans-Golgi network via clathrin-coated carriers and endosomes, fuses heterotypically with late endosomes and autophagosomes, and forms membrane contact sites with the ER and mitochondria.',
    contextDependency:
      'Lysosomal pH, positioning (perinuclear vs. peripheral), and specialized lysosome-related organelles (LROs, such as melanosomes or lytic granules) vary by cell type and nutrient status.',
    visualSimplification:
      'Rendered as four enlarged magenta spheroids, including one cutaway highlighting the dense internal hydrolase matrix.',
    references: [
      {
        refId: 'saftig-klumperman-2009',
        claimSupported:
          'Establishes how lysosome biogenesis integrates biosynthetic TGN-to-endosome trafficking (via mannose-6-phosphate receptors, clathrin, and retromer) with endocytic/autophagic degradation and lysosomal membrane protein functions.'
      }
    ]
  },
  {
    id: 'vesicles',
    name: 'Transport & Secretory Vesicles',
    scientificName: 'Intracellular Membrane-Bound Transport Carriers',
    synonyms: [
      'COPII vesicles',
      'COPI vesicles',
      'Clathrin-coated vesicles',
      'Secretory granules'
    ],
    ontologyId: 'GO:0031982 / SL-0243',
    category: 'Endomembrane System',
    color: '#fbbf24',
    summary:
      'Small membrane-enclosed carriers that bud and fuse to shuttle proteins and lipids between compartments.',
    overview:
      'Transport and secretory vesicles maintain directional cargo flow across the endomembrane system without mixing compartment identities.',
    structure:
      'Spherical or tubular-vesicular lipid bilayer carriers (typically 50–100 nm for coated transport vesicles; larger for secretory granules) transiently sculpted by cytosolic coat protein complexes—COPII (Sar1, Sec23/24, Sec13/31), COPI (Arf1 and heptameric coatomer), or clathrin/adaptor protein (AP) triskelions.',
    function:
      'Selectively concentrates transmembrane and soluble luminal cargo at donor membranes, deforms the bilayer into a bud, uncoats after scission, and delivers cargo via Rab GTPase-guided tethering and SNARE-mediated membrane fusion.',
    interactions:
      'COPII vesicles mediate anterograde ER-to-Golgi export; COPI vesicles mediate retrograde Golgi-to-ER and intra-Golgi retrieval; clathrin-coated vesicles mediate TGN-to-endosome and plasma-membrane endocytic transport along microtubule and actin tracks.',
    contextDependency:
      'Coat complexes are shed shortly after budding, and large cargos (such as 300 nm procollagen fibrils) require specialized enlarged tubular-vesicular carriers.',
    visualSimplification:
      'Represented as smooth golden spheres clustered along ER-to-Golgi and post-Golgi trajectories without resolving individual protein cages.',
    references: [
      {
        refId: 'jensen-schekman-2011',
        claimSupported:
          'Establishes the molecular mechanism by which Sar1, Sec23/24, and Sec13/31 assemble the COPII coat to sort cargo and bud vesicles from the ER.'
      },
      {
        refId: 'arakel-schwappach-2018',
        claimSupported:
          'Details how Arf1 and heptameric coatomer form COPI-coated vesicles for retrograde cargo sorting and retrieval between the Golgi and ER.'
      }
    ]
  },
  {
    id: 'peroxisomes',
    name: 'Peroxisomes',
    scientificName: 'Peroxisome (Microbody)',
    synonyms: ['Microbody'],
    ontologyId: 'GO:0005777 / SL-0204',
    category: 'Energy & Metabolism',
    color: '#84cc16',
    summary:
      'Single-membrane oxidative organelles driving very-long-chain fatty acid β-oxidation and reactive oxygen species detoxification.',
    overview:
      'Peroxisomes are ubiquitous metabolic organelles essential for cellular lipid homeostasis and redox balance in eukaryotic cells.',
    structure:
      'Bounded by a single phospholipid bilayer (~0.1–1.0 µm diameter) lacking DNA or ribosomes; the dense matrix contains ~50 enzymes imported post-translationally via PEX peroxins recognizing PTS1/PTS2 targeting signals, and in many non-human mammalian tissues exhibits a para-crystalline core of urate oxidase.',
    function:
      'Catalyzes β-oxidation of very-long-chain fatty acids (VLCFAs) and α-oxidation of branched-chain fatty acids (e.g., phytanic acid), synthesizes ether-phospholipids (plasmalogens) and bile acid intermediates, and decomposes toxic hydrogen peroxide (H₂O₂) via catalase.',
    interactions:
      'Cooperates metabolically with mitochondria (transferring shortened fatty acyl-CoAs for complete oxidation) and the ER (sharing ether-lipid synthesis steps and membrane contact sites).',
    contextDependency:
      'Note on species variation: while rodent and many mammalian hepatic peroxisomes contain a prominent crystalloid urate oxidase core, human peroxisomes lack active urate oxidase and are typically acrystalloid.',
    visualSimplification:
      'Rendered with a classic textbook octahedral crystalloid core inside a translucent green membrane to visually distinguish peroxisomes from lysosomes.',
    references: [
      {
        refId: 'wanders-waterham-2006',
        claimSupported:
          'Comprehensively reviews mammalian peroxisomal enzymology (~50 matrix enzymes, PTS1/PTS2 import, ABC transporters), VLCFA β-oxidation, plasmalogen/bile-acid synthesis, and species differences.'
      }
    ]
  },
  {
    id: 'centrosome',
    name: 'Centrosome (with Centrioles)',
    scientificName: 'Centrosome & Centriole Pair (MTOC)',
    synonyms: [
      'Microtubule-organizing center',
      'MTOC',
      'Diplosome & Pericentriolar material'
    ],
    ontologyId: 'GO:0005813 / SL-0049',
    category: 'Cytoskeleton',
    color: '#eab308',
    summary:
      'Membraneless organelle composed of an orthogonal pair of centrioles surrounded by pericentriolar material that nucleates microtubules.',
    overview:
      'The centrosome serves as the principal microtubule-organizing center (MTOC) in proliferating animal cells and coordinates cell polarity and mitotic spindle assembly.',
    structure:
      'Consists of a mother and a daughter centriole—each a cylindrical barrel (~0.2 µm diameter × ~0.4–0.5 µm length) built from nine-fold symmetric triplet microtubules—embedded within an ordered protein matrix of pericentriolar material (PCM) enriched in γ-tubulin ring complexes (γ-TuRCs).',
    function:
      'Nucleates and anchors microtubule minus ends via γ-TuRCs, duplicates strictly once per cell cycle during S phase to form the two poles of the bipolar mitotic spindle, and templates the basal body of primary cilia in quiescent cells.',
    interactions:
      'Radiates astral and cytoplasmic microtubules, tethers the perinuclear Golgi ribbon via dynein, and links to the nucleus during cell migration and polarization.',
    contextDependency:
      'In many terminally differentiated animal cells (such as polarized epithelia, neurons, and muscle cells), centrosomal MTOC activity is downregulated and microtubule nucleation shifts to non-centrosomal sites.',
    visualSimplification:
      'Enlarged relative to the cell envelope so the 9-fold cylindrical centriole barrels and orthogonal orientation are clearly discernible.',
    references: [
      {
        refId: 'conduit-2015',
        claimSupported:
          'Details nine-fold symmetric centriole architecture, pericentriolar material (PCM) recruitment of γ-TuRCs, once-per-cycle duplication, and mitotic spindle pole assembly.'
      },
      {
        refId: 'bornens-2012',
        claimSupported:
          'Reviews the evolutionary and functional roles of the centrosome in cell polarity, primary ciliogenesis, and spatial organization of animal cells.'
      }
    ]
  },
  {
    id: 'microtubules',
    name: 'Microtubules',
    scientificName: 'α/β-Tubulin Polymeric Microtubule Cytoskeleton',
    synonyms: ['Tubulin filaments', 'Cytoplasmic microtubules'],
    ontologyId: 'GO:0005874 / SL-0170',
    category: 'Cytoskeleton',
    color: '#22c55e',
    summary:
      'Polarized hollow cylinders of α/β-tubulin dimers that form intracellular transport tracks and the mitotic spindle.',
    overview:
      'Microtubules are the stiffest filaments of the eukaryotic cytoskeleton, forming polarized tracks that organize organelle positioning and drive chromosome segregation.',
    structure:
      'Hollow cylindrical polymers (~25 nm outer diameter) typically assembled from 13 laterally associated protofilaments of α/β-tubulin heterodimers, exhibiting intrinsic structural polarity with a slow-growing minus (−) end (often anchored at γ-TuRCs) and a fast-growing, dynamically unstable plus (+) end.',
    function:
      'Serves as long-range highways for kinesin (plus-end directed) and cytoplasmic dynein (minus-end directed) motor proteins, positions the ER, Golgi, mitochondria, and lysosomes, and reconfigures into the mitotic spindle during cell division.',
    interactions:
      'Nucleated at the centrosome or non-centrosomal MTOCs (such as the Golgi or apical cortex), regulated by plus-end tracking proteins (+TIPs) and microtubule-associated proteins (MAPs), and crosslinked with actin and intermediate filaments.',
    contextDependency:
      'While proliferating fibroblasts display radial centrosomal arrays, differentiated cells (neurons, epithelia, myotubes) reorganize microtubules into parallel axonal or apicobasal non-centrosomal arrays.',
    visualSimplification:
      'Rendered as 10 thickened radial tracks originating from the centrosome so they remain visible without cluttering the cell interior.',
    references: [
      {
        refId: 'muroyama-lechler-2017',
        claimSupported:
          'Reviews centrosomal versus non-centrosomal microtubule arrays, γ-TuRC minus-end anchoring, plus-end dynamics, and cell-type-specific reorganization during differentiation.'
      }
    ]
  },
  {
    id: 'actin-filaments',
    name: 'Actin Filaments (Microfilaments)',
    scientificName: 'Filamentous Actin (F-Actin) & Cell Cortex',
    synonyms: ['Microfilaments', 'F-actin', 'Cortical actin network'],
    ontologyId: 'GO:0005884 / SL-0006',
    category: 'Cytoskeleton',
    color: '#fb7185',
    summary:
      'Dynamic helical polymers of actin forming the sub-membranous cell cortex and contractile networks.',
    overview:
      'Actin filaments (F-actin) are flexible, polarized polymers that concentrate beneath the plasma membrane as the cell cortex and assemble into protrusive and contractile structures.',
    structure:
      'Double-stranded helical filaments (~7 nm diameter) polymerized from globular G-actin monomers into linear bundles (nucleated by formins) or branched networks (nucleated by the Arp2/3 complex); in the cell cortex, F-actin forms a ~100–200 nm thick meshwork crosslinked by over a hundred actin-binding proteins and myosin-II motors.',
    function:
      'Generates cortical surface tension to govern cell shape and mitotic rounding, drives cell migration via lamellipodia and filopodia, powers cytokinesis via the contractile actomyosin ring, and facilitates endocytosis and short-range vesicle transport.',
    interactions:
      'Tethered directly to the inner leaflet of the plasma membrane (e.g., via ERM proteins) and linked to focal adhesions, adherens junctions, and spectrin/intermediate filament scaffolds.',
    contextDependency:
      'Cortical actin thickness, density, and stress-fiber organization vary substantially between suspended, mitotic, migrating mesenchymal, and polarized epithelial cells.',
    visualSimplification:
      'Illustrated as a sparse sub-membranous geodesic-style filament web along the inner plasma membrane shell.',
    references: [
      {
        refId: 'chugh-paluch-2018',
        claimSupported:
          'Characterizes the animal cell actin cortex (~130 nm thickness measured by STED microscopy), its nucleation by formins and Arp2/3, and actomyosin-driven cortical tension.'
      }
    ]
  },
  {
    id: 'intermediate-filaments',
    name: 'Intermediate Filaments',
    scientificName: 'Cytoplasmic & Nuclear Intermediate Filament Network',
    synonyms: [
      'Nanofilaments',
      'Vimentin / Keratin / Desmin / Lamin filaments'
    ],
    ontologyId: 'GO:0005882 / SL-0146',
    category: 'Cytoskeleton',
    color: '#38bdf8',
    summary:
      'Non-polar, rope-like fibrous polymers that impart tensile strength and mechanical resilience to animal cells.',
    overview:
      'Intermediate filaments (IFs) form a metazoan-specific cytoskeletal system that absorbs mechanical stress and integrates the nucleus with cell–cell and cell–matrix junctions.',
    structure:
      'Flexible, apolar rope-like polymers (~10 nm diameter—intermediate between 7 nm actin and 25 nm microtubules) assembled from α-helical coiled-coil dimers into staggered tetramers and unit-length filaments; encoded by ~65–70 human genes across sequence-distinct families (including keratins, vimentin, desmin, neurofilaments, and nuclear lamins).',
    function:
      'Provides viscoelastic strain-stiffening resistance against large mechanical deformations, cages and positions the nucleus, and integrates mechanical forces across multicellular tissues.',
    interactions:
      'Forms a perinuclear cage connected to the nuclear envelope via LINC complexes and extends to the cell periphery to anchor at desmosomes and hemidesmosomes via plakin cytolinkers (such as plectin).',
    contextDependency:
      'Unlike ubiquitous actin and tubulin, cytoplasmic IF protein expression is strictly cell-type specific (e.g., keratins in epithelia, vimentin in mesenchymal cells, desmin in muscle, neurofilaments in neurons), and some animal lineages (such as arthropods) lack cytoplasmic IFs.',
    visualSimplification:
      'Rendered as 9 wavy trans-cytoplasmic cords spanning between the perinuclear zone and the cell cortex.',
    references: [
      {
        refId: 'herrmann-2007',
        claimSupported:
          'Establishes the ~65-gene human IF family, apolar coiled-coil assembly into 10 nm filaments, nanomechanical stress-absorbing properties, and integration of nuclear and cytoplasmic architecture.'
      }
    ]
  }
];

export const ORGANELLE_MAP = new Map(
  ORGANELLES.map((item) => [item.id, item])
);