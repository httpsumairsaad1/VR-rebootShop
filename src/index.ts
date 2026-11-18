import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { AmbientSystem } from './systems/ambient-system.js';
import { RepairSystem } from './systems/repair-system.js';
import { ShopSystem } from './systems/shop-system.js';

World.create(document.getElementById('scene-container') as HTMLDivElement, projectOptions)
  .then((world) => {
    world.registerSystem(AmbientSystem).registerSystem(RepairSystem).registerSystem(ShopSystem);
  })
  .catch((e) => console.error('Reboot Lab failed to start', e));
