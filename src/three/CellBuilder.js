import * as THREE from 'three';
import { createStudioMaterials } from './materials.js';

const CELL_RADIUS = 2.25;
const CUT_PHI_START = Math.PI * 0.42;
const CUT_PHI_LENGTH = Math.PI * 1.58;

function tagOrganelleHierarchy(rootObject, organelleId) {
  rootObject.name = organelleId;
  rootObject.userData.organelleId = organelleId;
  rootObject.userData.restPosition = rootObject.position.clone();
  rootObject.traverse((child) => {
    child.userData.organelleId = organelleId;
    if (child.isMesh && child.material && child.material.depthWrite !== false) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

export function buildAnimalCell() {
  const root = new THREE.Group();
  root.name = 'EukaryoticAnimalCell';

  const mats = createStudioMaterials();
  const organelleGroups = new Map();
  const selectableMeshes = [];

  function registerOrganelle(id, group) {
    tagOrganelleHierarchy(group, id);
    organelleGroups.set(id, group);
    root.add(group);
    group.traverse((child) => {
      if (child.isMesh) {
        selectableMeshes.push(child);
      }
    });
  }

  // 1. PLASMA MEMBRANE (3/4 cutaway spherical shell + exposed rim)
  {
    const group = new THREE.Group();
    const outerGeo = new THREE.SphereGeometry(
      CELL_RADIUS,
      64,
      48,
      CUT_PHI_START,
      CUT_PHI_LENGTH,
      0,
      Math.PI
    );
    const outerMesh = new THREE.Mesh(outerGeo, mats.plasmaMembraneOuter);
    group.add(outerMesh);

    const innerGeo = new THREE.SphereGeometry(
      CELL_RADIUS - 0.055,
      64,
      48,
      CUT_PHI_START,
      CUT_PHI_LENGTH,
      0,
      Math.PI
    );
    const innerMesh = new THREE.Mesh(innerGeo, mats.plasmaMembraneOuter);
    group.add(innerMesh);

    const rimArcGeo = new THREE.TorusGeometry(
      CELL_RADIUS - 0.027,
      0.032,
      12,
      64,
      Math.PI
    );
    const rim1 = new THREE.Mesh(rimArcGeo, mats.plasmaMembraneRim);
    rim1.rotation.z = -Math.PI / 2;
    rim1.rotation.y = CUT_PHI_START;
    group.add(rim1);

    const rim2 = new THREE.Mesh(rimArcGeo, mats.plasmaMembraneRim);
    rim2.rotation.z = -Math.PI / 2;
    rim2.rotation.y = CUT_PHI_START + CUT_PHI_LENGTH;
    group.add(rim2);

    registerOrganelle('plasma-membrane', group);
  }

  // 2. CYTOPLASM / CYTOSOL (translucent cutaway faces + inner core)
  {
    const group = new THREE.Group();
    const innerRadius = CELL_RADIUS - 0.06;

    const halfDiskGeo = new THREE.CircleGeometry(
      innerRadius,
      48,
      -Math.PI / 2,
      Math.PI
    );
    const face1 = new THREE.Mesh(halfDiskGeo, mats.cytoplasmCutaway);
    face1.rotation.y = CUT_PHI_START - Math.PI / 2;
    group.add(face1);

    const face2 = new THREE.Mesh(halfDiskGeo, mats.cytoplasmCutaway);
    face2.rotation.y = CUT_PHI_START + CUT_PHI_LENGTH - Math.PI / 2;
    group.add(face2);

    const cytosolShellGeo = new THREE.SphereGeometry(
      innerRadius - 0.02,
      40,
      32,
      CUT_PHI_START,
      CUT_PHI_LENGTH,
      0,
      Math.PI
    );
    const cytosolShell = new THREE.Mesh(cytosolShellGeo, mats.cytoplasmCutaway);
    group.add(cytosolShell);

    registerOrganelle('cytoplasm', group);
  }

  // Shared Nucleus Center
  const nucleusCenter = new THREE.Vector3(-0.22, 0.18, -0.18);
  const nucleusRadius = 0.76;

  // 3. NUCLEUS (Selectable nucleoplasm core and cutaway planes)
  {
    const group = new THREE.Group();
    group.position.copy(nucleusCenter);

    const coreGeo = new THREE.SphereGeometry(
      nucleusRadius - 0.04,
      40,
      32,
      Math.PI * 0.45,
      Math.PI * 1.55,
      0,
      Math.PI
    );
    const coreMesh = new THREE.Mesh(coreGeo, mats.nucleusCore);
    group.add(coreMesh);

    const cutDiskGeo = new THREE.CircleGeometry(
      nucleusRadius - 0.04,
      32,
      -Math.PI / 2,
      Math.PI
    );
    const cutPlane1 = new THREE.Mesh(cutDiskGeo, mats.nucleusCore);
    cutPlane1.rotation.y = Math.PI * 0.45 - Math.PI / 2;
    group.add(cutPlane1);

    const cutPlane2 = new THREE.Mesh(cutDiskGeo, mats.nucleusCore);
    cutPlane2.rotation.y = Math.PI * 2.0 - Math.PI / 2;
    group.add(cutPlane2);

    registerOrganelle('nucleus', group);
  }

  // 4. NUCLEAR ENVELOPE (Cutaway double membrane + nuclear pore complexes)
  {
    const group = new THREE.Group();
    group.position.copy(nucleusCenter);

    const envPhiStart = Math.PI * 0.45;
    const envPhiLen = Math.PI * 1.55;

    const envGeo = new THREE.SphereGeometry(
      nucleusRadius,
      48,
      36,
      envPhiStart,
      envPhiLen,
      0,
      Math.PI
    );
    const envMesh = new THREE.Mesh(envGeo, mats.nuclearEnvelope);
    group.add(envMesh);

    const rimGeo = new THREE.TorusGeometry(
      nucleusRadius - 0.015,
      0.022,
      10,
      48,
      Math.PI
    );
    const envRim1 = new THREE.Mesh(rimGeo, mats.nuclearPore);
    envRim1.rotation.z = -Math.PI / 2;
    envRim1.rotation.y = envPhiStart;
    group.add(envRim1);

    const envRim2 = new THREE.Mesh(rimGeo, mats.nuclearPore);
    envRim2.rotation.z = -Math.PI / 2;
    envRim2.rotation.y = envPhiStart + envPhiLen;
    group.add(envRim2);

    const poreGeo = new THREE.TorusGeometry(0.038, 0.012, 8, 16);
    const poreCount = 34;
    for (let i = 0; i < poreCount; i++) {
      const u = (i + 0.5) / poreCount;
      const theta = Math.acos(1 - 2 * u);
      const phi =
        envPhiStart +
        0.15 +
        ((i * 1.6180339) % 1) * (envPhiLen - 0.3);

      const pos = new THREE.Vector3().setFromSphericalCoords(
        nucleusRadius + 0.005,
        theta,
        phi
      );
      const pore = new THREE.Mesh(poreGeo, mats.nuclearPore);
      pore.position.copy(pos);
      pore.lookAt(pos.clone().multiplyScalar(2));
      group.add(pore);
    }

    registerOrganelle('nuclear-envelope', group);
  }

  // 5. NUCLEOLUS (Dense granular subnuclear body)
  {
    const group = new THREE.Group();
    group.position.copy(nucleusCenter).add(new THREE.Vector3(-0.06, 0.04, -0.05));

    const mainSph = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 32, 24),
      mats.nucleolus
    );
    group.add(mainSph);

    const noduleGeo = new THREE.SphereGeometry(0.08, 16, 12);
    const noduleOffsets = [
      [0.14, 0.1, 0.08],
      [-0.12, 0.12, -0.06],
      [0.08, -0.14, 0.1],
      [-0.1, -0.1, 0.12],
      [0.15, -0.04, -0.1]
    ];
    noduleOffsets.forEach(([x, y, z]) => {
      const nod = new THREE.Mesh(noduleGeo, mats.nucleolus);
      nod.position.set(x, y, z);
      group.add(nod);
    });

    registerOrganelle('nucleolus', group);
  }

  // 6. CHROMATIN (3D looping interphase fiber territories inside nucleus)
  {
    const group = new THREE.Group();
    group.position.copy(nucleusCenter);

    for (let c = 0; c < 7; c++) {
      const points = [];
      const baseAngle = (c / 7) * Math.PI * 1.4 + Math.PI * 0.55;
      for (let s = 0; s <= 14; s++) {
        const t = s / 14;
        const r = 0.34 + 0.26 * Math.sin(t * Math.PI * 3 + c);
        const theta = 0.35 + t * (Math.PI - 0.7) + 0.18 * Math.cos(s * 1.3 + c);
        const phi = baseAngle + 0.45 * Math.sin(s * 0.9 + c);
        points.push(new THREE.Vector3().setFromSphericalCoords(r, theta, phi));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.022, 8, false);
      const strand = new THREE.Mesh(tubeGeo, mats.chromatin);
      group.add(strand);
    }

    registerOrganelle('chromatin', group);
  }

  // 7. ROUGH ENDOPLASMIC RETICULUM (Concentric cisternal sheets wrapping nucleus)
  const roughERRibosomeAnchors = [];
  {
    const group = new THREE.Group();
    group.position.copy(nucleusCenter);

    const shells = [0.92, 1.06, 1.2, 1.34];
    shells.forEach((radius, idx) => {
      const phiStart = Math.PI * (0.62 + idx * 0.04);
      const phiLength = Math.PI * (1.05 - idx * 0.08);
      const thetaStart = Math.PI * 0.22;
      const thetaLength = Math.PI * 0.56;

      const outerCisterna = new THREE.Mesh(
        new THREE.SphereGeometry(
          radius + 0.025,
          36,
          24,
          phiStart,
          phiLength,
          thetaStart,
          thetaLength
        ),
        mats.roughER
      );
      const innerCisterna = new THREE.Mesh(
        new THREE.SphereGeometry(
          radius - 0.025,
          36,
          24,
          phiStart,
          phiLength,
          thetaStart,
          thetaLength
        ),
        mats.roughER
      );
      group.add(outerCisterna, innerCisterna);

      const edgeSteps = 20;
      const topCurvePts = [];
      const botCurvePts = [];
      for (let i = 0; i <= edgeSteps; i++) {
        const p = phiStart + (i / edgeSteps) * phiLength;
        topCurvePts.push(
          new THREE.Vector3().setFromSphericalCoords(radius, thetaStart, p)
        );
        botCurvePts.push(
          new THREE.Vector3().setFromSphericalCoords(
            radius,
            thetaStart + thetaLength,
            p
          )
        );
      }
      group.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(topCurvePts),
            24,
            0.03,
            8,
            false
          ),
          mats.roughER
        ),
        new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(botCurvePts),
            24,
            0.03,
            8,
            false
          ),
          mats.roughER
        )
      );

      const riboRows = 5;
      const riboCols = 10;
      for (let r = 1; r < riboRows; r++) {
        for (let c = 1; c < riboCols; c++) {
          const th = thetaStart + (r / riboRows) * thetaLength;
          const ph = phiStart + (c / riboCols) * phiLength;
          const localPos = new THREE.Vector3().setFromSphericalCoords(
            radius + 0.042,
            th,
            ph
          );
          roughERRibosomeAnchors.push(localPos.add(nucleusCenter));
        }
      }
    });

    registerOrganelle('rough-er', group);
  }

  // 8. SMOOTH ENDOPLASMIC RETICULUM (Branching tubular network)
  {
    const group = new THREE.Group();
    const serCenter = new THREE.Vector3(-1.25, -0.25, 0.55);
    group.position.copy(serCenter);

    const branchPaths = [
      [
        [0.15, 0.25, -0.35],
        [0.0, 0.1, -0.1],
        [-0.2, -0.05, 0.15],
        [-0.35, -0.2, 0.35]
      ],
      [
        [0.0, 0.1, -0.1],
        [0.2, -0.1, 0.1],
        [0.35, -0.25, 0.3],
        [0.2, -0.4, 0.45]
      ],
      [
        [-0.2, -0.05, 0.15],
        [-0.05, -0.25, 0.3],
        [0.15, -0.3, 0.15],
        [0.3, -0.15, -0.1]
      ],
      [
        [0.15, 0.25, -0.35],
        [-0.15, 0.32, -0.15],
        [-0.35, 0.15, 0.05],
        [-0.2, -0.05, 0.15]
      ],
      [
        [-0.15, 0.32, -0.15],
        [0.1, 0.35, 0.15],
        [0.25, 0.12, 0.32],
        [0.2, -0.1, 0.1]
      ]
    ];

    branchPaths.forEach((coords) => {
      const pts = coords.map(([x, y, z]) => new THREE.Vector3(x, y, z));
      const curve = new THREE.CatmullRomCurve3(pts);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.048, 10, false),
        mats.smoothER
      );
      group.add(tube);
    });

    registerOrganelle('smooth-er', group);
  }

  // 9. RIBOSOMES (ER-bound + cytosolic polyribosomes via InstancedMesh + proxy)
  {
    const group = new THREE.Group();
    const allRibosomePositions = [...roughERRibosomeAnchors];

    const clusterCenters = [
      new THREE.Vector3(0.4, -0.75, 0.65),
      new THREE.Vector3(-0.65, -0.9, -0.45),
      new THREE.Vector3(0.85, 0.55, -0.65),
      new THREE.Vector3(-0.2, -1.15, 0.35),
      new THREE.Vector3(0.25, 1.05, -0.45)
    ];

    clusterCenters.forEach((center) => {
      for (let k = 0; k < 14; k++) {
        const angle = k * 0.65;
        const rad = 0.04 + k * 0.012;
        allRibosomePositions.push(
          new THREE.Vector3(
            center.x + Math.cos(angle) * rad,
            center.y + (k - 7) * 0.018,
            center.z + Math.sin(angle) * rad
          )
        );
      }

      const proxy = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 8),
        mats.proxyInvisible
      );
      proxy.position.copy(center);
      group.add(proxy);
    });

    const riboGeo = new THREE.SphereGeometry(0.022, 8, 6);
    const instancedRibosomes = new THREE.InstancedMesh(
      riboGeo,
      mats.ribosome,
      allRibosomePositions.length
    );
    const dummy = new THREE.Object3D();
    allRibosomePositions.forEach((pos, idx) => {
      dummy.position.copy(pos);
      dummy.scale.set(1.0, 1.25, 1.0);
      dummy.updateMatrix();
      instancedRibosomes.setMatrixAt(idx, dummy.matrix);
    });
    instancedRibosomes.instanceMatrix.needsUpdate = true;
    group.add(instancedRibosomes);

    registerOrganelle('ribosomes', group);
  }

  // 10. GOLGI APPARATUS (Stacked curved cisternae with swollen rims)
  {
    const group = new THREE.Group();
    group.position.set(0.72, -0.28, 0.58);
    group.rotation.set(0.35, -0.65, 0.2);

    const cisternaCount = 6;
    for (let i = 0; i < cisternaCount; i++) {
      const offsetZ = (i - (cisternaCount - 1) / 2) * 0.085;
      const arcRadius = 0.32 + i * 0.035;
      const arcSpan = Math.PI * (0.72 - i * 0.03);

      const rimGeo = new THREE.TorusGeometry(
        arcRadius,
        0.032,
        12,
        36,
        arcSpan
      );
      const rimMesh = new THREE.Mesh(rimGeo, mats.golgi);
      rimMesh.rotation.z = (Math.PI - arcSpan) / 2;
      rimMesh.position.z = offsetZ;
      group.add(rimMesh);

      const webGeo = new THREE.CylinderGeometry(
        arcRadius,
        arcRadius,
        0.022,
        32,
        1,
        false,
        (Math.PI - arcSpan) / 2,
        arcSpan
      );
      const webMesh = new THREE.Mesh(webGeo, mats.golgi);
      webMesh.rotation.x = Math.PI / 2;
      webMesh.position.z = offsetZ;
      group.add(webMesh);
    }

    registerOrganelle('golgi-apparatus', group);
  }

  // 11. MITOCHONDRIA WITH INNER CRISTAE
  {
    const group = new THREE.Group();
    const mitoSpecs = [
      {
        pos: [1.18, 0.25, -0.45],
        rot: [0.4, 0.3, -0.5],
        scale: 1.0,
        cutaway: true
      },
      {
        pos: [-0.45, -1.12, 0.72],
        rot: [-0.3, 0.8, 0.4],
        scale: 0.95,
        cutaway: true
      },
      {
        pos: [0.15, -0.88, -1.15],
        rot: [0.2, -0.5, 1.1],
        scale: 0.9,
        cutaway: false
      },
      {
        pos: [-1.15, 0.82, 0.35],
        rot: [0.6, 0.2, 0.3],
        scale: 0.85,
        cutaway: false
      }
    ];

    mitoSpecs.forEach(({ pos, rot, scale, cutaway }) => {
      const mito = new THREE.Group();
      mito.position.set(...pos);
      mito.rotation.set(...rot);
      mito.scale.setScalar(scale);

      if (cutaway) {
        const halfCyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.19, 0.42, 24, 1, false, 0, Math.PI),
          mats.mitoOuter
        );
        const topCap = new THREE.Mesh(
          new THREE.SphereGeometry(0.19, 24, 16, 0, Math.PI, 0, Math.PI / 2),
          mats.mitoOuter
        );
        topCap.position.y = 0.21;
        const botCap = new THREE.Mesh(
          new THREE.SphereGeometry(
            0.19,
            24,
            16,
            0,
            Math.PI,
            Math.PI / 2,
            Math.PI / 2
          ),
          mats.mitoOuter
        );
        botCap.position.y = -0.21;
        mito.add(halfCyl, topCap, botCap);

        const innerBed = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.16, 0.4, 20, 1, false, 0, Math.PI),
          mats.mitoInnerMatrix
        );
        mito.add(innerBed);

        for (let c = -3; c <= 3; c++) {
          const crista = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.022, 0.13),
            mats.mitoCristae
          );
          crista.position.set((c % 2 === 0 ? 1 : -1) * 0.02, c * 0.055, -0.04);
          crista.rotation.z = (c % 2 === 0 ? 1 : -1) * 0.12;
          mito.add(crista);
        }
      } else {
        const fullMito = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.18, 0.4, 16, 24),
          mats.mitoOuter
        );
        mito.add(fullMito);
      }

      group.add(mito);
    });

    registerOrganelle('mitochondria', group);
  }

  // 12. LYSOSOMES (Acidic spherical organelles, one with cutaway hydrolase core)
  {
    const group = new THREE.Group();
    const lysoPositions = [
      { pos: [0.95, -0.82, 0.18], radius: 0.18, cutaway: true },
      { pos: [-0.85, -0.68, -0.88], radius: 0.15, cutaway: false },
      { pos: [0.55, 0.92, 0.35], radius: 0.14, cutaway: false },
      { pos: [-0.15, -1.35, -0.25], radius: 0.15, cutaway: false }
    ];

    lysoPositions.forEach(({ pos, radius, cutaway }) => {
      const lyso = new THREE.Group();
      lyso.position.set(...pos);

      if (cutaway) {
        const shell = new THREE.Mesh(
          new THREE.SphereGeometry(
            radius,
            28,
            20,
            Math.PI * 0.35,
            Math.PI * 1.65
          ),
          mats.lysosomeOuter
        );
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 0.78, 24, 16),
          mats.lysosomeCore
        );
        lyso.add(shell, core);
      } else {
        lyso.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(radius, 24, 18),
            mats.lysosomeOuter
          )
        );
      }

      group.add(lyso);
    });

    registerOrganelle('lysosomes', group);
  }

  // 13. VESICLES (Secretory & transport vesicles budding from ER/Golgi toward cortex)
  {
    const group = new THREE.Group();
    const vesicleCoords = [
      [0.45, -0.15, 0.38],
      [0.58, -0.05, 0.52],
      [0.88, -0.35, 0.85],
      [1.05, -0.42, 0.98],
      [1.22, -0.28, 1.12],
      [1.42, -0.18, 1.05],
      [0.62, -0.55, 0.72],
      [0.95, -0.12, 0.65],
      [-0.55, -0.35, 0.65],
      [-0.75, -0.45, 0.82],
      [0.25, 0.45, 0.85],
      [1.35, 0.45, 0.42],
      [0.75, 0.72, -0.25],
      [-0.95, 0.15, 0.95]
    ];

    const vesGeo = new THREE.SphereGeometry(0.055, 16, 12);
    vesicleCoords.forEach(([x, y, z], idx) => {
      const mesh = new THREE.Mesh(vesGeo, mats.vesicle);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(0.85 + (idx % 3) * 0.15);
      group.add(mesh);
    });

    registerOrganelle('vesicles', group);
  }

  // 14. PEROXISOMES (Translucent green spheres with crystalline urate oxidase cores)
  {
    const group = new THREE.Group();
    const peroxCoords = [
      [-0.92, -0.82, 0.15],
      [1.15, -0.48, -0.68],
      [0.35, 1.12, -0.55],
      [-0.65, 0.98, -0.65]
    ];

    peroxCoords.forEach(([x, y, z]) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(x, y, z);

      const outer = new THREE.Mesh(
        new THREE.SphereGeometry(0.145, 24, 18),
        mats.peroxisomeOuter
      );
      const crystalCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.085, 0),
        mats.peroxisomeCore
      );
      crystalCore.rotation.set(0.4, 0.6, 0.2);
      pGroup.add(outer, crystalCore);
      group.add(pGroup);
    });

    registerOrganelle('peroxisomes', group);
  }

  // 15. CENTROSOME (Orthogonal mother & daughter centriole barrels + PCM halo)
  const centrosomePos = new THREE.Vector3(0.58, 0.42, 0.18);
  {
    const group = new THREE.Group();
    group.position.copy(centrosomePos);

    function createCentrioleBarrel() {
      const barrel = new THREE.Group();
      const tubuleGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.22, 8);
      for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * Math.PI * 2;
        const r = 0.058;
        const t = new THREE.Mesh(tubuleGeo, mats.centrioleTubule);
        t.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        barrel.add(t);
      }
      return barrel;
    }

    const motherCentriole = createCentrioleBarrel();
    motherCentriole.position.set(-0.06, 0.02, 0);
    motherCentriole.rotation.set(0.3, 0.2, 0.4);

    const daughterCentriole = createCentrioleBarrel();
    daughterCentriole.position.set(0.08, -0.04, 0.05);
    daughterCentriole.rotation.set(1.8, -0.3, 0.9);

    const pcmHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 16),
      mats.centrosomeMatrix
    );

    group.add(motherCentriole, daughterCentriole, pcmHalo);
    registerOrganelle('centrosome', group);
  }

  // 16. MICROTUBULES (Radial tracks originating from the centrosome MTOC)
  {
    const group = new THREE.Group();
    const endpoints = [
      [1.75, 0.85, 0.45],
      [1.82, -0.15, 0.65],
      [1.55, -0.95, 0.25],
      [1.35, 0.55, -1.15],
      [0.85, -1.45, -0.65],
      [0.15, 1.65, 0.55],
      [-0.45, 1.55, -0.85],
      [-1.35, 1.15, 0.25],
      [-1.55, -0.65, -0.75],
      [0.35, -1.65, 0.65]
    ];

    endpoints.forEach(([ex, ey, ez], idx) => {
      const end = new THREE.Vector3(ex, ey, ez);
      const mid = centrosomePos
        .clone()
        .lerp(end, 0.5)
        .add(
          new THREE.Vector3(
            Math.sin(idx * 2.1) * 0.18,
            Math.cos(idx * 1.7) * 0.18,
            Math.sin(idx * 1.3) * 0.18
          )
        );
      const curve = new THREE.CatmullRomCurve3([
        centrosomePos.clone(),
        mid,
        end
      ]);
      const mtMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.012, 6, false),
        mats.microtubule
      );
      group.add(mtMesh);
    });

    registerOrganelle('microtubules', group);
  }

  // 17. ACTIN FILAMENTS (Cortical microfilament meshwork along inner cell cortex)
  {
    const group = new THREE.Group();
    const cortexRadius = CELL_RADIUS - 0.11;

    for (let a = 0; a < 14; a++) {
      const phi1 = CUT_PHI_START + 0.12 + ((a * 0.37) % (CUT_PHI_LENGTH - 0.3));
      const phi2 = Math.min(
        CUT_PHI_START + CUT_PHI_LENGTH - 0.12,
        phi1 + 0.45 + (a % 3) * 0.15
      );
      const theta1 = 0.35 + ((a * 0.43) % (Math.PI - 0.7));
      const theta2 = Math.max(
        0.3,
        Math.min(Math.PI - 0.3, theta1 + (a % 2 === 0 ? 0.38 : -0.38))
      );

      const pts = [];
      for (let s = 0; s <= 8; s++) {
        const t = s / 8;
        const th = THREE.MathUtils.lerp(theta1, theta2, t);
        const ph = THREE.MathUtils.lerp(phi1, phi2, t);
        pts.push(
          new THREE.Vector3().setFromSphericalCoords(cortexRadius, th, ph)
        );
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const actinMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 16, 0.009, 6, false),
        mats.actinFilament
      );
      group.add(actinMesh);
    }

    registerOrganelle('actin-filaments', group);
  }

  // 18. INTERMEDIATE FILAMENTS (Wavy perinuclear cage & trans-cytoplasmic ropes)
  {
    const group = new THREE.Group();
    for (let f = 0; f < 9; f++) {
      const angle = CUT_PHI_START + 0.25 + (f / 9) * (CUT_PHI_LENGTH - 0.5);
      const polar = 0.45 + ((f * 0.52) % (Math.PI - 0.9));

      const start = new THREE.Vector3()
        .setFromSphericalCoords(nucleusRadius + 0.08, polar, angle)
        .add(nucleusCenter);
      const end = new THREE.Vector3().setFromSphericalCoords(
        CELL_RADIUS - 0.14,
        polar + (f % 2 === 0 ? 0.2 : -0.2),
        angle + 0.15
      );

      const pts = [];
      for (let s = 0; s <= 10; s++) {
        const t = s / 10;
        const pt = start.clone().lerp(end, t);
        pt.x += Math.sin(t * Math.PI * 2 + f) * 0.06;
        pt.y += Math.cos(t * Math.PI * 2 + f) * 0.06;
        pts.push(pt);
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const ifMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.01, 6, false),
        mats.intermediateFilament
      );
      group.add(ifMesh);
    }

    registerOrganelle('intermediate-filaments', group);
  }

  return {
    root,
    organelleGroups,
    selectableMeshes,
    setOrganelleVisible(id, visible) {
      const target = organelleGroups.get(id);
      if (target) {
        target.visible = Boolean(visible);
      }
    },
    setAllVisible(visible) {
      const flag = Boolean(visible);
      organelleGroups.forEach((group) => {
        group.visible = flag;
      });
    },
    getOrganelleObject(id) {
      return organelleGroups.get(id) || null;
    }
  };
}