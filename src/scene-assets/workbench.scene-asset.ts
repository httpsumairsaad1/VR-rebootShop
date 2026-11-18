/**
 * Workbench and environment assets for Reboot Shop VR.
 *
 * Procedural, deterministic, side-effect-free prototypes for the asset manifest.
 * Import Three.js from @iwsdk/core only.
 */

import {
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from '@iwsdk/core';
import {
  mat,
  matBorder,
  wood,
  woodDark,
  metal,
  techDark,
  cream,
  copper,
  green,
  orange,
  bulbGlow,
  windowGlow,
  floorMat,
  wallMat,
} from './materials.js';

/**
 * Tilted ESD-safe anti-static rubber repair mat (~12-15° tilt).
 * Origin at front-bottom-center of the mat for easy scene placement.
 */
export function createWorkbenchMat(width = 0.6, depth = 0.45, thickness = 0.015): Group {
  const root = new Group();

  // Main mat surface.
  const main = new Mesh(
    new BoxGeometry(width, thickness, depth),
    mat,
  );
  main.position.set(0, thickness / 2, -depth / 2);
  root.add(main);

  // Border trim around the mat edges.
  const borderThickness = 0.012;
  const borderHeight = 0.02;

  // Front border (closest to player).
  const frontBorder = new Mesh(
    new BoxGeometry(width, borderHeight, borderThickness),
    matBorder,
  );
  frontBorder.position.set(0, borderHeight / 2, depth / 2 - borderThickness / 2);
  root.add(frontBorder);

  // Back border (far edge).
  const backBorder = new Mesh(
    new BoxGeometry(width, borderHeight, borderThickness),
    matBorder,
  );
  backBorder.position.set(0, borderHeight / 2, -depth / 2 + borderThickness / 2);
  root.add(backBorder);

  // Left border.
  const leftBorder = new Mesh(
    new BoxGeometry(borderThickness, borderHeight, depth),
    matBorder,
  );
  leftBorder.position.set(-width / 2 + borderThickness / 2, borderHeight / 2, -depth / 2);
  root.add(leftBorder);

  // Right border.
  const rightBorder = new Mesh(
    new BoxGeometry(borderThickness, borderHeight, depth),
    matBorder,
  );
  rightBorder.position.set(width / 2 - borderThickness / 2, borderHeight / 2, -depth / 2);
  root.add(rightBorder);

  return root;
}

/**
 * Bench legs & aprons — warm walnut with dark trim.
 * Designed for seated height (top ~0.85m, mat on top at ~0.865m).
 */
export function createBenchBase(matWidth = 0.6, matDepth = 0.45): Group {
  const root = new Group();
  const legW = 0.06;
  const legH = 0.82; // to underside of mat
  const apronH = 0.1;
  const apronThick = 0.035;
  const halfW = matWidth / 2;
  const halfD = matDepth / 2 - 0.04; // inset slightly

  // Four legs.
  for (let xSign of [-1, 1]) {
    for (let zSign of [-1, 1]) {
      const leg = new Mesh(
        new BoxGeometry(legW, legH, legW),
        wood,
      );
      leg.position.set(xSign * (halfW - legW / 2), legH / 2, zSign * (halfD - legW / 2));
      root.add(leg);
    }
  }

  // Front apron (facing player).
  const frontApron = new Mesh(
    new BoxGeometry(matWidth - legW * 2, apronH, apronThick),
    woodDark,
  );
  frontApron.position.set(0, legH - apronH / 2, halfD - apronThick / 2);
  root.add(frontApron);

  // Back apron.
  const backApron = new Mesh(
    new BoxGeometry(matWidth - legW * 2, apronH, apronThick),
    woodDark,
  );
  backApron.position.set(0, legH - apronH / 2, -halfD + apronThick / 2);
  root.add(backApron);

  // Left apron.
  const leftApron = new Mesh(
    new BoxGeometry(apronThick, apronH, matDepth - legW * 2),
    woodDark,
  );
  leftApron.position.set(-halfW + apronThick / 2, legH - apronH / 2, 0);
  root.add(leftApron);

  // Right apron.
  const rightApron = new Mesh(
    new BoxGeometry(apronThick, apronH, matDepth - legW * 2),
    woodDark,
  );
  rightApron.position.set(halfW - apronThick / 2, legH - apronH / 2, 0);
  root.add(rightApron);

  return root;
}

/**
 * Warm desk lamp with articulated arm and cream shade.
 * Placed left of mat per spec zone map.
 */
export function createDeskLamp(): Group {
  const root = new Group();

  // Heavy base.
  const base = new Mesh(
    new CylinderGeometry(0.09, 0.1, 0.03, 32),
    metal,
  );
  base.position.y = 0.015;
  root.add(base);

  // Vertical post.
  const post = new Mesh(
    new CylinderGeometry(0.012, 0.012, 0.3, 16),
    metal,
  );
  post.position.set(0, 0.165, 0);
  root.add(post);

  // First arm segment (horizontal).
  const arm1 = new Mesh(
    new CylinderGeometry(0.01, 0.01, 0.35, 16),
    metal,
  );
  arm1.rotation.z = -Math.PI / 2;
  arm1.position.set(0.175, 0.46, 0);
  root.add(arm1);

  // Elbow joint.
  const elbow = new Mesh(
    new SphereGeometry(0.018, 12, 12),
    metal,
  );
  elbow.position.set(0.35, 0.46, 0);
  root.add(elbow);

  // Second arm segment (down toward mat).
  const arm2 = new Mesh(
    new CylinderGeometry(0.01, 0.01, 0.25, 16),
    metal,
  );
  arm2.rotation.x = Math.PI / 3; // angled down
  arm2.position.set(0.35, 0.46, 0);
  root.add(arm2);

  // Shade.
  const shade = new Mesh(
    new ConeGeometry(0.12, 0.14, 32, 1, true),
    cream,
  );
  shade.rotation.x = -Math.PI / 6;
  shade.position.set(0.48, 0.32, 0);
  root.add(shade);

  // Bulb (emissive) inside shade.
  const bulb = new Mesh(
    new SphereGeometry(0.035, 16, 16),
    bulbGlow,
  );
  bulb.position.set(0.48, 0.22, 0);
  root.add(bulb);

  return root;
}

/**
 * Wall-mounted upper component drawers (above mat, back rim).
 * 3 columns × 2 rows of shallow drawers with copper knobs.
 */
export function createComponentDrawers(): Group {
  const root = new Group();
  const cols = 3;
  const rows = 2;
  const drawerW = 0.18;
  const drawerH = 0.08;
  const drawerD = 0.12;
  const gap = 0.015;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * (drawerW + gap);
      const y = 0.9 + r * (drawerH + gap); // mounted above bench
      const z = -0.4;

      // Drawer front.
      const front = new Mesh(
        new BoxGeometry(drawerW, drawerH, 0.015),
        wood,
      );
      front.position.set(x, y, z + drawerD - 0.0075);
      root.add(front);

      // Drawer body (sides, bottom, back).
      const leftSide = new Mesh(
        new BoxGeometry(0.01, drawerH - 0.01, drawerD),
        woodDark,
      );
      leftSide.position.set(x - drawerW / 2 + 0.005, y, z);
      root.add(leftSide);

      const rightSide = new Mesh(
        new BoxGeometry(0.01, drawerH - 0.01, drawerD),
        woodDark,
      );
      rightSide.position.set(x + drawerW / 2 - 0.005, y, z);
      root.add(rightSide);

      const bottom = new Mesh(
        new BoxGeometry(drawerW - 0.02, 0.01, drawerD),
        woodDark,
      );
      bottom.position.set(x, y - drawerH / 2 + 0.005, z);
      root.add(bottom);

      const back = new Mesh(
        new BoxGeometry(drawerW, drawerH, 0.01),
        woodDark,
      );
      back.position.set(x, y, z - drawerD + 0.005);
      root.add(back);

      // Copper knob.
      const knob = new Mesh(
        new SphereGeometry(0.012, 12, 12),
        copper,
      );
      knob.position.set(x, y, z + drawerD + 0.008);
      root.add(knob);
    }
  }

  return root;
}

