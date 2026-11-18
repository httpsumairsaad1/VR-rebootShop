/**
 * Procedural device models for Reboot Shop VR: Gadget Repair.
 *
 * Tier 1-2 devices built as clean, recognizable Three.js primitives.
 * All prototypes are parentless Object3D instances for the asset manifest.
 * Import Three.js core APIs from @iwsdk/core; addons use their module paths.
 */

import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from '@iwsdk/core';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  mat,
  metal,
  techDark,
  techLight,
  glass,
  screenOff,
  screenOn,
  plasticWhite,
  plasticBlack,
  rubber,
  gold,
  copper,
  green,
  red,
  orange,
  blue,
} from './materials.js';

// ============================================================================
// MATERIALS
// ============================================================================

const deviceBody = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.3,
  metalness: 0.1,
});

const deviceBodyLight = new MeshStandardMaterial({
  color: 0x2d2d44,
  roughness: 0.35,
  metalness: 0.15,
});

const deviceBodyWhite = new MeshStandardMaterial({
  color: 0xf0f0f0,
  roughness: 0.4,
  metalness: 0.05,
});

const deviceBodyMatte = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.7,
  metalness: 0.0,
});

const glassScreen = new MeshStandardMaterial({
  color: 0x0a0a1a,
  roughness: 0.05,
  metalness: 0.9,
  transmission: 0.95,
  thickness: 0.001,
  ior: 1.5,
  envMapIntensity: 1.5,
});

const cameraLens = new MeshStandardMaterial({
  color: 0x0a0a1a,
  roughness: 0.02,
  metalness: 0.95,
  transmission: 0.98,
  thickness: 0.003,
  ior: 1.6,
});

const buttonMat = new MeshStandardMaterial({
  color: 0x2a2a3e,
  roughness: 0.4,
  metalness: 0.2,
});

const buttonMatLight = new MeshStandardMaterial({
  color: 0x3d3d5a,
  roughness: 0.4,
  metalness: 0.2,
});

const portMat = new MeshStandardMaterial({
  color: 0x151525,
  roughness: 0.2,
  metalness: 0.8,
});

const speakerGrille = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.8,
  metalness: 0.0,
});

const speakerGrilleLight = new MeshStandardMaterial({
  color: 0x2d2d44,
  roughness: 0.8,
  metalness: 0.0,
});

const hingeMat = new MeshStandardMaterial({
  color: 0x3a3a4a,
  roughness: 0.3,
  metalness: 0.6,
});

const stickMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.5,
  metalness: 0.1,
});

const stickCapMat = new MeshStandardMaterial({
  color: 0x0d0d1a,
  roughness: 0.6,
  metalness: 0.0,
});

const triggerMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.35,
  metalness: 0.2,
});

const dpadMat = new MeshStandardMaterial({
  color: 0x2a2a3e,
  roughness: 0.4,
  metalness: 0.1,
});

const faceButtonMat = [
  new MeshStandardMaterial({ color: 0x00d4aa, roughness: 0.3, metalness: 0.1, emissive: 0x00d4aa, emissiveIntensity: 0.1 }), // A - green
  new MeshStandardMaterial({ color: 0xff3b30, roughness: 0.3, metalness: 0.1, emissive: 0xff3b30, emissiveIntensity: 0.1 }), // B - red
  new MeshStandardMaterial({ color: 0x007aff, roughness: 0.3, metalness: 0.1, emissive: 0x007aff, emissiveIntensity: 0.1 }), // X - blue
  new MeshStandardMaterial({ color: 0xffcc00, roughness: 0.3, metalness: 0.1, emissive: 0xffcc00, emissiveIntensity: 0.1 }), // Y - yellow
];

const shoulderMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.3,
  metalness: 0.2,
});

const headbandMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.4,
  metalness: 0.1,
});

const earCupMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.35,
  metalness: 0.15,
});

const earPadMat = new MeshStandardMaterial({
  color: 0x151525,
  roughness: 0.9,
  metalness: 0.0,
});

const earPadMatLight = new MeshStandardMaterial({
  color: 0x252535,
  roughness: 0.9,
  metalness: 0.0,
});

const micMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.2,
  metalness: 0.7,
});

const watchCaseMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.3,
  metalness: 0.2,
});

const watchCaseMatSilver = new MeshStandardMaterial({
  color: 0xc0c0c0,
  roughness: 0.35,
  metalness: 0.5,
});

const strapMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.8,
  metalness: 0.0,
});

const strapMatBrown = new MeshStandardMaterial({
  color: 0x3d2a1a,
  roughness: 0.85,
  metalness: 0.0,
});

const speakerBodyMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.4,
  metalness: 0.1,
});

const speakerGrilleMat = new MeshStandardMaterial({
  color: 0x2a2a3e,
  roughness: 0.7,
  metalness: 0.0,
});

const droneBodyMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.35,
  metalness: 0.15,
});

const propMat = new MeshStandardMaterial({
  color: 0x0d0d1a,
  roughness: 0.2,
  metalness: 0.1,
  side: 2,
});

const motorMat = new MeshStandardMaterial({
  color: 0x2a2a3e,
  roughness: 0.3,
  metalness: 0.4,
});

const cameraBodyMat = new MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.35,
  metalness: 0.15,
});

const lensBarrelMat = new MeshStandardMaterial({
  color: 0x0d0d1a,
  roughness: 0.25,
  metalness: 0.3,
});

const screenOnMat = new MeshStandardMaterial({
  color: 0x0a1a0a,
  roughness: 0.1,
  metalness: 0.8,
  emissive: 0x0a3a0a,
  emissiveIntensity: 0.3,
});

