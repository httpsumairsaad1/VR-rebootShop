/**
 * Reboot Shop VR asset manifest.
 *
 * Evaluated independently by the app runtime and the editor — must be
 * deterministic and side-effect free. No World, DOM, timers, or shared
 * object identity.
 */

import { AssetType, defineAssets } from '@iwsdk/core';
import {
  createWorkbenchMat,
  createBenchBase,
  createDeskLamp,
  createComponentDrawers,
  createParcelChute,
  createShowcaseShelf,
  createShopWindow,
  createRoomFloor,
  createRoomWalls,
  createGrabPuck,
  createPowerButton,
  createBenchMonitor,
  createShopTablet,
  createReceiptPrinter,
  createCustomerCounter,
  createAcceptButton,
  createMagneticToolRack,
  createScrewTray,
  createRepairLog,
  createSpeechBubbleMount,
} from './scene-assets/workbench.scene-asset.js';
import {
  createSmartphone,
  createSmartphonePremium,
  createBudgetPhone,
  createFlipPhone,
  createGamepadStandard,
  createGamepadPro,
  createFightStick,
  createEarbudsTWS,
  createHeadphonesOver,
  createHeadphonesOn,
  createGamingHeadset,
  createHandheldRetro,
  createHandheldModern,
  createHandheldClamshell,
  createSmartwatch,
  createPortableSpeaker,
  createActionCamera,
  createDroneMini,
} from './scene-assets/devices.scene-asset.js';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;

const uikitml = (fileName: string, name: string) => ({
  url: publicAssetUrl(`ui/${fileName}`),
  type: AssetType.UIKitML,
  name,
});

export default defineAssets({
  // Workbench core.
  'workbench-mat': createWorkbenchMat(),
  'bench-base': createBenchBase(),
  'desk-lamp': createDeskLamp(),

  // Upper back rim storage & display.
  'component-drawers': createComponentDrawers(),
  'parcel-chute': createParcelChute(),
  'showcase-shelf': createShowcaseShelf(),

  // Room shell.
  'room-floor': createRoomFloor(),
  'room-walls': createRoomWalls(),
  'shop-window': createShopWindow(),

  // Right-side diagnostics & UI.
  'bench-monitor': createBenchMonitor(),
  'shop-tablet': createShopTablet(),
  'receipt-printer': createReceiptPrinter(),

  // Background customer counter.
  'customer-counter': createCustomerCounter(),
  'accept-button': createAcceptButton(),

  // Left-side tools & parts.
  'tool-rack': createMagneticToolRack(),
  'screw-tray': createScrewTray(),
  'repair-log': createRepairLog(),

  // Speech bubble mount (UIKitML overlay).
  'speech-bubble-mount': createSpeechBubbleMount(),

  // Smoke-test interactables.
  'grab-puck': createGrabPuck(),
  'power-button': createPowerButton(),

  // Device procedural assets (referenced by devices.ts).
  'smartphone': createSmartphone(),
  'smartphone-premium': createSmartphonePremium(),
  'budget-phone': createBudgetPhone(),
  'flip-phone': createFlipPhone(),
  'gamepad-standard': createGamepadStandard(),
  'gamepad-pro': createGamepadPro(),
  'fight-stick': createFightStick(),
  'earbuds-tws': createEarbudsTWS(),
  'headphones-over': createHeadphonesOver(),
  'headphones-on': createHeadphonesOn(),
  'gaming-headset': createGamingHeadset(),
  'handheld-retro': createHandheldRetro(),
  'handheld-modern': createHandheldModern(),
  'handheld-clamshell': createHandheldClamshell(),
  'smartwatch': createSmartwatch(),
  'portable-speaker': createPortableSpeaker(),
  'action-camera': createActionCamera(),
  'drone-mini': createDroneMini(),

  // UIKitML panels (created in Milestone 5).
  'bench-monitor-panel': uikitml('bench-monitor.uikitml', 'Bench Monitor'),
  'speech-bubble': uikitml('speech-bubble.uikitml', 'Speech Bubble'),
  'order-tag': uikitml('order-tag.uikitml', 'Order Tag'),
  'repair-log-panel': uikitml('repair-log.uikitml', 'Repair Log'),
  'hint-pill': uikitml('hint-pill.uikitml', 'Hint Pill'),
  'wrist-hud': uikitml('wrist-hud.uikitml', 'Wrist HUD'),
  'shop-tablet-panel': uikitml('shop-tablet.uikitml', 'Shop Tablet'),
  'day-receipt': uikitml('day-receipt.uikitml', 'Day Receipt'),
  'decision-plate': uikitml('decision-plate.uikitml', 'Decision Plate'),
});