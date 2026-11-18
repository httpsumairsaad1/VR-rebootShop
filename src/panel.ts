/**
 * PanelSystem & InteractionSmokeTestSystem — Milestone 1 Step 1.
 *
 * Handles XR session visibility state, seat calibration hooks,
 * and interaction smoke test logging for grabbables and poke buttons.
 */

import {
  createSystem,
  DistanceGrabbable,
  PokeInteractable,
  RayInteractable,
  Pressed,
  Hovered,
} from '@iwsdk/core';

export class PanelSystem extends createSystem({
  interactables: { required: [RayInteractable] },
}) {
  init(): void {
    if (!this.world.xrEnabled) return;

    this.cleanupFuncs.push(
      this.world.visibilityState.subscribe((visibilityState) => {
        console.log('[Reboot Lab VR] XR Visibility State:', visibilityState);
      }),
    );
  }

  update(): void {
    // Smoke test feedback: check interactables for hover/press states
    for (const entity of this.queries.interactables.entities) {
      const name = entity.name || 'Unknown Entity';
      if (entity.hasComponent(Pressed)) {
        console.log(`[Smoke Test] Pressed: ${name}`);
      } else if (entity.hasComponent(Hovered)) {
        // Optional hover logging if needed
      }
    }
  }
}