const screenOffMat = new MeshStandardMaterial({
  color: 0x0a0a1a,
  roughness: 0.1,
  metalness: 0.9,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function addMesh(
  parent: Group,
  geometry: BufferGeometry,
  material: MeshStandardMaterial,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0,
  sx = 1,
  sy = 1,
  sz = 1
): Mesh {
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(sx, sy, sz);
  parent.add(mesh);
  return mesh;
}

function createRoundedBox(
  parent: Group,
  width: number,
  height: number,
  depth: number,
  radius: number,
  material: MeshStandardMaterial,
  x = 0,
  y = 0,
  z = 0
): Mesh {
  return addMesh(parent, new RoundedBoxGeometry(width, height, depth, radius, 4), material, x, y, z);
}

function createCylinder(
  parent: Group,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  material: MeshStandardMaterial,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
): Mesh {
  return addMesh(parent, new CylinderGeometry(radiusTop, radiusBottom, height, 24), material, x, y, z, rx, ry, rz);
}

function createSphere(
  parent: Group,
  radius: number,
  material: MeshStandardMaterial,
  x = 0,
  y = 0,
  z = 0
): Mesh {
  return addMesh(parent, new SphereGeometry(radius, 16, 16), material, x, y, z);
}

function createBox(
  parent: Group,
  width: number,
  height: number,
  depth: number,
  material: MeshStandardMaterial,
  x = 0,
  y = 0,
  z = 0
): Mesh {
  return addMesh(parent, new BoxGeometry(width, height, depth), material, x, y, z);
}

// ============================================================================
// SMARTPHONES
// ============================================================================

/** Standard smartphone (Tier 1) */
export function createSmartphone(): Group {
  const root = new Group();
  const w = 0.07, h = 0.145, d = 0.008;
  const r = 0.01;

  // Main body
  createRoundedBox(root, w, h, d, r, deviceBody);

  // Screen (slightly recessed)
  addMesh(root, new RoundedBoxGeometry(w - 0.014, h - 0.024, 0.001, r - 0.002, 4), glassScreen, 0, 0, d / 2 + 0.0005);

  // Front camera cutout (top center)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.002, 12), cameraLens, 0, h / 2 - 0.012, d / 2 + 0.001);

  // Earpiece (thin slit)
  addMesh(root, new BoxGeometry(0.03, 0.002, 0.001), speakerGrille, 0, h / 2 - 0.006, d / 2 + 0.0005);

  // Power button (right side)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.03, 0.006, 0.0015, 4), buttonMat, w / 2 + 0.0015, 0.02, 0, 0, 0, Math.PI / 2);

  // Volume buttons (left side)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.02, 0.005, 0.0015, 4), buttonMat, -w / 2 - 0.0015, 0.035, 0, 0, 0, Math.PI / 2);
  addMesh(root, new RoundedBoxGeometry(0.003, 0.02, 0.005, 0.0015, 4), buttonMat, -w / 2 - 0.0015, -0.035, 0, 0, 0, Math.PI / 2);

  // USB-C port (bottom)
  addMesh(root, new RoundedBoxGeometry(0.012, 0.004, 0.006, 0.002, 4), portMat, 0, -h / 2 + 0.006, 0, 0, 0, Math.PI / 2);

  // Speaker grille (bottom)
  addMesh(root, new BoxGeometry(0.025, 0.001, 0.004), speakerGrille, -0.018, -h / 2 + 0.002, d / 2 + 0.0005);
  addMesh(root, new BoxGeometry(0.025, 0.001, 0.004), speakerGrille, 0.018, -h / 2 + 0.002, d / 2 + 0.0005);

  // Rear camera bump
  const camBump = new Group();
  camBump.position.set(0.018, h / 2 - 0.02, d / 2 + 0.002);
  createRoundedBox(camBump, 0.022, 0.022, 0.003, 0.004, deviceBody, 0, 0, 0);
  addMesh(camBump, new CylinderGeometry(0.006, 0.006, 0.004, 16), cameraLens, 0, 0, 0.002);
  addMesh(camBump, new CylinderGeometry(0.0035, 0.0035, 0.003, 12), cameraLens, -0.007, 0.007, 0.002);
  root.add(camBump);

  // Flash
  addMesh(camBump, new CylinderGeometry(0.002, 0.002, 0.002, 8), gold, 0.007, -0.007, 0.003);

  root.position.y = h / 2;
  return root;
}

/** Premium smartphone with glass back (Tier 2) */
export function createSmartphonePremium(): Group {
  const root = new Group();
  const w = 0.075, h = 0.155, d = 0.0085;
  const r = 0.012;

  // Glass back (slightly larger than body)
  createRoundedBox(root, w + 0.001, h + 0.001, d + 0.0005, r, glass, 0, 0, -0.00025);

  // Metal frame
  const frame = new Group();
  createRoundedBox(frame, w, h, d, r, metal);
  // Cut out front for screen
  addMesh(frame, new RoundedBoxGeometry(w - 0.002, h - 0.002, d + 0.001, r - 0.001, 4), new MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0 }), 0, 0, 0);
  root.add(frame);

  // Screen
  addMesh(root, new RoundedBoxGeometry(w - 0.016, h - 0.026, 0.001, r - 0.003, 4), glassScreen, 0, 0, d / 2 + 0.0005);

  // Dynamic Island area (pill cutout)
  const island = new Group();
  island.position.set(0, h / 2 - 0.018, d / 2 + 0.001);
  addMesh(island, new RoundedBoxGeometry(0.028, 0.009, 0.002, 0.0045, 4), cameraLens);
  addMesh(island, new CylinderGeometry(0.0025, 0.0025, 0.002, 12), cameraLens, -0.007, 0, 0.001);
  addMesh(island, new CylinderGeometry(0.002, 0.002, 0.002, 10), cameraLens, 0.007, 0, 0.001);
  root.add(island);

  // Earpiece (invisible, part of island)
  addMesh(root, new BoxGeometry(0.035, 0.0015, 0.001), speakerGrille, 0, h / 2 - 0.004, d / 2 + 0.0005);

  // Power button (right)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.035, 0.006, 0.0015, 4), buttonMat, w / 2 + 0.0015, 0.025, 0, 0, 0, Math.PI / 2);

  // Volume buttons (left, separate)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.022, 0.005, 0.0015, 4), buttonMat, -w / 2 - 0.0015, 0.04, 0, 0, 0, Math.PI / 2);
  addMesh(root, new RoundedBoxGeometry(0.003, 0.022, 0.005, 0.0015, 4), buttonMat, -w / 2 - 0.0015, -0.04, 0, 0, 0, Math.PI / 2);

  // Action button (above volume)
  addMesh(root, new CylinderGeometry(0.004, 0.004, 0.005, 16), buttonMat, -w / 2 - 0.0025, 0.075, 0, Math.PI / 2);

  // USB-C (bottom)
  addMesh(root, new RoundedBoxGeometry(0.013, 0.004, 0.006, 0.002, 4), portMat, 0, -h / 2 + 0.006, 0, 0, 0, Math.PI / 2);

  // Speaker grilles (bottom)
  for (const x of [-0.02, 0.02]) {
    addMesh(root, new BoxGeometry(0.028, 0.001, 0.004), speakerGrille, x, -h / 2 + 0.002, d / 2 + 0.0005);
  }

  // Rear camera system (triple + LiDAR)
  const camSystem = new Group();
  camSystem.position.set(0.022, h / 2 - 0.025, d / 2 + 0.003);
  createRoundedBox(camSystem, 0.032, 0.038, 0.004, 0.005, deviceBody);
  // Main
  addMesh(camSystem, new CylinderGeometry(0.008, 0.008, 0.005, 16), cameraLens, -0.01, 0.01, 0.003);
  // Ultra-wide
  addMesh(camSystem, new CylinderGeometry(0.006, 0.006, 0.004, 14), cameraLens, 0.01, 0.01, 0.003);
  // Telephoto
  addMesh(camSystem, new CylinderGeometry(0.0055, 0.0055, 0.006, 14), lensBarrelMat, 0, -0.01, 0.004);
  // LiDAR
  addMesh(camSystem, new CylinderGeometry(0.004, 0.004, 0.003, 12), gold, 0.01, -0.01, 0.002);
  // Flash
  addMesh(camSystem, new CylinderGeometry(0.0025, 0.0025, 0.002, 8), gold, -0.01, -0.01, 0.003);
  root.add(camSystem);

  // MagSafe ring (subtle)
  const magsafe = new Group();
  magsafe.position.set(0, 0, -d / 2 - 0.0005);
  const ringGeo = new RingGeometry(0.028, 0.032, 32);
  addMesh(magsafe, ringGeo, new MeshStandardMaterial({ color: 0x8888aa, roughness: 0.5, metalness: 0.3, side: 2 }), 0, 0, 0, -Math.PI / 2);
  root.add(magsafe);

  root.position.y = h / 2;
  return root;
}

/** Budget smartphone with plastic back (Tier 1) */
export function createBudgetPhone(): Group {
  const root = new Group();
  const w = 0.078, h = 0.158, d = 0.0095;
  const r = 0.008;

  // Plastic body
  createRoundedBox(root, w, h, d, r, deviceBodyMatte);

  // Screen (thicker bezel)
  addMesh(root, new RoundedBoxGeometry(w - 0.02, h - 0.03, 0.001, r - 0.002, 4), screenOffMat, 0, 0, d / 2 + 0.0005);

  // Front camera
  addMesh(root, new CylinderGeometry(0.0025, 0.0025, 0.002, 10), cameraLens, 0, h / 2 - 0.01, d / 2 + 0.001);

  // Earpiece
  addMesh(root, new BoxGeometry(0.025, 0.002, 0.001), speakerGrille, 0, h / 2 - 0.005, d / 2 + 0.0005);

  // Power button (right)
  addMesh(root, new RoundedBoxGeometry(0.0035, 0.03, 0.006, 0.002, 4), buttonMatLight, w / 2 + 0.0017, 0.02, 0, 0, 0, Math.PI / 2);

  // Volume rocker (left, single piece)
  addMesh(root, new RoundedBoxGeometry(0.0035, 0.05, 0.006, 0.002, 4), buttonMatLight, -w / 2 - 0.0017, 0, 0, 0, 0, Math.PI / 2);

  // Micro-USB port (bottom, wider)
  addMesh(root, new BoxGeometry(0.014, 0.005, 0.006), portMat, 0, -h / 2 + 0.006, 0, 0, 0, Math.PI / 2);

  // 3.5mm jack (top)
  addMesh(root, new CylinderGeometry(0.0035, 0.0035, 0.006, 16), portMat, 0, h / 2 - 0.003, 0, Math.PI / 2);

  // Speaker (bottom, single)
  addMesh(root, new BoxGeometry(0.03, 0.0015, 0.004), speakerGrille, 0, -h / 2 + 0.002, d / 2 + 0.0005);

  // Rear camera (single)
  addMesh(root, new CylinderGeometry(0.007, 0.007, 0.004, 14), cameraLens, 0.018, h / 2 - 0.02, d / 2 + 0.003);
  // Flash
  addMesh(root, new CylinderGeometry(0.002, 0.002, 0.002, 8), gold, 0.025, h / 2 - 0.02, d / 2 + 0.004);

  // Fingerprint sensor (back, center)
  addMesh(root, new CircleGeometry(0.009, 24), new MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.3, metalness: 0.4 }), 0, -0.01, -d / 2 - 0.0001, -Math.PI / 2);

  root.position.y = h / 2;
  return root;
}

