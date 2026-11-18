/**
 * Device and fault data for Reboot Shop VR: Gadget Repair.
 *
 * Data-driven: adding a new gadget requires zero new ECS system code — the
 * schema below drives the modular GLB kit, fault table and repair steps.
 */

export type FaultType =
  | 'no_power'
  | 'wont_charge'
  | 'cracked_screen'
  | 'dead_battery'
  | 'loose_connector'
  | 'overheating_dust'
  | 'burnt_capacitor'
  | 'stick_drift';

export type PartDef = {
  id: string;
  name: string;
  count?: number;
};

export type ScrewPointDef = {
  name: string;
  position: [number, number, number];
};

export type ConnectorDef = {
  id: string;
  type: 'plug' | 'socket';
  socket?: string;
};

export type DustZoneDef = string;

export type DeviceDefinition = {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  basePayout: number;
  glbAsset: string;
  parts: PartDef[];
  screwPoints: ScrewPointDef[];
  connectors: ConnectorDef[];
  dustZones: DustZoneDef[];
  possibleFaults: FaultType[];
  requiredSteps: string[];
};

export const devices: DeviceDefinition[] = [
  {
    id: 'smartphone-uwf',
    name: 'Unlocked Smartphone',
    tier: 1,
    basePayout: 50,
    glbAsset: 'assets/smartphone.glb',
    parts: [
      { id: 'case', name: 'Case' },
      { id: 'screws', name: 'Screws', count: 4 },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'PCB' },
      { id: 'usb-c-port', name: 'USB‑C Charge Port' },
    ],
    screwPoints: [
      { name: 'front-left', position: [0.05, 0.02, 0.0] },
      { name: 'front-right', position: [-0.05, 0.02, 0.0] },
      { name: 'rear-left', position: [0.05, -0.02, 0.0] },
      { name: 'rear-right', position: [-0.05, -0.02, 0.0] },
    ],
    connectors: [{ id: 'usb-c', type: 'plug', socket: 'usb-c' }],
    dustZones: ['pcb'],
    possibleFaults: ['wont_charge', 'loose_connector', 'burnt_capacitor'],
    requiredSteps: ['identify_fault', 'remove_screws', 'replace_port', 'reassemble'],
  },
];