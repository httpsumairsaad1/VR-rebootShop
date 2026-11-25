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
  | 'stick_drift'
  | 'no_audio'
  | 'mic_mute'
  | 'trigger_stuck'
  | 'face_button_stuck'
  | 'hinge_loose'
  | 'cartridge_read_error'
  | 'shoulder_button_stuck';

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
  // ========== PHONES (Tier 1-2) ==========
  {
    id: 'smartphone-uwf',
    name: 'Unlocked Smartphone',
    tier: 1,
    basePayout: 50,
    glbAsset: 'smartphone',
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
  {
    id: 'smartphone-premium',
    name: 'Premium Smartphone',
    tier: 2,
    basePayout: 120,
    glbAsset: 'smartphone-premium',
    parts: [
      { id: 'case', name: 'Glass Back' },
      { id: 'screws', name: 'Pentalobe Screws', count: 2 },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'screen', name: 'OLED Display' },
      { id: 'usb-c-port', name: 'USB‑C Charge Port' },
      { id: 'earpiece', name: 'Earpiece Speaker' },
    ],
    screwPoints: [
      { name: 'bottom-left', position: [0.06, 0.03, 0.0] },
      { name: 'bottom-right', position: [-0.06, 0.03, 0.0] },
    ],
    connectors: [
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'screen', type: 'plug', socket: 'display' },
    ],
    dustZones: ['pcb', 'earpiece'],
    possibleFaults: ['cracked_screen', 'wont_charge', 'dead_battery', 'no_audio', 'overheating_dust'],
    requiredSteps: ['identify_fault', 'heat_glass', 'remove_screws', 'disconnect_battery', 'replace_part', 'reassemble'],
  },
  {
    id: 'budget-phone',
    name: 'Budget Smartphone',
    tier: 1,
    basePayout: 35,
    glbAsset: 'budget-phone',
    parts: [
      { id: 'case', name: 'Plastic Back' },
      { id: 'screws', name: 'Screws', count: 6 },
      { id: 'battery', name: 'Removable Battery' },
      { id: 'pcb', name: 'PCB' },
      { id: 'micro-usb-port', name: 'Micro‑USB Port' },
      { id: 'headphone-jack', name: '3.5mm Jack' },
    ],
    screwPoints: [
      { name: 'tl', position: [0.055, 0.025, 0.0] },
      { name: 'tr', position: [-0.055, 0.025, 0.0] },
      { name: 'ml', position: [0.055, 0.0, 0.0] },
      { name: 'mr', position: [-0.055, 0.0, 0.0] },
      { name: 'bl', position: [0.055, -0.025, 0.0] },
      { name: 'br', position: [-0.055, -0.025, 0.0] },
    ],
    connectors: [
      { id: 'micro-usb', type: 'plug', socket: 'micro-usb' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'headphone-jack', type: 'socket', socket: 'audio' },
    ],
    dustZones: ['pcb', 'headphone-jack'],
    possibleFaults: ['wont_charge', 'no_audio', 'dead_battery', 'loose_connector'],
    requiredSteps: ['identify_fault', 'remove_screws', 'replace_part', 'reassemble'],
  },
  {
    id: 'flip-phone',
    name: 'Retro Flip Phone',
    tier: 1,
    basePayout: 40,
    glbAsset: 'flip-phone',
    parts: [
      { id: 'top-half', name: 'Top Half' },
      { id: 'bottom-half', name: 'Bottom Half' },
      { id: 'hinge', name: 'Hinge Assembly' },
      { id: 'screws', name: 'Screws', count: 4 },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'screen', name: 'Internal Display' },
      { id: 'ext-screen', name: 'External Display' },
      { id: 'keypad', name: 'Keypad' },
    ],
    screwPoints: [
      { name: 'hinge-top', position: [0.0, 0.04, 0.0] },
      { name: 'hinge-bottom', position: [0.0, -0.04, 0.0] },
      { name: 'back-left', position: [0.03, 0.0, -0.01] },
      { name: 'back-right', position: [-0.03, 0.0, -0.01] },
    ],
    connectors: [
      { id: 'hinge-flex', type: 'plug', socket: 'hinge' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'ext-screen', type: 'plug', socket: 'ext-display' },
    ],
    dustZones: ['hinge', 'keypad'],
    possibleFaults: ['hinge_loose', 'cracked_screen', 'dead_battery', 'no_audio'],
    requiredSteps: ['identify_fault', 'remove_screws', 'disconnect_flex', 'replace_hinge', 'reassemble'],
  },

  // ========== CONTROLLERS (Tier 1-2) ==========
  {
    id: 'gamepad-standard',
    name: 'Standard Gamepad',
    tier: 1,
    basePayout: 45,
    glbAsset: 'gamepad-standard',
    parts: [
      { id: 'shell-top', name: 'Top Shell' },
      { id: 'shell-bottom', name: 'Bottom Shell' },
      { id: 'screws', name: 'Screws', count: 5 },
      { id: 'battery', name: 'Battery Pack' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'left-stick', name: 'Left Thumbstick Module' },
      { id: 'right-stick', name: 'Right Thumbstick Module' },
      { id: 'face-buttons', name: 'Face Button Pad' },
      { id: 'triggers', name: 'Trigger Assembly' },
      { id: 'rumble-left', name: 'Left Rumble Motor' },
      { id: 'rumble-right', name: 'Right Rumble Motor' },
    ],
    screwPoints: [
      { name: 'grip-left', position: [-0.05, -0.02, 0.02] },
      { name: 'grip-right', position: [0.05, -0.02, 0.02] },
      { name: 'center', position: [0.0, 0.0, 0.01] },
      { name: 'trigger-left', position: [-0.04, 0.03, -0.01] },
      { name: 'trigger-right', position: [0.04, 0.03, -0.01] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'left-stick', type: 'plug', socket: 'stick-l' },
      { id: 'right-stick', type: 'plug', socket: 'stick-r' },
      { id: 'triggers', type: 'plug', socket: 'triggers' },
    ],
    dustZones: ['left-stick', 'right-stick', 'triggers', 'face-buttons'],
    possibleFaults: ['stick_drift', 'trigger_stuck', 'face_button_stuck', 'no_power', 'dead_battery'],
    requiredSteps: ['identify_fault', 'remove_screws', 'clean_or_replace_stick', 'clean_triggers', 'reassemble'],
  },
  {
    id: 'gamepad-pro',
    name: 'Pro Gamepad',
    tier: 2,
    basePayout: 95,
    glbAsset: 'gamepad-pro',
    parts: [
      { id: 'shell-top', name: 'Top Shell' },
      { id: 'shell-bottom', name: 'Bottom Shell' },
      { id: 'screws', name: 'Screws', count: 6 },
      { id: 'battery', name: 'Rechargeable Battery' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'left-stick', name: 'Hall Effect Left Stick' },
      { id: 'right-stick', name: 'Hall Effect Right Stick' },
      { id: 'face-buttons', name: 'Mechanical Face Buttons' },
      { id: 'triggers', name: 'Adaptive Trigger Assembly' },
      { id: 'shoulder-l', name: 'Left Shoulder Button' },
      { id: 'shoulder-r', name: 'Right Shoulder Button' },
      { id: 'paddle-l', name: 'Left Back Paddle' },
      { id: 'paddle-r', name: 'Right Back Paddle' },
      { id: 'rumble-hd', name: 'HD Rumble Motors', count: 2 },
      { id: 'gyro', name: 'Gyroscope Module' },
    ],
    screwPoints: [
      { name: 'grip-l', position: [-0.055, -0.025, 0.025] },
      { name: 'grip-r', position: [0.055, -0.025, 0.025] },
      { name: 'mid-l', position: [-0.03, 0.01, 0.015] },
      { name: 'mid-r', position: [0.03, 0.01, 0.015] },
      { name: 'trigger-l', position: [-0.045, 0.035, -0.01] },
      { name: 'trigger-r', position: [0.045, 0.035, -0.01] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'left-stick', type: 'plug', socket: 'stick-l' },
      { id: 'right-stick', type: 'plug', socket: 'stick-r' },
      { id: 'triggers', type: 'plug', socket: 'triggers' },
      { id: 'shoulders', type: 'plug', socket: 'shoulders' },
      { id: 'paddles', type: 'plug', socket: 'paddles' },
      { id: 'gyro', type: 'plug', socket: 'gyro' },
    ],
    dustZones: ['left-stick', 'right-stick', 'triggers', 'shoulder-l', 'shoulder-r', 'face-buttons'],
    possibleFaults: ['stick_drift', 'trigger_stuck', 'shoulder_button_stuck', 'face_button_stuck', 'no_power', 'overheating_dust'],
    requiredSteps: ['identify_fault', 'remove_screws', 'clean_or_replace_stick', 'clean_triggers', 'clean_shoulders', 'reassemble'],
  },
  {
    id: 'fight-stick',
    name: 'Arcade Fight Stick',
    tier: 2,
    basePayout: 110,
    glbAsset: 'fight-stick',
    parts: [
      { id: 'case', name: 'Case' },
      { id: 'screws', name: 'Screws', count: 8 },
      { id: 'pcb', name: 'Main Board' },
      { id: 'joystick', name: 'Sanwa-style Joystick' },
      { id: 'buttons', name: 'Arcade Buttons', count: 8 },
      { id: 'usb-cable', name: 'USB Cable' },
      { id: 'artwork', name: 'Top Artwork' },
    ],
    screwPoints: [
      { name: 'corner-tl', position: [-0.08, 0.08, 0.0] },
      { name: 'corner-tr', position: [0.08, 0.08, 0.0] },
      { name: 'corner-bl', position: [-0.08, -0.08, 0.0] },
      { name: 'corner-br', position: [0.08, -0.08, 0.0] },
      { name: 'mid-t', position: [0.0, 0.08, 0.0] },
      { name: 'mid-b', position: [0.0, -0.08, 0.0] },
      { name: 'mid-l', position: [-0.08, 0.0, 0.0] },
      { name: 'mid-r', position: [0.08, 0.0, 0.0] },
    ],
    connectors: [
      { id: 'joystick', type: 'plug', socket: 'joystick' },
      { id: 'buttons', type: 'plug', socket: 'buttons' },
      { id: 'usb', type: 'plug', socket: 'usb' },
    ],
    dustZones: ['joystick', 'buttons'],
    possibleFaults: ['stick_drift', 'face_button_stuck', 'loose_connector', 'no_power'],
    requiredSteps: ['identify_fault', 'remove_screws', 'replace_joystick', 'replace_buttons', 'reassemble'],
  },

  // ========== HEADPHONES / AUDIO (Tier 1-2) ==========
  {
    id: 'earbuds-tws',
    name: 'True Wireless Earbuds',
    tier: 1,
    basePayout: 40,
    glbAsset: 'earbuds-tws',
    parts: [
      { id: 'case', name: 'Charging Case' },
      { id: 'left-bud', name: 'Left Earbud' },
      { id: 'right-bud', name: 'Right Earbud' },
      { id: 'case-battery', name: 'Case Battery' },
      { id: 'bud-battery-l', name: 'Left Bud Battery' },
      { id: 'bud-battery-r', name: 'Right Bud Battery' },
      { id: 'driver-l', name: 'Left Driver' },
      { id: 'driver-r', name: 'Right Driver' },
      { id: 'mic-l', name: 'Left Microphone' },
      { id: 'mic-r', name: 'Right Microphone' },
      { id: 'touch-sensor-l', name: 'Left Touch Sensor' },
      { id: 'touch-sensor-r', name: 'Right Touch Sensor' },
    ],
    screwPoints: [
      { name: 'case-hinge', position: [0.0, 0.0, 0.015] },
      { name: 'left-bud', position: [-0.015, 0.0, 0.0] },
      { name: 'right-bud', position: [0.015, 0.0, 0.0] },
    ],
    connectors: [
      { id: 'case-battery', type: 'plug', socket: 'case-battery' },
      { id: 'left-bud', type: 'plug', socket: 'bud-l' },
      { id: 'right-bud', type: 'plug', socket: 'bud-r' },
    ],
    dustZones: ['mic-l', 'mic-r', 'touch-sensor-l', 'touch-sensor-r', 'driver-l', 'driver-r'],
    possibleFaults: ['dead_battery', 'no_audio', 'mic_mute', 'wont_charge', 'overheating_dust'],
    requiredSteps: ['identify_fault', 'open_case', 'replace_bud_battery', 'clean_mics', 'reassemble'],
  },
  {
    id: 'headphones-over',
    name: 'Over-Ear Headphones',
    tier: 2,
    basePayout: 85,
    glbAsset: 'headphones-over',
    parts: [
      { id: 'headband', name: 'Headband' },
      { id: 'left-cup', name: 'Left Ear Cup' },
      { id: 'right-cup', name: 'Right Ear Cup' },
      { id: 'left-pad', name: 'Left Ear Pad' },
      { id: 'right-pad', name: 'Right Ear Pad' },
      { id: 'left-driver', name: 'Left Driver' },
      { id: 'right-driver', name: 'Right Driver' },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Bluetooth/ANC Board' },
      { id: 'hinge-l', name: 'Left Hinge' },
      { id: 'hinge-r', name: 'Right Hinge' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'anc-mic', name: 'ANC Microphones', count: 4 },
    ],
    screwPoints: [
      { name: 'left-cup', position: [-0.05, 0.0, 0.0] },
      { name: 'right-cup', position: [0.05, 0.0, 0.0] },
      { name: 'hinge-l', position: [-0.06, 0.02, -0.01] },
      { name: 'hinge-r', position: [0.06, 0.02, -0.01] },
      { name: 'headband', position: [0.0, 0.06, 0.0] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'left-driver', type: 'plug', socket: 'driver-l' },
      { id: 'right-driver', type: 'plug', socket: 'driver-r' },
      { id: 'anc-mics', type: 'plug', socket: 'anc' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
    ],
    dustZones: ['anc-mic', 'left-driver', 'right-driver', 'hinge-l', 'hinge-r'],
    possibleFaults: ['no_audio', 'dead_battery', 'wont_charge', 'mic_mute', 'hinge_loose', 'overheating_dust'],
    requiredSteps: ['identify_fault', 'remove_pads', 'remove_screws', 'replace_driver_or_battery', 'clean_anc_mics', 'reassemble'],
  },
  {
    id: 'headphones-on',
    name: 'On-Ear Headphones',
    tier: 1,
    basePayout: 50,
    glbAsset: 'headphones-on',
    parts: [
      { id: 'headband', name: 'Headband' },
      { id: 'left-cup', name: 'Left Cup' },
      { id: 'right-cup', name: 'Right Cup' },
      { id: 'left-pad', name: 'Left Pad' },
      { id: 'right-pad', name: 'Right Pad' },
      { id: 'left-driver', name: 'Left Driver' },
      { id: 'right-driver', name: 'Right Driver' },
      { id: 'pcb', name: 'Wired Board' },
      { id: 'cable', name: 'Detachable Cable' },
    ],
    screwPoints: [
      { name: 'left-cup', position: [-0.04, 0.0, 0.0] },
      { name: 'right-cup', position: [0.04, 0.0, 0.0] },
      { name: 'headband-top', position: [0.0, 0.05, 0.0] },
    ],
    connectors: [
      { id: 'cable', type: 'plug', socket: 'audio' },
      { id: 'left-driver', type: 'plug', socket: 'driver-l' },
      { id: 'right-driver', type: 'plug', socket: 'driver-r' },
    ],
    dustZones: ['left-driver', 'right-driver'],
    possibleFaults: ['no_audio', 'loose_connector', 'cracked_screen'],
    requiredSteps: ['identify_fault', 'remove_pads', 'remove_screws', 'replace_driver', 'reassemble'],
  },
  {
    id: 'gaming-headset',
    name: 'Gaming Headset',
    tier: 2,
    basePayout: 75,
    glbAsset: 'gaming-headset',
    parts: [
      { id: 'headband', name: 'Headband' },
      { id: 'left-cup', name: 'Left Cup' },
      { id: 'right-cup', name: 'Right Cup' },
      { id: 'left-pad', name: 'Left Pad' },
      { id: 'right-pad', name: 'Right Pad' },
      { id: 'left-driver', name: 'Left Driver' },
      { id: 'right-driver', name: 'Right Driver' },
      { id: 'boom-mic', name: 'Boom Microphone' },
      { id: 'pcb', name: 'Audio/USB Board' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'volume-wheel', name: 'Volume Wheel' },
      { id: 'mute-switch', name: 'Mute Switch' },
    ],
    screwPoints: [
      { name: 'left-cup', position: [-0.045, 0.0, 0.0] },
      { name: 'right-cup', position: [0.045, 0.0, 0.0] },
      { name: 'mic-base', position: [-0.05, -0.01, 0.02] },
    ],
    connectors: [
      { id: 'left-driver', type: 'plug', socket: 'driver-l' },
      { id: 'right-driver', type: 'plug', socket: 'driver-r' },
      { id: 'boom-mic', type: 'plug', socket: 'mic' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'volume-wheel', type: 'plug', socket: 'volume' },
    ],
    dustZones: ['boom-mic', 'volume-wheel', 'mute-switch', 'left-driver', 'right-driver'],
    possibleFaults: ['no_audio', 'mic_mute', 'wont_charge', 'face_button_stuck', 'loose_connector'],
    requiredSteps: ['identify_fault', 'remove_pads', 'remove_screws', 'replace_mic_or_driver', 'clean_controls', 'reassemble'],
  },

  // ========== HANDHELD CONSOLES (Tier 2-3) ==========
  {
    id: 'handheld-retro',
    name: 'Retro Handheld Console',
    tier: 2,
    basePayout: 100,
    glbAsset: 'handheld-retro',
    parts: [
      { id: 'shell-front', name: 'Front Shell' },
      { id: 'shell-back', name: 'Back Shell' },
      { id: 'screws', name: 'Screws', count: 6 },
      { id: 'screen', name: 'LCD Screen' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'battery', name: 'Battery' },
      { id: 'dpad', name: 'D-Pad' },
      { id: 'face-buttons', name: 'Face Buttons (A/B/X/Y)' },
      { id: 'shoulder-l', name: 'Left Shoulder' },
      { id: 'shoulder-r', name: 'Right Shoulder' },
      { id: 'start-select', name: 'Start/Select Buttons' },
      { id: 'cartridge-slot', name: 'Cartridge Slot' },
      { id: 'volume-slider', name: 'Volume Slider' },
      { id: 'power-switch', name: 'Power Switch' },
      { id: 'headphone-jack', name: '3.5mm Jack' },
      { id: 'speaker', name: 'Speaker' },
    ],
    screwPoints: [
      { name: 'tl', position: [-0.05, 0.04, 0.0] },
      { name: 'tr', position: [0.05, 0.04, 0.0] },
      { name: 'ml', position: [-0.05, 0.0, 0.0] },
      { name: 'mr', position: [0.05, 0.0, 0.0] },
      { name: 'bl', position: [-0.05, -0.04, 0.0] },
      { name: 'br', position: [0.05, -0.04, 0.0] },
    ],
    connectors: [
      { id: 'screen', type: 'plug', socket: 'display' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'cartridge', type: 'socket', socket: 'cartridge' },
      { id: 'headphone-jack', type: 'socket', socket: 'audio' },
      { id: 'speaker', type: 'plug', socket: 'speaker' },
    ],
    dustZones: ['cartridge-slot', 'dpad', 'face-buttons', 'shoulder-l', 'shoulder-r', 'volume-slider'],
    possibleFaults: ['cartridge_read_error', 'dead_battery', 'cracked_screen', 'stick_drift', 'shoulder_button_stuck', 'no_audio'],
    requiredSteps: ['identify_fault', 'remove_screws', 'clean_cartridge_slot', 'replace_screen_or_battery', 'clean_controls', 'reassemble'],
  },
  {
    id: 'handheld-modern',
    name: 'Modern Handheld Console',
    tier: 3,
    basePayout: 200,
    glbAsset: 'handheld-modern',
    parts: [
      { id: 'shell-front', name: 'Front Shell' },
      { id: 'shell-back', name: 'Back Shell' },
      { id: 'mid-frame', name: 'Mid Frame' },
      { id: 'screws', name: 'Screws', count: 10 },
      { id: 'screen', name: 'OLED Touchscreen' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'battery', name: 'Battery' },
      { id: 'left-stick', name: 'Left Analog Stick' },
      { id: 'right-stick', name: 'Right Analog Stick' },
      { id: 'dpad', name: 'D-Pad' },
      { id: 'face-buttons', name: 'Face Buttons' },
      { id: 'shoulder-l', name: 'Left Shoulder (L/L2)' },
      { id: 'shoulder-r', name: 'Right Shoulder (R/R2)' },
      { id: 'trigger-l', name: 'Left Trigger' },
      { id: 'trigger-r', name: 'Right Trigger' },
      { id: 'home-button', name: 'Home Button' },
      { id: 'power-button', name: 'Power Button' },
      { id: 'volume-buttons', name: 'Volume Buttons' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'headphone-jack', name: '3.5mm Jack' },
      { id: 'game-slot', name: 'Game Card Slot' },
      { id: 'sd-slot', name: 'microSD Slot' },
      { id: 'fan', name: 'Cooling Fan' },
      { id: 'speakers', name: 'Stereo Speakers', count: 2 },
      { id: 'mic', name: 'Microphone' },
      { id: 'vibration', name: 'HD Rumble' },
    ],
    screwPoints: [
      { name: 'tl', position: [-0.06, 0.045, 0.0] },
      { name: 'tr', position: [0.06, 0.045, 0.0] },
      { name: 'ml', position: [-0.06, 0.0, 0.0] },
      { name: 'mr', position: [0.06, 0.0, 0.0] },
      { name: 'bl', position: [-0.06, -0.045, 0.0] },
      { name: 'br', position: [0.06, -0.045, 0.0] },
      { name: 'stick-l', position: [-0.03, 0.02, 0.01] },
      { name: 'stick-r', position: [0.03, 0.02, 0.01] },
      { name: 'mid', position: [0.0, 0.0, 0.0] },
      { name: 'fan', position: [0.0, -0.02, 0.015] },
    ],
    connectors: [
      { id: 'screen', type: 'plug', socket: 'display' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'left-stick', type: 'plug', socket: 'stick-l' },
      { id: 'right-stick', type: 'plug', socket: 'stick-r' },
      { id: 'game-slot', type: 'socket', socket: 'game-card' },
      { id: 'sd-slot', type: 'socket', socket: 'sd-card' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'headphone-jack', type: 'socket', socket: 'audio' },
      { id: 'fan', type: 'plug', socket: 'fan' },
      { id: 'speakers', type: 'plug', socket: 'speakers' },
      { id: 'vibration', type: 'plug', socket: 'vibration' },
    ],
    dustZones: ['game-slot', 'sd-slot', 'left-stick', 'right-stick', 'fan', 'triggers', 'shoulders'],
    possibleFaults: ['stick_drift', 'trigger_stuck', 'shoulder_button_stuck', 'cartridge_read_error', 'dead_battery', 'cracked_screen', 'wont_charge', 'overheating_dust', 'no_audio', 'mic_mute'],
    requiredSteps: ['identify_fault', 'remove_screws', 'disconnect_battery', 'clean_slots', 'clean_sticks', 'clean_fan', 'replace_part', 'reassemble'],
  },
  {
    id: 'handheld-clamshell',
    name: 'Clamshell Handheld',
    tier: 2,
    basePayout: 130,
    glbAsset: 'handheld-clamshell',
    parts: [
      { id: 'top-shell', name: 'Top Shell' },
      { id: 'bottom-shell', name: 'Bottom Shell' },
      { id: 'hinge', name: 'Hinge Assembly' },
      { id: 'screws', name: 'Screws', count: 8 },
      { id: 'top-screen', name: 'Top Screen' },
      { id: 'bottom-screen', name: 'Bottom Touchscreen' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'battery', name: 'Battery' },
      { id: 'dpad', name: 'D-Pad' },
      { id: 'face-buttons', name: 'Face Buttons' },
      { id: 'shoulder-l', name: 'Left Shoulder' },
      { id: 'shoulder-r', name: 'Right Shoulder' },
      { id: 'start-select', name: 'Start/Select' },
      { id: 'game-slot', name: 'Game Card Slot' },
      { id: 'wifi-board', name: 'WiFi Board' },
      { id: 'mic', name: 'Microphone' },
      { id: 'speakers', name: 'Speakers', count: 2 },
    ],
    screwPoints: [
      { name: 'hinge-top', position: [0.0, 0.05, 0.01] },
      { name: 'hinge-bottom', position: [0.0, -0.05, 0.01] },
      { name: 'back-tl', position: [-0.04, 0.03, -0.01] },
      { name: 'back-tr', position: [0.04, 0.03, -0.01] },
      { name: 'back-bl', position: [-0.04, -0.03, -0.01] },
      { name: 'back-br', position: [0.04, -0.03, -0.01] },
      { name: 'mid-l', position: [-0.04, 0.0, 0.0] },
      { name: 'mid-r', position: [0.04, 0.0, 0.0] },
    ],
    connectors: [
      { id: 'hinge-flex', type: 'plug', socket: 'hinge' },
      { id: 'top-screen', type: 'plug', socket: 'display-top' },
      { id: 'bottom-screen', type: 'plug', socket: 'display-bottom' },
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'game-slot', type: 'socket', socket: 'game-card' },
      { id: 'wifi', type: 'plug', socket: 'wifi' },
    ],
    dustZones: ['hinge', 'game-slot', 'dpad', 'face-buttons', 'shoulder-l', 'shoulder-r'],
    possibleFaults: ['hinge_loose', 'cracked_screen', 'cartridge_read_error', 'dead_battery', 'stick_drift', 'shoulder_button_stuck', 'no_audio', 'mic_mute'],
    requiredSteps: ['identify_fault', 'remove_screws', 'disconnect_hinge_flex', 'clean_game_slot', 'replace_screen_or_hinge', 'reassemble'],
  },

  // ========== BONUS: OTHER GADGETS ==========
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    tier: 1,
    basePayout: 55,
    glbAsset: 'smartwatch',
    parts: [
      { id: 'case', name: 'Case' },
      { id: 'screen', name: 'OLED Display' },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'crown', name: 'Digital Crown' },
      { id: 'side-button', name: 'Side Button' },
      { id: 'heart-rate', name: 'HR Sensor' },
      { id: 'speaker', name: 'Speaker' },
      { id: 'mic', name: 'Microphone' },
      { id: 'strap', name: 'Strap' },
    ],
    screwPoints: [
      { name: 'back-1', position: [-0.015, 0.015, -0.005] },
      { name: 'back-2', position: [0.015, 0.015, -0.005] },
      { name: 'back-3', position: [-0.015, -0.015, -0.005] },
      { name: 'back-4', position: [0.015, -0.015, -0.005] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'screen', type: 'plug', socket: 'display' },
      { id: 'crown', type: 'plug', socket: 'crown' },
      { id: 'heart-rate', type: 'plug', socket: 'hr' },
    ],
    dustZones: ['crown', 'side-button', 'heart-rate', 'mic', 'speaker'],
    possibleFaults: ['cracked_screen', 'dead_battery', 'wont_charge', 'no_audio', 'mic_mute', 'face_button_stuck'],
    requiredSteps: ['identify_fault', 'remove_screws', 'disconnect_battery', 'replace_screen_or_battery', 'clean_sensors', 'reassemble'],
  },
  {
    id: 'portable-speaker',
    name: 'Portable Bluetooth Speaker',
    tier: 1,
    basePayout: 35,
    glbAsset: 'portable-speaker',
    parts: [
      { id: 'shell', name: 'Outer Shell' },
      { id: 'grille', name: 'Speaker Grille' },
      { id: 'driver', name: 'Main Driver' },
      { id: 'passive-radiator', name: 'Passive Radiator' },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Bluetooth/Amp Board' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'aux-in', name: 'AUX Input' },
      { id: 'power-button', name: 'Power Button' },
      { id: 'volume-buttons', name: 'Volume Buttons' },
      { id: 'bt-button', name: 'Bluetooth Button' },
    ],
    screwPoints: [
      { name: 'bottom-1', position: [-0.02, -0.03, 0.0] },
      { name: 'bottom-2', position: [0.02, -0.03, 0.0] },
      { name: 'side-1', position: [-0.025, 0.0, 0.02] },
      { name: 'side-2', position: [0.025, 0.0, 0.02] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'driver', type: 'plug', socket: 'driver' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'aux', type: 'socket', socket: 'audio' },
    ],
    dustZones: ['driver', 'passive-radiator', 'power-button', 'volume-buttons', 'bt-button'],
    possibleFaults: ['no_audio', 'dead_battery', 'wont_charge', 'face_button_stuck', 'loose_connector'],
    requiredSteps: ['identify_fault', 'remove_screws', 'replace_driver_or_battery', 'clean_buttons', 'reassemble'],
  },
  {
    id: 'action-camera',
    name: 'Action Camera',
    tier: 2,
    basePayout: 90,
    glbAsset: 'action-camera',
    parts: [
      { id: 'front-door', name: 'Front Lens Door' },
      { id: 'side-door', name: 'Side Port Door' },
      { id: 'battery-door', name: 'Battery Door' },
      { id: 'screen', name: 'Touch Screen' },
      { id: 'lens', name: 'Lens Assembly' },
      { id: 'battery', name: 'Battery' },
      { id: 'pcb', name: 'Main Board' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'hdmi-port', name: 'Micro HDMI' },
      { id: 'sd-slot', name: 'microSD Slot' },
      { id: 'shutter-button', name: 'Shutter Button' },
      { id: 'mode-button', name: 'Mode Button' },
      { id: 'mic', name: 'Microphones', count: 3 },
      { id: 'speaker', name: 'Speaker' },
    ],
    screwPoints: [
      { name: 'front-1', position: [-0.015, 0.015, 0.0] },
      { name: 'front-2', position: [0.015, 0.015, 0.0] },
      { name: 'front-3', position: [-0.015, -0.015, 0.0] },
      { name: 'front-4', position: [0.015, -0.015, 0.0] },
      { name: 'battery-door', position: [0.0, -0.02, -0.01] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'screen', type: 'plug', socket: 'display' },
      { id: 'lens', type: 'plug', socket: 'lens' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'hdmi', type: 'plug', socket: 'hdmi' },
      { id: 'sd', type: 'socket', socket: 'sd' },
    ],
    dustZones: ['lens', 'sd-slot', 'usb-c-port', 'hdmi-port', 'shutter-button', 'mode-button', 'mic'],
    possibleFaults: ['cracked_screen', 'dead_battery', 'wont_charge', 'no_audio', 'mic_mute', 'loose_connector', 'face_button_stuck'],
    requiredSteps: ['identify_fault', 'open_doors', 'remove_battery', 'remove_screws', 'replace_lens_or_screen', 'clean_ports', 'reassemble'],
  },
  {
    id: 'drone-mini',
    name: 'Mini Drone',
    tier: 2,
    basePayout: 100,
    glbAsset: 'drone-mini',
    parts: [
      { id: 'frame', name: 'Frame' },
      { id: 'props', name: 'Propellers', count: 4 },
      { id: 'motors', name: 'Motors', count: 4 },
      { id: 'battery', name: 'Flight Battery' },
      { id: 'pcb', name: 'Flight Controller' },
      { id: 'camera', name: 'Camera Gimbal' },
      { id: 'gps', name: 'GPS Module' },
      { id: 'usb-c-port', name: 'USB‑C Port' },
      { id: 'sd-slot', name: 'microSD Slot' },
    ],
    screwPoints: [
      { name: 'motor-fl', position: [-0.04, 0.04, 0.0] },
      { name: 'motor-fr', position: [0.04, 0.04, 0.0] },
      { name: 'motor-bl', position: [-0.04, -0.04, 0.0] },
      { name: 'motor-br', position: [0.04, -0.04, 0.0] },
      { name: 'frame-1', position: [-0.02, 0.02, 0.01] },
      { name: 'frame-2', position: [0.02, 0.02, 0.01] },
      { name: 'frame-3', position: [-0.02, -0.02, 0.01] },
      { name: 'frame-4', position: [0.02, -0.02, 0.01] },
    ],
    connectors: [
      { id: 'battery', type: 'plug', socket: 'battery' },
      { id: 'motors', type: 'plug', socket: 'motors' },
      { id: 'camera', type: 'plug', socket: 'camera' },
      { id: 'gps', type: 'plug', socket: 'gps' },
      { id: 'usb-c', type: 'plug', socket: 'usb-c' },
      { id: 'sd', type: 'socket', socket: 'sd' },
    ],
    dustZones: ['motors', 'props', 'camera', 'gps', 'usb-c-port', 'sd-slot'],
    possibleFaults: ['no_power', 'dead_battery', 'wont_charge', 'stick_drift', 'loose_connector', 'overheating_dust'],
    requiredSteps: ['identify_fault', 'remove_props', 'remove_screws', 'replace_motor_or_battery', 'clean_motors', 'reassemble'],
  },
];

