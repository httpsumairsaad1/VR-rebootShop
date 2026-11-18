/**
 * Reboot Shop VR entry point.
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { PanelSystem } from './panel.js';
import { SeatCalibrationSystem } from './seat-calibration.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(SeatCalibrationSystem);
  world.registerSystem(PanelSystem);
});