import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { AmbientSystem } from './systems/ambient-system.js';
import { DeviceRepairRuntime } from './systems/repair-system.js';
import { ShopSystem } from './systems/shop-system.js';
import { TutorialSystem } from './systems/tutorial-system.js';
import { GloveSystem } from './systems/glove-system.js';

World.create(document.getElementById('scene-container') as HTMLDivElement, projectOptions)
  .then((world) => {
    world.registerSystem(AmbientSystem).registerSystem(DeviceRepairRuntime).registerSystem(ShopSystem).registerSystem(TutorialSystem).registerSystem(GloveSystem);
  })
  .catch((e) => console.error('Reboot Lab failed to start', e));
