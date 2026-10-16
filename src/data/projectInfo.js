import { ORGANELLES, SCIENTIFIC_DISCLAIMER } from './organelles.js';
import { REFERENCES } from './references.js';
import { SCALE_LEVELS } from './scaleLevels.js';

export const PROJECT_INFO = {
  title: 'CellScope 3D',
  subtitle: 'Interactive Eukaryotic Animal-Cell Atlas',
  stageLabel: 'Publication Edition • Interactive 3D Atlas',
  scientificDisclaimer: SCIENTIFIC_DISCLAIMER,
  specs: [
    { label: 'Scale Hierarchy', value: `${SCALE_LEVELS.length} Conceptual Levels` },
    { label: 'Curated Structures', value: `${ORGANELLES.length} Organelles` },
    {
      label: 'Verified References',
      value: `${Object.keys(REFERENCES).length} Peer-Reviewed + RCSB PDB`
    }
  ]
};