/** Flip phone (Tier 1) */
export function createFlipPhone(): Group {
  const root = new Group();
  // Closed dimensions
  const w = 0.052, h = 0.105, d = 0.018;
  const r = 0.006;

  // Bottom half (hinge at top)
  const bottom = new Group();
  createRoundedBox(bottom, w, h, d, r, deviceBody);
  // Keypad area
  const keyRows = 4, keyCols = 3;
  const keyW = 0.01, keyH = 0.01, keyD = 0.0015;
  const startX = -(keyCols - 1) * (keyW + 0.002) / 2;
  const startY = -0.015;
  for (let row = 0; row < keyRows; row++) {
    for (let col = 0; col < keyCols; col++) {
      const label = row === 3 && col === 1 ? '0' : row * 3 + col + 1 + '';
      addMesh(bottom, new RoundedBoxGeometry(keyW, keyH, keyD, 0.0015, 4), buttonMatLight, startX + col * (keyW + 0.002), startY + row * (keyH + 0.002), d / 2 + 0.001);
    }
  }
  // Navigation keys
  addMesh(bottom, new RoundedBoxGeometry(0.012, 0.012, 0.002, 0.002, 4), green, -0.015, 0.035, d / 2 + 0.001);
  addMesh(bottom, new RoundedBoxGeometry(0.012, 0.012, 0.002, 0.002, 4), red, 0.015, 0.035, d / 2 + 0.001);
  // Microphone
  addMesh(bottom, new CylinderGeometry(0.0015, 0.0015, 0.002, 8), micMat, 0, -h / 2 + 0.003, d / 2 + 0.001);
  // USB port
  addMesh(bottom, new RoundedBoxGeometry(0.012, 0.004, 0.005, 0.002, 4), portMat, 0, -h / 2 + 0.005, 0, 0, 0, Math.PI / 2);
  bottom.position.y = -h / 2;

  // Top half (screen + external display)
  const top = new Group();
  createRoundedBox(top, w, h, d, r, deviceBody);
  // Main screen (internal)
  addMesh(top, new RoundedBoxGeometry(w - 0.01, h - 0.01, 0.001, r - 0.002, 4), glassScreen, 0, 0, d / 2 + 0.0005);
  // Earpiece
  addMesh(top, new BoxGeometry(0.025, 0.002, 0.001), speakerGrille, 0, h / 2 - 0.006, d / 2 + 0.0005);
  // Front camera
  addMesh(top, new CylinderGeometry(0.002, 0.002, 0.002, 10), cameraLens, 0, h / 2 - 0.012, d / 2 + 0.001);
  // External display (small, on outside)
  addMesh(top, new RoundedBoxGeometry(0.035, 0.025, 0.001, 0.004, 4), screenOffMat, 0, 0, -d / 2 - 0.0005);
  // Rear camera
  addMesh(top, new CylinderGeometry(0.006, 0.006, 0.003, 12), cameraLens, 0.012, h / 2 - 0.015, -d / 2 - 0.001);
  top.position.y = h / 2;

  // Hinge
  const hinge = new Group();
  for (let i = 0; i < 3; i++) {
    addMesh(hinge, new CylinderGeometry(0.005, 0.005, 0.002, 12), hingeMat, 0, 0, (i - 1) * 0.0045, Math.PI / 2);
  }
  hinge.position.y = 0;

  root.add(bottom, top, hinge);
  return root;
}

// ============================================================================
// CONTROLLERS
// ============================================================================

/** Standard gamepad (Tier 1) */
export function createGamepadStandard(): Group {
  const root = new Group();
  const w = 0.155, h = 0.06, d = 0.105;
  const gripL = 0.065;

  // Main body
  createRoundedBox(root, w, h, d, 0.015, deviceBody);
  // Grips
  createRoundedBox(root, 0.055, 0.05, gripL, 0.015, deviceBody, -0.055, -0.025, 0);
  createRoundedBox(root, 0.055, 0.05, gripL, 0.015, deviceBody, 0.055, -0.025, 0);

  // D-Pad (left)
  const dpad = new Group();
  dpad.position.set(-0.04, 0.022, 0);
  addMesh(dpad, new BoxGeometry(0.028, 0.003, 0.028), dpadMat); // base
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.022), dpadMat, 0, 0.0055, 0); // up
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.022), dpadMat, 0, -0.0055, 0); // down
  addMesh(dpad, new BoxGeometry(0.022, 0.008, 0.006), dpadMat, 0, 0, 0.0055); // right
  addMesh(dpad, new BoxGeometry(0.022, 0.008, 0.006), dpadMat, 0, 0, -0.0055); // left
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.006), dpadMat, 0, 0.0055, 0.0055);
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.006), dpadMat, 0, -0.0055, 0.0055);
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.006), dpadMat, 0, 0.0055, -0.0055);
  addMesh(dpad, new BoxGeometry(0.006, 0.008, 0.006), dpadMat, 0, -0.0055, -0.0055);
  root.add(dpad);

  // Left stick
  const lStick = new Group();
  lStick.position.set(-0.04, 0.03, 0.025);
  addMesh(lStick, new CylinderGeometry(0.018, 0.018, 0.008, 24), stickMat);
  addMesh(lStick, new CapsuleGeometry(0.014, 0.012, 12, 8), stickCapMat, 0, 0.01, 0);
  root.add(lStick);

  // Right stick
  const rStick = new Group();
  rStick.position.set(0.04, 0.03, -0.025);
  addMesh(rStick, new CylinderGeometry(0.018, 0.018, 0.008, 24), stickMat);
  addMesh(rStick, new CapsuleGeometry(0.014, 0.012, 12, 8), stickCapMat, 0, 0.01, 0);
  root.add(rStick);

  // Face buttons (right)
  const faceBtns = new Group();
  faceBtns.position.set(0.04, 0.03, -0.01);
  const btnR = 0.008;
  addMesh(faceBtns, new CylinderGeometry(btnR, btnR, 0.006, 16), faceButtonMat[0], 0, 0, -0.012); // A - bottom
  addMesh(faceBtns, new CylinderGeometry(btnR, btnR, 0.006, 16), faceButtonMat[1], 0.012, 0, 0); // B - right
  addMesh(faceBtns, new CylinderGeometry(btnR, btnR, 0.006, 16), faceButtonMat[2], -0.012, 0, 0); // X - left
  addMesh(faceBtns, new CylinderGeometry(btnR, btnR, 0.006, 16), faceButtonMat[3], 0, 0, 0.012); // Y - top
  root.add(faceBtns);

  // Start/Select/View
  addMesh(root, new RoundedBoxGeometry(0.018, 0.004, 0.008, 0.002, 4), buttonMat, -0.015, 0.028, 0.01);
  addMesh(root, new RoundedBoxGeometry(0.018, 0.004, 0.008, 0.002, 4), buttonMat, 0.015, 0.028, 0.01);
  addMesh(root, new RoundedBoxGeometry(0.012, 0.004, 0.006, 0.002, 4), buttonMat, 0, 0.028, 0.025);

  // Shoulder buttons
  addMesh(root, new RoundedBoxGeometry(0.035, 0.008, 0.025, 0.008, 4), shoulderMat, -0.055, 0.04, 0.035, -0.3);
  addMesh(root, new RoundedBoxGeometry(0.035, 0.008, 0.025, 0.008, 4), shoulderMat, 0.055, 0.04, 0.035, -0.3);

  // Triggers
  const lTrigger = new Group();
  lTrigger.position.set(-0.055, 0.04, 0.065);
  addMesh(lTrigger, new CapsuleGeometry(0.01, 0.025, 8, 8), triggerMat, 0, 0, 0, -0.4);
  root.add(lTrigger);

  const rTrigger = new Group();
  rTrigger.position.set(0.055, 0.04, 0.065);
  addMesh(rTrigger, new CapsuleGeometry(0.01, 0.025, 8, 8), triggerMat, 0, 0, 0, -0.4);
  root.add(rTrigger);

  // USB port (top center)
  addMesh(root, new RoundedBoxGeometry(0.012, 0.004, 0.006, 0.002, 4), portMat, 0, 0.038, 0.05, 0, 0, Math.PI / 2);

  // 3.5mm jack (bottom center)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, 0, 0.038, -0.05, 0, 0, Math.PI / 2);

  // Battery compartment (back)
  addMesh(root, new RoundedBoxGeometry(0.04, 0.003, 0.03, 0.002, 4), deviceBodyMatte, 0, -0.03, -0.01, Math.PI / 2);

  return root;
}

