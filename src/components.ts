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
]);