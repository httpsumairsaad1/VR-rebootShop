/**
 * PanelSystem — Minimal XR session handling for Milestone 1.
 *
 * The full bench-monitor.uikitml with Start Shift button is built in Milestone 5.
 * For now, this system just ensures XR can launch and handles the visibility state.
 */

import { createSystem, UIKitMLAsset, VisibilityState } from '@iwsdk/core';

export class PanelSystem extends createSystem({}) {
  init(): void {
    // In Milestone 1, we don't have a welcome panel yet.
    // The dev server launches XR automatically when "offer: always" is set.
    // This system is a placeholder for the future bench-monitor panel binding.

    if (!this.world.xrEnabled) return;

    this.cleanupFuncs.push(
      this.world.visibilityState.subscribe((visibilityState) => {
        // Future: show/hide UI based on immersive state.
      }),
    );
  }
}