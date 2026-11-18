/**
 * Reboot Shop VR component definitions.
 *
 * Every component used by a system or authored in a scene must be listed in
 * `defineComponents([...])`, or the editor cannot author it.
 * Keep component declarations free of system, DOM, and renderer imports.
 */

import { createComponent, defineComponents, Types } from '@iwsdk/core';

// Core gameplay components (data-driven, per spec).
export const DeviceRoot = createComponent('DeviceRoot', {
  deviceId: { type: Types.String, default: '' },
});

export const RepairPart = createComponent('RepairPart', {
  partType: { type: Types.String, default: '' },
  attached: { type: Types.Boolean, default: false },
});

export const ScrewFastener = createComponent('ScrewFastener', {
  screwId: { type: Types.String, default: '' },
  spinSpeed: { type: Types.Float32, default: 0 },
  removed: { type: Types.Boolean, default: false },
});

export const CableConnector = createComponent('CableConnector', {
  connectorId: { type: Types.String, default: '' },
  isPlugged: { type: Types.Boolean, default: false },
});

export const SnapSocket = createComponent('SnapSocket', {
  socketId: { type: Types.String, default: '' },
});

export const DustSurface = createComponent('DustSurface', {
  dustLevel: { type: Types.Float32, default: 0 },
});

export const SolderJoint = createComponent('SolderJoint', {
  heated: { type: Types.Boolean, default: false },
  temperature: { type: Types.Float32, default: 25 },
});

export const ToolItem = createComponent('ToolItem', {
  toolType: { type: Types.String, default: '' },
  isActive: { type: Types.Boolean, default: false },
});

export const DiagnosticProbe = createComponent('DiagnosticProbe', {
  probeId: { type: Types.String, default: '' },
  value: { type: Types.Float32, default: 0 },
});

export const OrderTicket = createComponent('OrderTicket', {
  ticketId: { type: Types.String, default: '' },
  customerName: { type: Types.String, default: '' },
  deviceId: { type: Types.String, default: '' },
  status: { type: Types.String, default: 'queued' },
});

export const PartDrawerSlot = createComponent('PartDrawerSlot', {
  slotId: { type: Types.String, default: '' },
  partId: { type: Types.String, default: '' },
});

// Milestone 1: Seat calibration component.
export const SeatCalibration = createComponent('SeatCalibration', {
  calibrated: { type: Types.Boolean, default: false },
  matHeight: { type: Types.Float32, default: 0.865 }, // bench top + mat thickness
});

export const InteractionSmokeTarget = createComponent('InteractionSmokeTarget', {
  kind: { type: Types.String, default: 'grab' },
});

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
  speechVisible: { type: Types.Boolean, default: false },
  receiptVisible: { type: Types.Boolean, default: false },
  decisionVisible: { type: Types.Boolean, default: false },
});

export default defineComponents([
  DeviceRoot,
  RepairPart,
  ScrewFastener,
  CableConnector,
  SnapSocket,
  DustSurface,
  SolderJoint,
  ToolItem,
  DiagnosticProbe,
  OrderTicket,
  PartDrawerSlot,
  SeatCalibration,
  InteractionSmokeTarget,
  UiBindingState,
]);