/** Pro gamepad (Tier 2) */
export function createGamepadPro(): Group {
  const root = new Group();
  const w = 0.165, h = 0.065, d = 0.11;
  const gripL = 0.07;

  // Main body
  createRoundedBox(root, w, h, d, 0.018, deviceBody);
  // Grips (more ergonomic)
  createRoundedBox(root, 0.06, 0.055, gripL, 0.02, deviceBody, -0.058, -0.028, 0);
  createRoundedBox(root, 0.06, 0.055, gripL, 0.02, deviceBody, 0.058, -0.028, 0);

  // D-Pad (premium, separate buttons)
  const dpad = new Group();
  dpad.position.set(-0.042, 0.025, 0);
  for (const [dx, dy, rot] of [[0, 0.012, 0], [0, -0.012, Math.PI], [0.012, 0, -Math.PI/2], [-0.012, 0, Math.PI/2]]) {
    addMesh(dpad, new RoundedBoxGeometry(0.007, 0.016, 0.006, 0.002, 4), dpadMat, dx, dy, 0, 0, 0, rot);
  }
  addMesh(dpad, new CylinderGeometry(0.006, 0.006, 0.004, 16), dpadMat, 0, 0, 0.005);
  root.add(dpad);

  // Hall effect sticks (taller base)
  for (const [x, z] of [[-0.042, 0.028], [0.042, -0.028]]) {
    const stick = new Group();
    stick.position.set(x, 0.032, z);
    addMesh(stick, new CylinderGeometry(0.02, 0.02, 0.01, 24), stickMat);
    addMesh(stick, new CapsuleGeometry(0.015, 0.014, 12, 8), stickCapMat, 0, 0.012, 0);
    root.add(stick);
  }

  // Mechanical face buttons
  const faceBtns = new Group();
  faceBtns.position.set(0.042, 0.032, -0.012);
  const btnR = 0.009;
  for (const [i, [dx, dz]] of [[0, [0, -0.014]], [1, [0.014, 0]], [2, [-0.014, 0]], [3, [0, 0.014]]].entries()) {
    const btn = new Group();
    btn.position.set(dx, 0, dz);
    addMesh(btn, new CylinderGeometry(btnR, btnR, 0.007, 16), faceButtonMat[i]);
    addMesh(btn, new CylinderGeometry(btnR * 0.6, btnR * 0.6, 0.003, 16), new MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 }), 0, 0, 0.005);
    faceBtns.add(btn);
  }
  root.add(faceBtns);

  // Shoulders (LB/RB)
  for (const x of [-0.06, 0.06]) {
    addMesh(root, new RoundedBoxGeometry(0.038, 0.008, 0.028, 0.008, 4), shoulderMat, x, 0.042, 0.038, -0.35);
  }

  // Triggers (LT/RT - adaptive)
  for (const [x, sign] of [[-0.06, -1], [0.06, 1]]) {
    const trigger = new Group();
    trigger.position.set(x, 0.042, 0.07);
    addMesh(trigger, new CapsuleGeometry(0.011, 0.028, 8, 8), triggerMat, 0, 0, 0, sign * -0.45);
    root.add(trigger);
  }

  // Back paddles
  for (const [x, z] of [[-0.04, -0.02], [0.04, -0.02]]) {
    addMesh(root, new RoundedBoxGeometry(0.018, 0.022, 0.005, 0.003, 4), shoulderMat, x, -0.015, z, 0.2);
  }

  // Home button
  addMesh(root, new CylinderGeometry(0.008, 0.008, 0.005, 20), buttonMat, 0, 0.03, 0.025);

  // USB-C + 3.5mm
  addMesh(root, new RoundedBoxGeometry(0.013, 0.004, 0.006, 0.002, 4), portMat, 0, 0.04, 0.055, 0, 0, Math.PI / 2);
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, 0, 0.04, -0.055, 0, 0, Math.PI / 2);

  return root;
}

/** Arcade Fight Stick (Tier 2) */
export function createFightStick(): Group {
  const root = new Group();
  const w = 0.22, h = 0.055, d = 0.16;

  // Case
  createRoundedBox(root, w, h, d, 0.01, deviceBodyMatte);
  // Metal top plate
  addMesh(root, new BoxGeometry(w - 0.02, 0.003, d - 0.02), metal, 0, h / 2 + 0.0015, 0);

  // Joystick (Sanwa-style, left)
  const joy = new Group();
  joy.position.set(-0.065, h / 2 + 0.045, 0);
  // Base
  addMesh(joy, new CylinderGeometry(0.028, 0.028, 0.01, 24), metal);
  // Shaft
  addMesh(joy, new CylinderGeometry(0.008, 0.008, 0.035, 16), metal, 0, 0.0225, 0);
  // Ball top
  addMesh(joy, new SphereGeometry(0.018, 16, 16), new MeshStandardMaterial({ color: 0xcc0000, roughness: 0.3, metalness: 0.1 }), 0, 0.05, 0);
  // Gate (square restrictor)
  addMesh(joy, new BoxGeometry(0.018, 0.002, 0.018), new MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.2 }), 0, 0.012, 0);
  root.add(joy);

  // 8 Arcade buttons (right, 2 rows of 4)
  const btnColors = [red, blue, orange, green, red, blue, orange, green];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const idx = row * 4 + col;
      const x = 0.02 + col * 0.032;
      const z = -0.02 + row * 0.032;
      const btn = new Group();
      btn.position.set(x, h / 2 + 0.03, z);
      addMesh(btn, new CylinderGeometry(0.015, 0.015, 0.012, 20), btnColors[idx]);
      addMesh(btn, new CylinderGeometry(0.01, 0.01, 0.005, 20), new MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 }), 0, 0, 0.0085);
      root.add(btn);
    }
  }

  // Start/Home buttons (top center)
  addMesh(root, new CylinderGeometry(0.008, 0.008, 0.005, 16), buttonMat, 0, h / 2 + 0.025, 0.045);
  addMesh(root, new CylinderGeometry(0.008, 0.008, 0.005, 16), buttonMat, 0, h / 2 + 0.025, 0.065);

  // USB cable (back)
  addMesh(root, new CapsuleGeometry(0.004, 0.12, 8, 8), rubber, 0, h / 2 - 0.01, -d / 2 - 0.06, Math.PI / 2);

  // Artwork area (top)
  addMesh(root, new BoxGeometry(0.18, 0.001, 0.12), new MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8, metalness: 0.0 }), 0, h / 2 + 0.002, -0.01);

  return root;
}

// ============================================================================
// HEADPHONES / AUDIO
// ============================================================================

/** True Wireless Earbuds (Tier 1) */
export function createEarbudsTWS(): Group {
  const root = new Group();

  // Charging case
  const caseW = 0.06, caseH = 0.028, caseD = 0.04;
  const caseGroup = new Group();
  createRoundedBox(caseGroup, caseW, caseH, caseD, 0.008, deviceBody);
  // Hinge
  addMesh(caseGroup, new CylinderGeometry(0.004, 0.004, caseW, 12), hingeMat, 0, 0, caseD / 2, 0, 0, Math.PI / 2);
  // LED indicator
  addMesh(caseGroup, new CylinderGeometry(0.003, 0.003, 0.002, 10), green, 0, caseH / 2 + 0.001, -caseD / 2 + 0.005, Math.PI / 2);
  // USB-C port
  addMesh(caseGroup, new RoundedBoxGeometry(0.01, 0.004, 0.005, 0.002, 4), portMat, 0, -caseH / 2 + 0.002, 0, 0, 0, Math.PI / 2);
  caseGroup.position.set(0, 0, 0);
  root.add(caseGroup);

  // Left earbud
  const leftBud = new Group();
  leftBud.position.set(-0.035, 0, 0.008);
  // Stem
  addMesh(leftBud, new CapsuleGeometry(0.008, 0.022, 8, 8), deviceBody, 0, -0.011, 0);
  // Bud body
  addMesh(leftBud, new SphereGeometry(0.01, 16, 12), earCupMat, 0, 0.012, 0);
  // Ear tip
  addMesh(leftBud, new CapsuleGeometry(0.006, 0.008, 8, 8), earPadMat, 0, 0.018, 0.002);
  // Touch sensor (flat area)
  addMesh(leftBud, new CylinderGeometry(0.009, 0.009, 0.001, 16), new MeshStandardMaterial({ color: 0x151525, roughness: 0.2, metalness: 0.5 }), 0, 0.005, 0.009);
  // Mic
  addMesh(leftBud, new CylinderGeometry(0.001, 0.001, 0.0015, 8), micMat, 0, -0.018, 0.005);
  root.add(leftBud);

  // Right earbud
  const rightBud = new Group();
  rightBud.position.set(0.035, 0, 0.008);
  addMesh(rightBud, new CapsuleGeometry(0.008, 0.022, 8, 8), deviceBody, 0, -0.011, 0);
  addMesh(rightBud, new SphereGeometry(0.01, 16, 12), earCupMat, 0, 0.012, 0);
  addMesh(rightBud, new CapsuleGeometry(0.006, 0.008, 8, 8), earPadMat, 0, 0.018, 0.002);
  addMesh(rightBud, new CylinderGeometry(0.009, 0.009, 0.001, 16), new MeshStandardMaterial({ color: 0x151525, roughness: 0.2, metalness: 0.5 }), 0, 0.005, 0.009);
  addMesh(rightBud, new CylinderGeometry(0.001, 0.001, 0.0015, 8), micMat, 0, -0.018, 0.005);
  root.add(rightBud);

  return root;
}

