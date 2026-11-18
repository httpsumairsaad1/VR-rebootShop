import {
  DistanceGrabbable,
  PokeInteractable,
  RayInteractable,
  createSystem,
} from '@iwsdk/core';
import type { Entity } from '@iwsdk/core';
import { InteractionSmokeTarget } from '../components.js';

export class InteractionSmokeSystem extends createSystem({
  targets: { required: [InteractionSmokeTarget] },
}) {
  init(): void {
    const configure = (entity: Entity): void => {
      const kind = entity.getValue(InteractionSmokeTarget, 'kind');

      if (kind === 'grab') {
        entity.addComponent(DistanceGrabbable, {
          movementMode: 'MoveFromTarget',
          translate: true,
          rotate: true,
          scale: false,
        });
        entity.addComponent(RayInteractable, {});
      } else if (kind === 'poke') {
        entity.addComponent(RayInteractable, {});
        entity.addComponent(PokeInteractable, {});
      }
    };

    this.queries.targets.subscribe('qualify', configure);
    for (const entity of this.queries.targets.entities) {
      configure(entity);
    }
  }
}