/** Runtime profile consumed by the generic repair system. Keep GLB node ids stable. */
export type DeviceRepairDefinition = {
  readonly id: string;
  readonly name: string;
  readonly tier: 1 | 2 | 3;
  readonly parts: readonly { readonly id: string; readonly role: string; readonly assetId: string }[];
  readonly faults: readonly {
    readonly id: string;
    readonly label: string;
    readonly symptom: string;
    readonly affectedPart: string;
    readonly repairSteps: readonly string[];
    readonly testCondition: 'faulty-port' | 'faulty-battery' | 'dust-present';
    readonly failureMessage: string;
  }[];
  readonly stepOrder: readonly string[];
  readonly steps: readonly { readonly id: string; readonly hint: string; readonly target?: string }[];
  readonly scene: {
    readonly body: string;
    readonly cover: string;
    readonly connector: string;
    readonly battery: { readonly installed: string; readonly faulty: string; readonly spare: string };
    readonly port: { readonly installed: string; readonly faulty: string; readonly spare: string };
    readonly tools: readonly string[];
    readonly fasteners: readonly string[];
    readonly ledNode: string;
    readonly dustNode: string;
  };
  readonly powerTest: { readonly successLines: readonly string[] };
  readonly geometry: {
    readonly halfWidth: number;
    readonly halfLength: number;
    readonly intakeYawDeg: number;
    readonly bodyThickness: number;
    readonly coverThickness: number;
    readonly fastenerPoints: readonly (readonly [number, number])[];
    readonly batteryBay: readonly [number, number, number];
    readonly batterySocket: readonly [number, number, number];
    readonly portSocket: readonly [number, number, number];
    readonly batteryTab: readonly [number, number, number];
    readonly batteryTestPad: readonly [number, number, number];
    readonly portTestPad: readonly [number, number, number];
  };
};