/** Over-Ear Headphones (Tier 2) */
export function createHeadphonesOver(): Group {
  const root = new Group();

  // Headband
  const band = new Group();
  const bandR = 0.1;
  // Arch
  const arch = new LatheGeometry([
    new Vector2(0, 0),
    new Vector2(0.008, 0.02),
    new Vector2(0.015, 0.06),
    new Vector2(0.015, 0.11),
    new Vector2(0.012, 0.14),
    new Vector2(0.008, 0.16),
    new Vector2(0, 0.17),
  ], 16);
  addMesh(band, arch, headbandMat);
  // Padding under headband
  addMesh(band, new CapsuleGeometry(0.012, 0.16, 8, 8), earPadMat, 0, 0.085, 0, Math.PI / 2);
  band.position.set(0, 0, 0);
  root.add(band);

  // Left ear cup
  const leftCup = new Group();
  leftCup.position.set(-0.1, 0.085, 0);
  // Cup outer
  addMesh(leftCup, new CylinderGeometry(0.045, 0.045, 0.022, 24), earCupMat, 0, 0, 0, Math.PI / 2);
  // Cup inner (driver housing)
  addMesh(leftCup, new CylinderGeometry(0.038, 0.038, 0.018, 24), deviceBody, 0, 0, 0, Math.PI / 2);
  // Ear pad
  addMesh(leftCup, new TorusGeometry(0.042, 0.014, 12, 24), earPadMat, 0, 0, 0, Math.PI / 2);
  // Driver grille
  addMesh(leftCup, new CylinderGeometry(0.03, 0.03, 0.001, 32), speakerGrille, 0, 0, 0.0095, Math.PI / 2);
  // ANC mics (2)
  addMesh(leftCup, new CylinderGeometry(0.0015, 0.0015, 0.002, 8), micMat, 0.038, 0.01, 0.01, 0, 0, Math.PI / 2);
  addMesh(leftCup, new CylinderGeometry(0.0015, 0.0015, 0.002, 8), micMat, 0.038, -0.01, 0.01, 0, 0, Math.PI / 2);
  // Hinge
  addMesh(leftCup, new CylinderGeometry(0.008, 0.008, 0.012, 12), hingeMat, 0.045, 0, 0, 0, 0, Math.PI / 2);
  root.add(leftCup);

  // Right ear cup
  const rightCup = new Group();
  rightCup.position.set(0.1, 0.085, 0);
  addMesh(rightCup, new CylinderGeometry(0.045, 0.045, 0.022, 24), earCupMat, 0, 0, 0, Math.PI / 2);
  addMesh(rightCup, new CylinderGeometry(0.038, 0.038, 0.018, 24), deviceBody, 0, 0, 0, Math.PI / 2);
  addMesh(rightCup, new TorusGeometry(0.042, 0.014, 12, 24), earPadMat, 0, 0, 0, Math.PI / 2);
  addMesh(rightCup, new CylinderGeometry(0.03, 0.03, 0.001, 32), speakerGrille, 0, 0, 0.0095, Math.PI / 2);
  // ANC mics
  addMesh(rightCup, new CylinderGeometry(0.0015, 0.0015, 0.002, 8), micMat, -0.038, 0.01, 0.01, 0, 0, Math.PI / 2);
  addMesh(rightCup, new CylinderGeometry(0.0015, 0.0015, 0.002, 8), micMat, -0.038, -0.01, 0.01, 0, 0, Math.PI / 2);
  // Hinge
  addMesh(rightCup, new CylinderGeometry(0.008, 0.008, 0.012, 12), hingeMat, -0.045, 0, 0, 0, 0, Math.PI / 2);
  // Controls (on right cup)
  addMesh(rightCup, new CylinderGeometry(0.006, 0.006, 0.005, 16), buttonMat, -0.038, 0, -0.015, 0, 0, Math.PI / 2); // Power
  addMesh(rightCup, new CylinderGeometry(0.005, 0.005, 0.004, 16), buttonMat, -0.038, 0.012, -0.015, 0, 0, Math.PI / 2); // ANC
  addMesh(rightCup, new CapsuleGeometry(0.004, 0.012, 8, 8), buttonMat, -0.038, -0.012, -0.015, 0, 0, Math.PI / 2); // Volume rocker
  // USB-C
  addMesh(rightCup, new RoundedBoxGeometry(0.01, 0.004, 0.005, 0.002, 4), portMat, -0.038, -0.022, -0.012, 0, 0, Math.PI / 2);
  // 3.5mm
  addMesh(rightCup, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, -0.038, -0.022, 0.012, 0, 0, Math.PI / 2);
  root.add(rightCup);

  return root;
}

/** On-Ear Headphones (Tier 1) */
export function createHeadphonesOn(): Group {
  const root = new Group();

  // Headband (thinner)
  const band = new Group();
  const arch = new LatheGeometry([
    new Vector2(0, 0),
    new Vector2(0.005, 0.02),
    new Vector2(0.01, 0.06),
    new Vector2(0.01, 0.1),
    new Vector2(0.008, 0.12),
    new Vector2(0.005, 0.135),
    new Vector2(0, 0.14),
  ], 16);
  addMesh(band, arch, headbandMat);
  // Padding
  addMesh(band, new CapsuleGeometry(0.008, 0.13, 8, 8), earPadMatLight, 0, 0.07, 0, Math.PI / 2);
  band.position.set(0, 0, 0);
  root.add(band);

  // Ear cups (smaller, on-ear)
  for (const x of [-0.085, 0.085]) {
    const cup = new Group();
    cup.position.set(x, 0.07, 0);
    // Cup
    addMesh(cup, new CylinderGeometry(0.035, 0.035, 0.018, 24), earCupMat, 0, 0, 0, Math.PI / 2);
    addMesh(cup, new CylinderGeometry(0.03, 0.03, 0.015, 24), deviceBody, 0, 0, 0, Math.PI / 2);
    // Pad
    addMesh(cup, new TorusGeometry(0.033, 0.01, 10, 20), earPadMat, 0, 0, 0, Math.PI / 2);
    // Driver grille
    addMesh(cup, new CylinderGeometry(0.025, 0.025, 0.001, 24), speakerGrille, 0, 0, 0.008, Math.PI / 2);
    // Hinge
    addMesh(cup, new CylinderGeometry(0.006, 0.006, 0.01, 10), hingeMat, x < 0 ? 0.035 : -0.035, 0, 0, 0, 0, Math.PI / 2);
    root.add(cup);
  }

  // Cable (detachable, left cup)
  addMesh(root, new CapsuleGeometry(0.0025, 0.3, 6, 6), rubber, -0.085, 0.07, -0.04, 0, 0, Math.PI / 2);
  // 3.5mm plug
  addMesh(root, new CylinderGeometry(0.005, 0.005, 0.015, 12), metal, -0.085, 0.07, -0.19, 0, 0, Math.PI / 2);

  return root;
}

/** Gaming Headset (Tier 2) */
export function createGamingHeadset(): Group {
  const root = createHeadphonesOver(); // Base on over-ear

  // Add boom mic (left side)
  const leftCup = root.children.find(c => c.position.x < 0);
  if (leftCup) {
    const mic = new Group();
    mic.position.set(-0.045, 0.01, 0.01);
    // Boom arm
    addMesh(mic, new CapsuleGeometry(0.002, 0.06, 6, 6), metal, 0, -0.03, 0, 0.3);
    // Mic head
    addMesh(mic, new CapsuleGeometry(0.005, 0.01, 8, 8), micMat, 0.005, -0.06, 0, 0.3);
    // Mute LED
    addMesh(mic, new CylinderGeometry(0.0015, 0.0015, 0.0015, 8), red, 0.01, -0.065, 0, 0, 0, Math.PI / 2);
    leftCup.add(mic);
  }

  // Add volume wheel (right cup)
  const rightCup = root.children.find(c => c.position.x > 0);
  if (rightCup) {
    addMesh(rightCup, new CylinderGeometry(0.008, 0.008, 0.006, 20), buttonMat, -0.038, -0.02, -0.012, Math.PI / 2);
    // Wheel ridges
    for (let i = 0; i < 12; i++) {
      addMesh(rightCup, new BoxGeometry(0.001, 0.004, 0.008), new MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.1 }), -0.046, -0.02 + Math.sin(i * Math.PI / 6) * 0.006, Math.cos(i * Math.PI / 6) * 0.006, 0, 0, i * Math.PI / 6);
    }
  }

  // USB-C dongle storage (right cup bottom)
  if (rightCup) {
    addMesh(rightCup, new RoundedBoxGeometry(0.018, 0.006, 0.012, 0.003, 4), portMat, -0.038, -0.03, -0.01, 0, 0, Math.PI / 2);
  }

  return root;
}

