import { AssetType, defineAssets } from '@iwsdk/core';

const base = import.meta.env.BASE_URL;
const MODELS = [
  'phone-body', 'phone-back', 'phone-screw', 'phone-battery', 'phone-battery-bad', 'phone-port', 'phone-port-bad', 'phone-plug',
  'tool-driver', 'tool-spudger', 'tool-brush', 'tool-multimeter', 'tool-probe', 'tray-magnetic', 'tray-out', 'btn-accept', 'btn-day', 'test-rig',
  'workbench', 'repair-mat', 'shop-room', 'shop-window', 'shop-door', 'reception-counter', 'wall-shelf', 'lamp-desk', 'lamp-pendant',
  'bench-monitor', 'oscilloscope', 'desk-fan', 'coffee-mug', 'wall-clock', 'potted-plant', 'parts-bins', 'tool-board', 'solder-station',
  'shop-tablet', 'intake-chute', 'receipt-printer', 'sign-open', 'coin', 'star', 'customer-a', 'customer-b', 'customer-c',
];
const PANELS = ['hud-panel', 'order-panel', 'tablet-panel'];

export default defineAssets({
  ...Object.fromEntries(MODELS.map((m) => [m, { url: `${base}models/${m}.glb`, type: AssetType.GLTF }])),
  ...Object.fromEntries(PANELS.map((p) => [p, { url: `${base}ui/${p}.uikitml`, type: AssetType.UIKitML }])),
});