/**
 * Incoming/Outgoing Parcel Chute (center back rim, 0.45m forward).
 * Angled delivery tube with a drop slot.
 */
export function createParcelChute(): Group {
  const root = new Group();

  // Vertical tube section.
  const tube = new Mesh(
    new CylinderGeometry(0.08, 0.08, 0.5, 16, 1, true),
    metal,
  );
  tube.position.set(0, 1.1, -0.4);
  root.add(tube);

  // Angled delivery chute.
  const chute = new Mesh(
    new CylinderGeometry(0.085, 0.085, 0.35, 16, 1, true),
    metal,
  );
  chute.rotation.x = Math.PI / 4;
  chute.position.set(0, 1.4, -0.55);
  root.add(chute);

  // Drop slot at bottom of vertical tube.
  const slot = new Mesh(
    new BoxGeometry(0.18, 0.01, 0.12),
    techDark,
  );
  slot.rotation.x = -Math.PI / 6;
  slot.position.set(0, 0.88, -0.25);
  root.add(slot);

  return root;
}

/**
 * Showcase shelf (above drawers).
 */
export function createShowcaseShelf(): Group {
  const root = new Group();
  const shelfW = 0.7;
  const shelfD = 0.15;
  const shelfThick = 0.02;

  const shelf = new Mesh(
    new BoxGeometry(shelfW, shelfThick, shelfD),
    wood,
  );
  shelf.position.set(0, 1.15, -0.4);
  root.add(shelf);

  // Front lip.
  const lip = new Mesh(
    new BoxGeometry(shelfW, 0.03, 0.015),
    woodDark,
  );
  lip.position.set(0, 1.15 + shelfThick / 2 + 0.015, -0.4 + shelfD / 2 - 0.0075);
  root.add(lip);

  // Supports.
  for (let xSign of [-1, 1]) {
    const support = new Mesh(
      new BoxGeometry(0.025, 0.2, 0.025),
      woodDark,
    );
    support.position.set(xSign * (shelfW / 2 - 0.0125), 1.05, -0.4);
    root.add(support);
  }

  return root;
}