// ============================================================================
// HANDHELD CONSOLES
// ============================================================================

/** Retro Handheld Console (Tier 2) */
export function createHandheldRetro(): Group {
  const root = new Group();
  const w = 0.11, h = 0.08, d = 0.022;

  // Front shell
  createRoundedBox(root, w, h, d, 0.008, deviceBody);
  // Back shell (slightly thicker)
  createRoundedBox(root, w + 0.002, h + 0.002, d + 0.002, 0.009, deviceBodyMatte, 0, 0, -0.001);

  // Screen (recessed)
  addMesh(root, new RoundedBoxGeometry(0.055, 0.042, 0.001, 0.003, 4), glassScreen, 0, 0.01, d / 2 + 0.0015);

  // D-Pad (left)
  const dpad = new Group();
  dpad.position.set(-0.03, -0.01, d / 2 + 0.003);
  addMesh(dpad, new BoxGeometry(0.022, 0.004, 0.022), dpadMat);
  addMesh(dpad, new BoxGeometry(0.005, 0.012, 0.018), dpadMat, 0, 0.008, 0);
  addMesh(dpad, new BoxGeometry(0.005, 0.012, 0.018), dpadMat, 0, -0.008, 0);
  addMesh(dpad, new BoxGeometry(0.018, 0.012, 0.005), dpadMat, 0, 0, 0.008);
  addMesh(dpad, new BoxGeometry(0.018, 0.012, 0.005), dpadMat, 0, 0, -0.008);
  root.add(dpad);

  // Face buttons (right, A/B)
  for (const [i, [x, y]] of [[0, [0.03, -0.01]], [1, [0.042, -0.022]]].entries()) {
    addMesh(root, new CylinderGeometry(0.007, 0.007, 0.005, 16), faceButtonMat[i], x, y, d / 2 + 0.003);
  }

  // Start/Select
  addMesh(root, new RoundedBoxGeometry(0.012, 0.003, 0.006, 0.002, 4), buttonMat, -0.01, 0.01, d / 2 + 0.003);
  addMesh(root, new RoundedBoxGeometry(0.012, 0.003, 0.006, 0.002, 4), buttonMat, 0.01, 0.01, d / 2 + 0.003);

  // Shoulder buttons
  addMesh(root, new RoundedBoxGeometry(0.025, 0.006, 0.015, 0.005, 4), shoulderMat, -0.045, h / 2 + 0.003, 0, -0.2);
  addMesh(root, new RoundedBoxGeometry(0.025, 0.006, 0.015, 0.005, 4), shoulderMat, 0.045, h / 2 + 0.003, 0, -0.2);

  // Cartridge slot (top)
  addMesh(root, new RoundedBoxGeometry(0.045, 0.008, 0.012, 0.003, 4), portMat, 0, h / 2 + 0.004, -0.005, 0, 0, Math.PI / 2);

  // Volume slider (left side)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.02, 0.004, 0.001, 4), buttonMat, -w / 2 - 0.0015, -0.005, 0, 0, 0, Math.PI / 2);

  // Power switch (right side)
  addMesh(root, new RoundedBoxGeometry(0.015, 0.004, 0.005, 0.002, 4), buttonMat, w / 2 + 0.002, 0.02, 0, 0, 0, Math.PI / 2);

  // 3.5mm jack (bottom)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, 0, -h / 2 - 0.002, 0, Math.PI / 2);

  // Speaker (bottom front)
  addMesh(root, new BoxGeometry(0.02, 0.001, 0.003), speakerGrille, 0, -h / 2 + 0.003, d / 2 + 0.002);

  // Battery cover (back, bottom)
  addMesh(root, new RoundedBoxGeometry(0.04, 0.025, 0.002, 0.003, 4), deviceBodyMatte, 0, -h / 2 + 0.012, -d / 2 - 0.001);

  return root;
}

/** Modern Handheld Console (Tier 3) */
export function createHandheldModern(): Group {
  const root = new Group();
  const w = 0.13, h = 0.09, d = 0.025;

  // Front (glass)
  addMesh(root, new RoundedBoxGeometry(w, h, 0.004, 0.01, 4), glassScreen);
  // Mid frame
  createRoundedBox(root, w - 0.002, h - 0.002, d - 0.004, 0.009, metal, 0, 0, -0.001);
  // Back
  createRoundedBox(root, w, h, 0.005, 0.01, deviceBodyMatte, 0, 0, -d / 2 - 0.001);

  // Screen (OLED, nearly edge-to-edge)
  addMesh(root, new RoundedBoxGeometry(w - 0.012, h - 0.012, 0.001, 0.004, 4), screenOnMat, 0, 0, d / 2 + 0.002);

  // Left stick
  const lStick = new Group();
  lStick.position.set(-0.04, 0.015, d / 2 + 0.008);
  addMesh(lStick, new CylinderGeometry(0.016, 0.016, 0.008, 20), stickMat);
  addMesh(lStick, new CapsuleGeometry(0.012, 0.01, 10, 8), stickCapMat, 0, 0.009, 0);
  root.add(lStick);

  // Right stick
  const rStick = new Group();
  rStick.position.set(0.04, -0.015, d / 2 + 0.008);
  addMesh(rStick, new CylinderGeometry(0.016, 0.016, 0.008, 20), stickMat);
  addMesh(rStick, new CapsuleGeometry(0.012, 0.01, 10, 8), stickCapMat, 0, 0.009, 0);
  root.add(rStick);

  // D-Pad (left, below stick)
  const dpad = new Group();
  dpad.position.set(-0.04, 0.035, d / 2 + 0.003);
  addMesh(dpad, new BoxGeometry(0.02, 0.003, 0.02), dpadMat);
  addMesh(dpad, new BoxGeometry(0.005, 0.01, 0.016), dpadMat, 0, 0.0065, 0);
  addMesh(dpad, new BoxGeometry(0.005, 0.01, 0.016), dpadMat, 0, -0.0065, 0);
  addMesh(dpad, new BoxGeometry(0.016, 0.01, 0.005), dpadMat, 0, 0, 0.0065);
  addMesh(dpad, new BoxGeometry(0.016, 0.01, 0.005), dpadMat, 0, 0, -0.0065);
  root.add(dpad);

  // Face buttons (right, below stick)
  const faceBtns = new Group();
  faceBtns.position.set(0.04, -0.035, d / 2 + 0.003);
  for (const [i, [dx, dz]] of [[0, [0, -0.01]], [1, [0.01, 0]], [2, [-0.01, 0]], [3, [0, 0.01]]].entries()) {
    const btn = new Group();
    btn.position.set(dx, 0, dz);
    addMesh(btn, new CylinderGeometry(0.006, 0.006, 0.004, 16), faceButtonMat[i]);
    faceBtns.add(btn);
  }
  root.add(faceBtns);

  // Shoulders (L/R)
  for (const x of [-0.055, 0.055]) {
    addMesh(root, new RoundedBoxGeometry(0.03, 0.007, 0.018, 0.006, 4), shoulderMat, x, h / 2 + 0.003, 0, -0.25);
  }

  // Triggers (L2/R2)
  for (const x of [-0.055, 0.055]) {
    const trig = new Group();
    trig.position.set(x, h / 2 + 0.01, 0.01);
    addMesh(trig, new CapsuleGeometry(0.008, 0.02, 8, 8), triggerMat, 0, 0, 0, -0.4);
    root.add(trig);
  }

  // Home button
  addMesh(root, new CylinderGeometry(0.006, 0.006, 0.004, 16), buttonMat, 0, 0, d / 2 + 0.005);

  // Volume buttons (left edge)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.025, 0.004, 0.001, 4), buttonMat, -w / 2 - 0.0015, 0.015, 0, 0, 0, Math.PI / 2);

  // Power button (top right)
  addMesh(root, new CylinderGeometry(0.004, 0.004, 0.005, 12), buttonMat, w / 2 - 0.01, h / 2 + 0.003, 0);

  // Game card slot (top)
  addMesh(root, new RoundedBoxGeometry(0.025, 0.006, 0.01, 0.002, 4), portMat, -0.03, h / 2 + 0.003, -0.005, 0, 0, Math.PI / 2);

  // microSD slot (top)
  addMesh(root, new RoundedBoxGeometry(0.015, 0.004, 0.008, 0.002, 4), portMat, 0.03, h / 2 + 0.003, -0.005, 0, 0, Math.PI / 2);

  // USB-C (bottom)
  addMesh(root, new RoundedBoxGeometry(0.012, 0.004, 0.006, 0.002, 4), portMat, 0, -h / 2 - 0.002, 0, 0, 0, Math.PI / 2);

  // 3.5mm (bottom)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, 0.025, -h / 2 - 0.002, 0, Math.PI / 2);

  // Fan exhaust (top back)
  addMesh(root, new BoxGeometry(0.04, 0.001, 0.008), speakerGrille, 0, h / 2 - 0.005, -d / 2 - 0.001, 0, 0, Math.PI / 2);

  // Speakers (bottom front)
  for (const x of [-0.03, 0.03]) {
    addMesh(root, new BoxGeometry(0.015, 0.001, 0.003), speakerGrille, x, -h / 2 + 0.003, d / 2 + 0.002);
  }

  return root;
}

