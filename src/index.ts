/**
 * Reboot Shop VR entry point.
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { PanelSystem } from './panel.js';
import { InteractionSmokeSystem } from './systems/interaction-smoke.js';
import { UiBindingSystem } from './systems/ui-binding.js';
import { SeatCalibrationSystem } from './seat-calibration.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(SeatCalibrationSystem);
  world.registerSystem(InteractionSmokeSystem);
  world.registerSystem(UiBindingSystem);
  world.registerSystem(PanelSystem);
});