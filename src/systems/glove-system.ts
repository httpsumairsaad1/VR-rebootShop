import { createSystem } from '@iwsdk/core';
import { installGloveVisuals } from '../lib/glove-visuals.js';

/** IWSDK hand and controller adapters keep the glove visuals driven by XR tracking. */
export class GloveSystem extends createSystem({}) {
  init(): void {
    installGloveVisuals(this.input.xr);
  }
}