/** Clamshell Handheld (Tier 2) */
export function createHandheldClamshell(): Group {
  const root = new Group();
  // Bottom half
  const bottom = new Group();
  const w = 0.085, h = 0.07, d = 0.02;
  createRoundedBox(bottom, w, h, d, 0.008, deviceBody);
  // D-Pad
  const dpad = new Group();
  dpad.position.set(-0.025, 0.005, d / 2 + 0.003);
  addMesh(dpad, new BoxGeometry(0.02, 0.003, 0.02), dpadMat);
  addMesh(dpad, new BoxGeometry(0.005, 0.01, 0.016), dpadMat, 0, 0.0065, 0);
  addMesh(dpad, new BoxGeometry(0.005, 0.01, 0.016), dpadMat, 0, -0.0065, 0);
  addMesh(dpad, new BoxGeometry(0.016, 0.01, 0.005), dpadMat, 0, 0, 0.0065);
  addMesh(dpad, new BoxGeometry(0.016, 0.01, 0.005), dpadMat, 0, 0, -0.0065);
  bottom.add(dpad);
  // Face buttons
  for (const [i, [x, y]] of [[0, [0.025, 0.005]], [1, [0.037, -0.007]], [2, [0.013, -0.007]], [3, [0.025, -0.019]]].entries()) {
    addMesh(bottom, new CylinderGeometry(0.006, 0.006, 0.004, 16), faceButtonMat[i], x, y, d / 2 + 0.003);
  }
  // Start/Select
  addMesh(bottom, new RoundedBoxGeometry(0.01, 0.003, 0.005, 0.002, 4), buttonMat, -0.01, 0.015, d / 2 + 0.003);
  addMesh(bottom, new RoundedBoxGeometry(0.01, 0.003, 0.005, 0.002, 4), buttonMat, 0.01, 0.015, d / 2 + 0.003);
  // Shoulders
  addMesh(bottom, new RoundedBoxGeometry(0.02, 0.005, 0.012, 0.004, 4), shoulderMat, -0.035, h / 2 + 0.002, 0, -0.2);
  addMesh(bottom, new RoundedBoxGeometry(0.02, 0.005, 0.012, 0.004, 4), shoulderMat, 0.035, h / 2 + 0.002, 0, -0.2);
  // Game slot
  addMesh(bottom, new RoundedBoxGeometry(0.03, 0.006, 0.01, 0.002, 4), portMat, 0, h / 2 + 0.003, -0.005, 0, 0, Math.PI / 2);
  // Speaker
  addMesh(bottom, new BoxGeometry(0.02, 0.001, 0.003), speakerGrille, 0, -h / 2 + 0.003, d / 2 + 0.002);
  // Mic
  addMesh(bottom, new CylinderGeometry(0.001, 0.001, 0.0015, 8), micMat, 0, -h / 2 + 0.005, d / 2 + 0.004);
  bottom.position.y = -h / 2 - 0.005;

  // Top half
  const top = new Group();
  createRoundedBox(top, w, h, d, 0.008, deviceBody);
  // Top screen
  addMesh(top, new RoundedBoxGeometry(w - 0.01, h - 0.01, 0.001, 0.003, 4), glassScreen, 0, 0, d / 2 + 0.0015);
  // Bottom screen (touch)
  addMesh(top, new RoundedBoxGeometry(w - 0.01, h - 0.01, 0.001, 0.003, 4), screenOnMat, 0, 0, -d / 2 - 0.0015);
  // Speakers (stereo)
  for (const x of [-0.02, 0.02]) {
    addMesh(top, new BoxGeometry(0.015, 0.001, 0.003), speakerGrille, x, h / 2 - 0.005, d / 2 + 0.002);
  }
  top.position.y = h / 2 + 0.005;

  // Hinge
  const hinge = new Group();
  for (let i = 0; i < 2; i++) {
    addMesh(hinge, new CylinderGeometry(0.006, 0.006, w * 0.8, 12), hingeMat, 0, 0, (i - 0.5) * 0.01, 0, 0, Math.PI / 2);
  }
  hinge.position.y = 0;

  root.add(bottom, top, hinge);
  return root;
}

// ============================================================================
// OTHER GADGETS
// ============================================================================

/** Smartwatch (Tier 1) */
export function createSmartwatch(): Group {
  const root = new Group();
  const caseW = 0.044, caseH = 0.044, caseD = 0.011;
  const r = 0.008;

  // Case
  createRoundedBox(root, caseW, caseH, caseD, r, watchCaseMat);
  // Screen (rounded rect)
  addMesh(root, new RoundedBoxGeometry(caseW - 0.006, caseH - 0.006, 0.001, r - 0.001, 4), glassScreen, 0, 0, caseD / 2 + 0.0005);

  // Digital Crown (right)
  const crown = new Group();
  crown.position.set(caseW / 2 + 0.002, 0, 0);
  addMesh(crown, new CylinderGeometry(0.0045, 0.0045, 0.006, 16), gold);
  // Crown texture (ridges)
  for (let i = 0; i < 16; i++) {
    addMesh(crown, new BoxGeometry(0.0005, 0.003, 0.006), new MeshStandardMaterial({ color: 0xb8860b, roughness: 0.3, metalness: 0.5 }), 0.0045, 0, 0, 0, 0, i * Math.PI / 8);
  }
  root.add(crown);

  // Side button (below crown)
  addMesh(root, new CylinderGeometry(0.0035, 0.0035, 0.005, 12), buttonMat, caseW / 2 + 0.0015, -0.01, 0, Math.PI / 2);

  // Sensors (back)
  addMesh(root, new CylinderGeometry(0.008, 0.008, 0.002, 16), new MeshStandardMaterial({ color: 0x0a1a0a, roughness: 0.1, metalness: 0.8, emissive: 0x0a3a0a, emissiveIntensity: 0.2 }), 0, 0, -caseD / 2 - 0.0005);
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.001, 12), new MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3, metalness: 0.2 }), 0.01, 0.01, -caseD / 2 - 0.0003);

  // Strap lugs
  for (const y of [-caseH / 2, caseH / 2]) {
    addMesh(root, new CapsuleGeometry(0.003, 0.008, 8, 8), watchCaseMat, 0, y, 0, 0, 0, Math.PI / 2);
  }

  // Strap (one side shown)
  const strap = new Group();
  strap.position.set(0, -caseH / 2 - 0.02, 0);
  createRoundedBox(strap, 0.022, 0.04, 0.003, 0.002, strapMatBrown);
  root.add(strap);

  return root;
}

/** Portable Bluetooth Speaker (Tier 1) */
export function createPortableSpeaker(): Group {
  const root = new Group();
  const w = 0.075, h = 0.17, d = 0.045;

  // Body
  createRoundedBox(root, w, h, d, 0.012, speakerBodyMat);
  // Grille wrap (front + sides)
  const grille = new Group();
  // Front
  addMesh(grille, new RoundedBoxGeometry(w - 0.004, h - 0.004, 0.002, 0.01, 4), speakerGrilleMat, 0, 0, d / 2 + 0.001);
  // Left side
  addMesh(grille, new RoundedBoxGeometry(0.002, h - 0.004, d - 0.004, 0.01, 4), speakerGrilleMat, -w / 2 + 0.001, 0, 0);
  // Right side
  addMesh(grille, new RoundedBoxGeometry(0.002, h - 0.004, d - 0.004, 0.01, 4), speakerGrilleMat, w / 2 - 0.001, 0, 0);
  root.add(grille);

  // Passive radiators (top & bottom, visible through grille)
  addMesh(root, new CylinderGeometry(0.025, 0.025, 0.003, 24), new MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.4, metalness: 0.1 }), 0, h / 2 - 0.015, 0);
  addMesh(root, new CylinderGeometry(0.025, 0.025, 0.003, 24), new MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.4, metalness: 0.1 }), 0, -h / 2 + 0.015, 0);

  // Controls (top)
  const controls = new Group();
  controls.position.set(0, h / 2 - 0.025, 0);
  addMesh(controls, new CylinderGeometry(0.006, 0.006, 0.004, 16), buttonMat); // Power
  addMesh(controls, new CylinderGeometry(0.005, 0.005, 0.004, 16), buttonMat, 0.015, 0, 0); // Vol+
  addMesh(controls, new CylinderGeometry(0.005, 0.005, 0.004, 16), buttonMat, -0.015, 0, 0); // Vol-
  addMesh(controls, new CylinderGeometry(0.005, 0.005, 0.004, 16), blue, 0, 0.015, 0); // Bluetooth
  root.add(controls);

  // USB-C port (back, bottom)
  addMesh(root, new RoundedBoxGeometry(0.01, 0.004, 0.005, 0.002, 4), portMat, 0, -h / 2 + 0.015, -d / 2 - 0.001, 0, 0, Math.PI / 2);

  // AUX in (back, bottom)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.005, 12), portMat, 0.02, -h / 2 + 0.015, -d / 2 - 0.001, Math.PI / 2);

  // Carry strap loop (top back)
  addMesh(root, new TorusGeometry(0.008, 0.0025, 8, 16), rubber, 0, h / 2 - 0.008, -d / 2 - 0.005, Math.PI / 2);

  return root;
}