export const PHONE_REPAIR: DeviceRepairDefinition = {
  id: 'phone', name: 'Smartphone', tier: 1,
  scene: {
    body: 'phone-body', cover: 'phone-back', connector: 'plug',
    battery: { installed: 'battery-ok', faulty: 'battery-bad', spare: 'battery-spare' },
    port: { installed: 'port-ok', faulty: 'port-bad', spare: 'port-spare' },
    tools: ['driver', 'spudger', 'brush', 'multimeter', 'probe'],
    fasteners: ['screw1', 'screw2', 'screw3', 'screw4'], ledNode: 'led', dustNode: 'dust',
  },
  powerTest: { successLines: ['USB: charging 5.0 V', 'BATT: 3.9 V  healthy', 'TEMP: normal', 'Hand it back: OUT tray.'] },
  geometry: {
    halfWidth: 0.0675, halfLength: 0.14, intakeYawDeg: 90, bodyThickness: 0.016, coverThickness: 0.004,
    fastenerPoints: [[-0.05, -0.115], [0.05, -0.115], [-0.05, 0.115], [0.05, 0.115]],
    batteryBay: [0, 0.0035, 0.03], batterySocket: [0, 0.0085, -0.033], portSocket: [0, 0.0035, 0.112],
    batteryTab: [0, 0.0016, -0.075], batteryTestPad: [0.04, 0.0063, 0.05], portTestPad: [0.022, 0.0028, -0.012],
  },
  parts: [
    { id: 'phone-body', role: 'shell', assetId: 'phone-body' }, { id: 'phone-back', role: 'cover', assetId: 'phone-back' },
    { id: 'screw1', role: 'screw', assetId: 'phone-screw' }, { id: 'screw2', role: 'screw', assetId: 'phone-screw' },
    { id: 'screw3', role: 'screw', assetId: 'phone-screw' }, { id: 'screw4', role: 'screw', assetId: 'phone-screw' },
    { id: 'battery-ok', role: 'battery', assetId: 'phone-battery' }, { id: 'battery-bad', role: 'battery', assetId: 'phone-battery-bad' },
    { id: 'battery-spare', role: 'battery', assetId: 'phone-battery' }, { id: 'port-ok', role: 'module', assetId: 'phone-port' },
    { id: 'port-bad', role: 'module', assetId: 'phone-port-bad' }, { id: 'port-spare', role: 'module', assetId: 'phone-port' },
    { id: 'plug', role: 'connector', assetId: 'phone-plug' },
  ],
  faults: [
    { id: 'port', label: 'Charge port module', symptom: "Won't charge", affectedPart: 'port', repairSteps: ['diagnose', 'remove-fasteners', 'pry-cover', 'lift-cover', 'disconnect', 'replace-port', 'reconnect', 'close-cover', 'fasten', 'test'], testCondition: 'faulty-port', failureMessage: 'USB: no charge detected' },
    { id: 'battery', label: 'Swollen battery', symptom: 'Dies at 40%', affectedPart: 'battery', repairSteps: ['diagnose', 'remove-fasteners', 'pry-cover', 'lift-cover', 'disconnect', 'replace-battery', 'reconnect', 'close-cover', 'fasten', 'test'], testCondition: 'faulty-battery', failureMessage: 'BATT: swollen / low V' },
    { id: 'dust', label: 'Dust build-up', symptom: 'Overheats', affectedPart: 'board', repairSteps: ['diagnose', 'remove-fasteners', 'pry-cover', 'lift-cover', 'clean', 'close-cover', 'fasten', 'test'], testCondition: 'dust-present', failureMessage: 'THERMAL: overheating' },
  ],
  stepOrder: ['inspect', 'diagnose', 'remove-fasteners', 'pry-cover', 'lift-cover', 'clean', 'disconnect', 'replace-battery', 'replace-port', 'install-port', 'reconnect', 'close-cover', 'fasten', 'test', 'return'],
  steps: [
    { id: 'inspect', hint: 'Pick up and inspect the device.', target: 'phone-body' },
    { id: 'diagnose', hint: 'Probe the pads with the multimeter to find the fault.', target: 'probe' },
    { id: 'remove-fasteners', hint: 'Loosen the 4 screws: twist the driver or hold the trigger.', target: 'driver' },
    { id: 'pry-cover', hint: 'Pry the cover edge with the spudger.', target: 'spudger' }, { id: 'lift-cover', hint: 'Lift off the back cover.' },
    { id: 'clean', hint: 'Brush the dust off the board.', target: 'brush' }, { id: 'disconnect', hint: 'Pull the battery plug to disconnect power.' },
    { id: 'replace-battery', hint: 'Swap the swollen battery for the spare.' }, { id: 'replace-port', hint: 'Swap the burnt port module for the spare.' },
    { id: 'install-port', hint: 'Install the spare port module.' }, { id: 'reconnect', hint: 'Plug the battery connector back in.' },
    { id: 'close-cover', hint: 'Put the cover back on.' }, { id: 'fasten', hint: 'Seat the screws and tighten them with the driver.' },
    { id: 'test', hint: 'Press the POWER button on the test rig.' }, { id: 'return', hint: 'Passed! Put the phone in the OUT tray.' },
  ],
};

export const DEVICE_REPAIRS: Readonly<Record<string, DeviceRepairDefinition>> = { phone: PHONE_REPAIR };
