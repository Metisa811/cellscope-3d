import * as THREE from 'three';

export function createStudioMaterials() {
  return {
    plasmaMembraneOuter: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.22,
      metalness: 0.0,
      transmission: 0.55,
      transparent: true,
      opacity: 0.72,
      ior: 1.38,
      thickness: 0.5,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false
    }),

    plasmaMembraneRim: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.05
    }),

    cytoplasmCutaway: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.4,
      metalness: 0.0,
      transmission: 0.35,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false
    }),

    nucleusCore: new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      roughness: 0.45,
      metalness: 0.0,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false
    }),

    nuclearEnvelope: new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide
    }),

    nuclearPore: new THREE.MeshStandardMaterial({
      color: 0xc7d2fe,
      roughness: 0.3,
      metalness: 0.1
    }),

    nucleolus: new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.2
    }),

    chromatin: new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      roughness: 0.55,
      metalness: 0.02
    }),

    roughER: new THREE.MeshPhysicalMaterial({
      color: 0x0d9488,
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.25,
      side: THREE.DoubleSide
    }),

    smoothER: new THREE.MeshPhysicalMaterial({
      color: 0x14b8a6,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.3
    }),

    ribosome: new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.4,
      metalness: 0.05
    }),

    golgi: new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.03,
      clearcoat: 0.35,
      side: THREE.DoubleSide
    }),

    mitoOuter: new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.4,
      side: THREE.DoubleSide
    }),

    mitoInnerMatrix: new THREE.MeshStandardMaterial({
      color: 0xfca5a5,
      roughness: 0.45,
      metalness: 0.0
    }),

    mitoCristae: new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    }),

    lysosomeOuter: new THREE.MeshPhysicalMaterial({
      color: 0xd946ef,
      roughness: 0.25,
      metalness: 0.03,
      clearcoat: 0.45,
      side: THREE.DoubleSide
    }),

    lysosomeCore: new THREE.MeshStandardMaterial({
      color: 0x86198f,
      roughness: 0.5,
      metalness: 0.0
    }),

    vesicle: new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      roughness: 0.25,
      metalness: 0.02,
      clearcoat: 0.4
    }),

    peroxisomeOuter: new THREE.MeshPhysicalMaterial({
      color: 0x84cc16,
      roughness: 0.25,
      metalness: 0.0,
      transparent: true,
      opacity: 0.68,
      clearcoat: 0.4,
      depthWrite: false
    }),

    peroxisomeCore: new THREE.MeshStandardMaterial({
      color: 0x365314,
      roughness: 0.3,
      metalness: 0.15
    }),

    centrioleTubule: new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.3,
      metalness: 0.1
    }),

    centrosomeMatrix: new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.5,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    }),

    microtubule: new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.35,
      metalness: 0.05
    }),

    actinFilament: new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      roughness: 0.4,
      metalness: 0.05
    }),

    intermediateFilament: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.4,
      metalness: 0.05
    }),

    proxyInvisible: new THREE.MeshBasicMaterial({
      visible: false
    })
  };
}