/** Action Camera (Tier 2) */
export function createActionCamera(): Group {
  const root = new Group();
  const w = 0.042, h = 0.062, d = 0.03;

  // Body
  createRoundedBox(root, w, h, d, 0.005, cameraBodyMat);

  // Front lens door
  const lensDoor = new Group();
  lensDoor.position.set(0, 0.005, d / 2 + 0.001);
  createRoundedBox(lensDoor, w - 0.004, 0.03, 0.004, 0.003, cameraBodyMat);
  // Lens
  addMesh(lensDoor, new CylinderGeometry(0.012, 0.012, 0.005, 20), cameraLens, 0, 0.008, 0.0025);
  // Lens rings
  addMesh(lensDoor, new TorusGeometry(0.014, 0.002, 8, 16), lensBarrelMat, 0, 0.008, 0.005, Math.PI / 2);
  addMesh(lensDoor, new TorusGeometry(0.011, 0.0015, 8, 16), gold, 0, 0.008, 0.006, Math.PI / 2);
  root.add(lensDoor);

  // Screen (back)
  addMesh(root, new RoundedBoxGeometry(w - 0.006, h - 0.03, 0.001, 0.003, 4), glassScreen, 0, -0.01, -d / 2 - 0.0005);

  // Side door (right side)
  addMesh(root, new RoundedBoxGeometry(0.003, 0.025, 0.02, 0.002, 4), cameraBodyMat, w / 2 + 0.0015, -0.005, -0.002, 0, 0, Math.PI / 2);
  // USB-C behind door
  addMesh(root, new RoundedBoxGeometry(0.01, 0.004, 0.005, 0.002, 4), portMat, w / 2 + 0.002, -0.005, -0.002, 0, 0, Math.PI / 2);
  // microHDMI
  addMesh(root, new RoundedBoxGeometry(0.008, 0.003, 0.005, 0.002, 4), portMat, w / 2 + 0.002, -0.015, -0.002, 0, 0, Math.PI / 2);

  // Battery door (bottom)
  addMesh(root, new RoundedBoxGeometry(w - 0.004, 0.004, d - 0.004, 0.003, 4), cameraBodyMat, 0, -h / 2 + 0.002, 0);

  // Shutter button (top)
  addMesh(root, new CylinderGeometry(0.007, 0.007, 0.004, 16), red, 0, h / 2 + 0.002, 0);

  // Mode button (top front)
  addMesh(root, new CylinderGeometry(0.004, 0.004, 0.003, 12), buttonMat, 0, h / 2 - 0.005, d / 2 + 0.002);

  // Mics (3)
  for (const [x, z] of [[0, d/2+0.002], [-0.012, d/2+0.002], [0.012, d/2+0.002]]) {
    addMesh(root, new CylinderGeometry(0.001, 0.001, 0.0015, 8), micMat, x, h / 2 - 0.01, z);
  }

  // Mounting fingers (bottom)
  for (const x of [-0.01, 0, 0.01]) {
    addMesh(root, new BoxGeometry(0.005, 0.008, 0.003), metal, x, -h / 2 - 0.004, 0);
  }

  return root;
}

/** Mini Drone (Tier 2) */
export function createDroneMini(): Group {
  const root = new Group();
  const armL = 0.08, armW = 0.012, armH = 0.006;
  const bodyW = 0.04, bodyH = 0.025, bodyD = 0.04;

  // Center body
  createRoundedBox(root, bodyW, bodyH, bodyD, 0.005, droneBodyMat);
  // Battery (top)
  addMesh(root, new RoundedBoxGeometry(0.03, 0.012, 0.025, 0.003, 4), deviceBody, 0, bodyH / 2 + 0.006, 0);
  // Flight controller (visible through vents)
  addMesh(root, new RoundedBoxGeometry(0.02, 0.003, 0.015, 0.002, 4), new MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.2, metalness: 0.3 }), 0, bodyH / 2 + 0.001, 0);
  // GPS module (bump)
  addMesh(root, new CylinderGeometry(0.01, 0.01, 0.005, 12), new MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.3, metalness: 0.4 }), 0, bodyH / 2 + 0.01, 0.015);
  // Camera gimbal (front bottom)
  const gimbal = new Group();
  gimbal.position.set(0, -bodyH / 2 - 0.01, bodyD / 2 + 0.01);
  addMesh(gimbal, new CylinderGeometry(0.012, 0.012, 0.01, 16), metal);
  addMesh(gimbal, new CylinderGeometry(0.008, 0.008, 0.008, 16), cameraLens, 0, -0.009, 0);
  root.add(gimbal);

  // USB-C (back)
  addMesh(root, new RoundedBoxGeometry(0.008, 0.003, 0.005, 0.002, 4), portMat, 0, -0.002, -bodyD / 2 - 0.001, 0, 0, Math.PI / 2);
  // microSD
  addMesh(root, new RoundedBoxGeometry(0.01, 0.003, 0.006, 0.002, 4), portMat, 0.015, -0.002, -bodyD / 2 - 0.001, 0, 0, Math.PI / 2);

  // LED status (front)
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.002, 10), green, 0, 0, bodyD / 2 + 0.001);
  addMesh(root, new CylinderGeometry(0.003, 0.003, 0.002, 10), red, 0.007, 0, bodyD / 2 + 0.001);

  // Arms (4, X configuration)
  const armPositions = [
    [-armL / 2, 0, -armL / 2], // FL
    [armL / 2, 0, -armL / 2],  // FR
    [-armL / 2, 0, armL / 2],  // BL
    [armL / 2, 0, armL / 2],   // BR
  ];
  const armRotations = [
    [-Math.PI / 4, 0, 0], // FL
    [Math.PI / 4, 0, 0],  // FR
    [Math.PI / 4, 0, 0],  // BL
    [-Math.PI / 4, 0, 0], // BR
  ];

  for (let i = 0; i < 4; i++) {
    const arm = new Group();
    arm.position.set(...armPositions[i]);
    arm.rotation.set(...armRotations[i]);

    // Arm tube
    addMesh(arm, new CylinderGeometry(armW / 2, armW / 2, armL, 12), droneBodyMat, 0, 0, armL / 2, Math.PI / 2);

    // Motor
    const motor = new Group();
    motor.position.set(0, 0, armL);
    addMesh(motor, new CylinderGeometry(0.01, 0.01, 0.008, 12), motorMat);
    // Motor bell
    addMesh(motor, new CylinderGeometry(0.011, 0.011, 0.004, 12), new MeshStandardMaterial({ color: 0x3a3a4a, roughness: 0.3, metalness: 0.5 }), 0, 0, -0.006);
    // Stator windings (visible)
    addMesh(motor, new CylinderGeometry(0.006, 0.006, 0.006, 12), new MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.2, metalness: 0.3 }), 0, 0, 0.001);
    arm.add(motor);

    // Propeller
    const prop = new Group();
    prop.position.set(0, 0, armL + 0.004);
    // 2-blade prop
    for (let b = 0; b < 2; b++) {
      addMesh(prop, new BoxGeometry(0.006, 0.001, 0.045), propMat, 0, 0, 0, 0, 0, b * Math.PI / 2);
    }
    // Prop hub
    addMesh(prop, new CylinderGeometry(0.004, 0.004, 0.003, 8), motorMat, 0, 0, 0);
    arm.add(prop);

    // Motor wire
    addMesh(arm, new CapsuleGeometry(0.001, armL, 4, 4), rubber, 0, 0, armL / 2, Math.PI / 2);

    root.add(arm);
  }

  return root;
}