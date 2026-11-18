import { createComponent, defineComponents, RayInteractable, Interactable, Types } from '@iwsdk/core';

export { RayInteractable, Interactable };

/** A physical repair object (tool, phone part, screw...). `id` equals its scene node id. */
export const RepairItem = createComponent('RepairItem', {
  kind: { type: Types.String, default: '' },
  id: { type: Types.String, default: '' },
});
/** Baked glTF clip(s) to play on this node. mode: loop | trigger. */
export const Animated = createComponent('Animated', {
  asset: { type: Types.String, default: '' },
  clip: { type: Types.String, default: '' },
  mode: { type: Types.String, default: 'loop' },
  speed: { type: Types.Float32, default: 1 },
});
/** A physical button: pressing it (poke, pinch, ray or click) emits `press` with this action. */
export const Pressable = createComponent('Pressable', {
  action: { type: Types.String, default: '' },
});

export default defineComponents([RepairItem, Animated, Pressable]);