/**
 * Shop window (background beyond reach > 1.2m).
 * Large pane with warm emissive glow transitioning day→night.
 */
export function createShopWindow(width = 3, height = 2.2): Group {
  const root = new Group();

  // Frame.
  const frameThick = 0.06;
  const frame = new Mesh(
    new BoxGeometry(width, height, frameThick),
    woodDark,
  );
  frame.position.set(0, height / 2 + 0.3, -1.5);
  root.add(frame);

  // Glass panes (emissive for day/night glow).
  const paneW = (width - frameThick * 2) / 3;
  const paneH = height - frameThick * 2;

  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * (paneW + frameThick);
    const pane = new Mesh(
      new BoxGeometry(paneW, paneH, 0.01),
      windowGlow,
    );
    pane.position.set(x, height / 2 + 0.3, -1.5 + frameThick / 2 + 0.005);
    root.add(pane);
  }

  return root;
}

/**
 * Room floor (large, fades via DomeFade).
 */
export function createRoomFloor(size = 12): Mesh {
  const floor = new Mesh(
    new PlaneGeometry(size, size, 2, 2),
    floorMat,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  return floor;
}

/**
 * Room walls (back + sides).
 */
export function createRoomWalls(): Group {
  const root = new Group();
  const wallH = 3;
  const wallW = 12;
  const wallThick = 0.1;

  // Back wall.
  const back = new Mesh(
    new BoxGeometry(wallW, wallH, wallThick),
    wallMat,
  );
  back.position.set(0, wallH / 2, -wallW / 2);
  root.add(back);

  // Left wall.
  const left = new Mesh(
    new BoxGeometry(wallThick, wallH, wallW),
    wallMat,
  );
  left.position.set(-wallW / 2, wallH / 2, 0);
  root.add(left);

  // Right wall.
  const right = new Mesh(
    new BoxGeometry(wallThick, wallH, wallW),
    wallMat,
  );
  right.position.set(wallW / 2, wallH / 2, 0);
  root.add(right);

  return root;
}

/**
 * Smoke-test grab puck (orange cube with DistanceGrabbable).
 * Center of mat at ~0.35m forward, on mat surface.
 */
export function createGrabPuck(): Mesh {
  return new Mesh(
    new BoxGeometry(0.06, 0.06, 0.06),
    orange,
  );
}

/**
 * Smoke-test physical green Power button.
 * Right edge of test rig on mat.
 */
export function createPowerButton(): Mesh {
  return new Mesh(
    new CylinderGeometry(0.025, 0.025, 0.012, 24),
    green,
  );
}

/**
 * Bench Diagnostic Monitor (right side, +35° to +55°).
 * Flat panel with stand.
 */
export function createBenchMonitor(): Group {
  const root = new Group();

  // Screen.
  const screen = new Mesh(
    new BoxGeometry(0.32, 0.2, 0.03),
    techDark,
  );
  screen.position.set(0, 0.95, 0);
  root.add(screen);

  // Stand arm.
  const arm = new Mesh(
    new CylinderGeometry(0.02, 0.02, 0.25, 16),
    metal,
  );
  arm.position.set(0, 0.7, 0);
  root.add(arm);

  // Stand base.
  const base = new Mesh(
    new CylinderGeometry(0.08, 0.1, 0.03, 32),
    metal,
  );
  base.position.set(0, 0.45, 0.1);
  root.add(base);

  return root;
}

/**
 * Shop Tablet (adjustable desk stand, right side).
 * 40cm × 30cm per spec.
 */
export function createShopTablet(): Group {
  const root = new Group();

  // Tablet body.
  const body = new Mesh(
    new BoxGeometry(0.4, 0.25, 0.008),
    techDark,
  );
  body.position.set(0, 1.0, 0);
  root.add(body);

  // Stand.
  const stand = new Mesh(
    new BoxGeometry(0.12, 0.15, 0.12),
    metal,
  );
  stand.position.set(0, 0.8, 0.05);
  root.add(stand);

  return root;
}

/**
 * Receipt Printer (right side, near tablet).
 */
export function createReceiptPrinter(): Group {
  const root = new Group();

  const body = new Mesh(
    new BoxGeometry(0.12, 0.15, 0.18),
    techDark,
  );
  body.position.set(0, 0.95, 0);
  root.add(body);

  // Paper roll slot.
  const slot = new Mesh(
    new BoxGeometry(0.09, 0.005, 0.12),
    new MeshStandardMaterial({ color: 0xffffff }),
  );
  slot.position.set(0, 1.05, 0.07);
  root.add(slot);

  return root;
}

/**
 * Customer counter (background beyond reach > 1.2m).
 * Long counter with speech bubble mounting point.
 */
export function createCustomerCounter(): Group {
  const root = new Group();

  const top = new Mesh(
    new BoxGeometry(1.8, 0.05, 0.5),
    wood,
  );
  top.position.set(0, 1.1, -1.3);
  root.add(top);

  // Front face.
  const front = new Mesh(
    new BoxGeometry(1.8, 1.1, 0.05),
    woodDark,
  );
  front.position.set(0, 0.55, -1.55);
  root.add(front);

  return root;
}

/**
 * Physical **Accept** button on counter edge (per spec).
 */
export function createAcceptButton(): Mesh {
  return new Mesh(
    new CylinderGeometry(0.03, 0.03, 0.015, 24),
    orange, // distinct color for the physical accept button
  );
}

/**
 * Magnetic tool rack (immediate left, -35° to -55°).
 * Holds: Screwdriver, Spudger, Brush, Heat Tool, Loupe, Multimeter.
 */
export function createMagneticToolRack(): Group {
  const root = new Group();

  // Backboard.
  const board = new Mesh(
    new BoxGeometry(0.5, 0.35, 0.02),
    woodDark,
  );
  board.position.set(-0.4, 1.0, 0.15);
  root.add(board);

  // Magnetic strip (metal bar).
  const strip = new Mesh(
    new BoxGeometry(0.45, 0.02, 0.015),
    metal,
  );
  strip.position.set(-0.4, 1.15, 0.16);
  root.add(strip);

  // Tool placeholder hooks (visual only; actual tools are interactables).
  const toolNames = ['Screwdriver', 'Spudger', 'Brush', 'HeatTool', 'Loupe', 'Multimeter'];
  toolNames.forEach((name, i) => {
    const hook = new Mesh(
      new TorusGeometry(0.015, 0.006, 8, 16),
      metal,
    );
    hook.rotation.x = Math.PI / 2;
    hook.position.set(-0.55 + i * 0.09, 1.15, 0.17);
    root.add(hook);
  });

  return root;
}

/**
 * Magnetic Screw Sorting Tray (left of mat).
 * Grid of shallow wells for screws to snap into.
 */
export function createScrewTray(): Group {
  const root = new Group();
  const trayW = 0.25;
  const trayD = 0.18;
  const trayH = 0.025;
  const cols = 4;
  const rows = 3;
  const cellW = trayW / cols;
  const cellD = trayD / rows;

  // Tray base.
  const base = new Mesh(
    new BoxGeometry(trayW, trayH, trayD),
    techDark,
  );
  base.position.set(-0.4, 0.88, 0.2);
  root.add(base);

  // Grid dividers (low walls between wells).
  for (let c = 1; c < cols; c++) {
    const x = -0.4 - trayW / 2 + c * cellW;
    const div = new Mesh(
      new BoxGeometry(0.003, trayH * 0.8, trayD),
      techDark,
    );
    div.position.set(x, 0.88 + trayH * 0.4, 0.2);
    root.add(div);
  }
  for (let r = 1; r < rows; r++) {
    const z = 0.2 - trayD / 2 + r * cellD;
    const div = new Mesh(
      new BoxGeometry(trayW, trayH * 0.8, 0.003),
      techDark,
    );
    div.position.set(-0.4, 0.88 + trayH * 0.4, z);
    root.add(div);
  }

  return root;
}

/**
 * Repair Log Clipboard (left, tilted toward player).
 * Auto-updating checklist + physical Assist button.
 */
export function createRepairLog(): Group {
  const root = new Group();

  // Board.
  const board = new Mesh(
    new BoxGeometry(0.22, 0.3, 0.012),
    wood,
  );
  board.rotation.x = -Math.PI / 8; // tilted toward player
  board.position.set(-0.35, 1.0, 0.25);
  root.add(board);

  // Clip at top.
  const clip = new Mesh(
    new BoxGeometry(0.06, 0.015, 0.02),
    metal,
  );
  clip.position.set(-0.35, 1.15, 0.25 + 0.012 / 2 + 0.01);
  root.add(clip);

  // Assist button on clipboard.
  const assist = new Mesh(
    new CylinderGeometry(0.02, 0.02, 0.01, 24),
    orange,
  );
  assist.position.set(-0.35, 0.88, 0.25 + 0.012 / 2 + 0.015);
  assist.rotation.x = -Math.PI / 8;
  root.add(assist);

  return root;
}

/**
 * Speech Bubble mounting point (on customer counter).
 * Actual bubble is UIKitML.
 */
export function createSpeechBubbleMount(): Mesh {
  const mount = new Mesh(
    new RingGeometry(0.01, 0.02, 16),
    new MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 }),
  );
  mount.position.set(0, 1.8, -1.3);
  mount.rotation.x = -Math.PI / 4;
  return mount;
}