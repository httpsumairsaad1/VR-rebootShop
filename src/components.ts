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

/** Tutorial/guidance state for first-time player experience. */
export const TutorialState = createComponent('TutorialState', {
  step: { type: Types.Int8, default: 0 },
  completedSteps: { type: Types.Int8, default: 0 },
  showGuide: { type: Types.Boolean, default: true },
  firstJobAccepted: { type: Types.Boolean, default: false },
  firstCoverOpened: { type: Types.Boolean, default: false },
  firstScrewRemoved: { type: Types.Boolean, default: false },
  firstPartSwapped: { type: Types.Boolean, default: false },
  firstPowerTest: { type: Types.Boolean, default: false },
  firstPhoneReturned: { type: Types.Boolean, default: false },
});

/** Marks an entity as the current "guided target" - highlights in sky blue. */
export const GuidedTarget = createComponent('GuidedTarget', {
  active: { type: Types.Boolean, default: false },
  stepIndex: { type: Types.Int8, default: 0 },
});

/** Interaction smoke test target. */
export const InteractionSmokeTarget = createComponent('InteractionSmokeTarget', {
  kind: { type: Types.String, default: 'grab' },
});

/** UI binding state for all dynamic text and visibility in the game. */
export const UiBindingState = createComponent('UiBindingState', {
  day: { type: Types.String, default: 'DAY 1' },
  stars: { type: Types.String, default: 'STARS 3' },
  coins: { type: Types.String, default: '150 COINS' },
  orderNumber: { type: Types.String, default: 'REPAIR ORDER / 101' },
  customer: { type: Types.String, default: 'CUSTOMER / MINA' },
  device: { type: Types.String, default: 'Smartphone' },
  symptom: { type: Types.String, default: "WON'T CHARGE" },
  reward: { type: Types.String, default: 'Payout: 45 coins' },
  customerLine: { type: Types.String, default: 'My phone stopped charging.' },
  monitorStatus: { type: Types.String, default: 'SYSTEM READY' },
  bootTest: { type: Types.String, default: 'Boot test: awaiting device' },
  voltage: { type: Types.String, default: '0.0 V' },
  repairHeading: { type: Types.String, default: 'Smartphone / Charging' },
  repairStep1: { type: Types.String, default: '[x] Inspect the device' },
  repairStep2: { type: Types.String, default: '[ ] Open the back cover' },
  repairStep3: { type: Types.String, default: '[ ] Replace the charge port' },
  repairStep4: { type: Types.String, default: '[ ] Test power and charging' },
  hint: { type: Types.String, default: 'Flip the phone to inspect its back.' },
  contracts: { type: Types.String, default: 'CONTRACTS / 1 open repair' },
  crate: { type: Types.String, default: 'DAILY MYSTERY CRATE' },
  crateDetail: { type: Types.String, default: '2 hidden faults / 5 minute timer' },
  shopPage: { type: Types.String, default: 'Choose a tab to browse the shop.' },
  receiptEarnings: { type: Types.String, default: 'Earnings: 0 coins' },
  receiptStars: { type: Types.String, default: 'Stars earned: 0' },
  medal: { type: Types.String, default: 'MEDAL / NOT EARNED' },
  nextDay: { type: Types.String, default: 'Open Day 2 on the shop tablet' },
  decisionRush: { type: Types.String, default: 'RUSH IT NOW / 10 coins' },
  decisionPark: { type: Types.String, default: 'PARK IT / order for tomorrow' },
  decisionContinue: { type: Types.String, default: 'KEEP WORKING / choose another step' },
  guideStepNum: { type: Types.String, default: '1' },
  guideStepTitle: { type: Types.String, default: 'Welcome to Reboot Lab' },
  guideStepDetail: { type: Types.String, default: 'A customer is waiting. Press the GREEN button on the bench to accept the job.' },
  guideTip: { type: Types.String, default: 'The next tool you need will glow GREEN. Grab it and follow the step.' },
  guideProgress: { type: Types.String, default: '0%' },
  speechVisible: { type: Types.Boolean, default: false },
  receiptVisible: { type: Types.Boolean, default: false },
  decisionVisible: { type: Types.Boolean, default: false },
  guideVisible: { type: Types.Boolean, default: true },
});

export default defineComponents([RepairItem, Animated, Pressable, TutorialState, GuidedTarget, UiBindingState, InteractionSmokeTarget]);
