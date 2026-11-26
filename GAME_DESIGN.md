# GAME_DESIGN.md: REBOOT LAB VR v2 (game, logic, systems)

## 1. Fantasy and pillars
You run a small repair bench. **Open it, find the real fault, fix it, close it, and it lives again.** Pillars: (1) **Hands-on realism** (gloved hands, real tools, real parts); (2) **Consequences** (drop a screw, force a connector, puncture a battery and it matters); (3) **Calm productivity** (few panels, clear next step, steady progress); (4) **Seated comfort** (everything within 0.6 m; no locomotion).

## 2. Platform and rules
Meta Quest 3/3S (keep Quest 2 playable), IWSDK in the Quest browser, hands first, controllers supported. Seated eye about 1.15 to 1.25 m, level rig (never pitch it), one-time seat calibration (palm on the mat) adjusts the world to the real head height. Test in an active XR session, not a flat preview. First repair in about 5 minutes; a shift (3 jobs) in about 10.

## 3. Core loop
Customer arrives and describes a symptom -> accept -> device arrives on the mat -> inspect and diagnose -> open (screws, clips, adhesive) -> disconnect (battery first) -> remove parts into the right trays -> fix (clean, replace, resolder later) -> throw away dead parts in the right bin -> reassemble -> power/diagnostic test -> hand back -> payment, rating, XP -> end-of-day receipt -> shop tablet (parts, tools, market, contracts).

## 4. Data-driven devices (no device logic in systems)
Every device is a `DeviceDef` in `src/data/devices/<id>.ts` plus a GLB with a **name contract**. Systems read the definition; adding a device means adding data and assets.
```ts
interface DeviceDef {
  id: string; name: string; tier: 1 | 2 | 3; asset: string; baseValue: number;
  parts: PartDef[];            // every removable thing (shell, board, battery, fan, screw groups...)
  fasteners: FastenerDef[];    // screw positions, size class, thread length, bit type
  clips: ClipDef[];            // pry points (spudger), adhesive zones (heat tool)
  connectors: ConnectorDef[];  // type: 'plug' | 'zif' | 'btb' | 'ribbon'; pull force; latch
  sockets: SocketDef[];        // snap zones: which part, tolerance (mm, deg), order rules
  dustZones: DustZoneDef[];
  faults: FaultDef[];          // see section 7
  steps: StepDef[];            // dependency graph for guidance (not forced order)
}
```
**Node name contract in the GLB:** `socket_<partId>`, `screwhole_<n>`, `grip_<toolId>` (tools), `tip` (tools), `pad_<name>` (test points), `dust_<n>`, `led_<n>`, `screen`, `clip_<n>`. Keep the current names for the phone so swaps are safe.

## 5. Interaction mechanics (what each system does)
- **FastenerSystem:** driver tip aligns within about 2 cm and 35 degrees of a screw head. Rotation comes from **wrist twist about the tool axis** (hands) or the **trigger motor** (controllers; 2 rev/s base). Counter-clockwise loosens, clockwise tightens. Progress moves the screw along its axis; at full travel it becomes a loose part. **Bit match:** each screw has a bit type (PH000, PH00, T5, Pentalobe); a wrong bit cannot engage and the screw can be **stripped** (health loss) if forced. Bits live in a bit rack and snap into the driver chuck. Over-torque on tighten strips the head.
- **StorageSystem (screws and parts):** magnetic trays with labeled slots; screws snap to the magnet when released above a tray and show their size. Loose screws that miss fall; small ones can **roll off** and are lost after a timeout unless picked up (magnet pickup tool unlocks later). Removed parts go to labeled bins or a "parts to keep" tray; unlabeled placement is allowed but unsorted parts cost time at reassembly (hint only).
- **ClipSystem:** spudger rubbed along a pry point for 0.6 s pops it; wrong force or speed can crack the shell (health loss). Adhesive zones need the heat tool (later), then the pick/spudger.
- **ConnectorSystem:** `plug`: grab and pull straight out. `zif`: flip the latch (poke) then slide the ribbon. `btb`: press with a finger or tool, pry with the spudger edge. Pulling a connector at a bad angle or without releasing its latch damages it. **Battery rule:** always disconnect the battery before touching other boards; touching a live board with the probe or a tool can short and damage it.
- **SnapSystem:** every part has a socket with position, angle and order rules; within tolerance it eases in, clicks, vibrates a little, and the blue highlight moves on.
- **BatteryRules:** swollen cells are marked in diagnosis; removing one puts it in the player's hand with a warning; the only valid destination is the **battery bin** (fire-safe). Dropping or puncturing a swollen cell is a big penalty.
- **DisposalSystem:** three bins (general e-waste, batteries, recyclable metal). Throwing a bad part in the right bin gives scrap value and reputation; wrong bin or throwing a good part away costs money.
- **CleaningSystem:** a brush clears a dust mask in the shader; compressed air later. Progress is per zone.
- **DiagnosisSystem:** see section 7. **PowerTestSystem:** boot/charge/thermal tests on the bench monitor and device LEDs.
- **SolderingSystem / ThermalSystem (phase 3):** pad temperature model; overheating scorches the board.

## 6. Damage model (consequences)
Every part has `health` 0 to 100 and a `fragility`. Events subtract health: drop (impact speed), force (connector/clip), strip (screw), short (live board), crack (shell). Health below 40 shows visible wear; at 0 the part is broken and must be replaced. **Perfect Repair** = no new damage and all original good parts kept. Extra swaps of healthy parts count against the rating.

## 7. Faults and diagnosis
`FaultDef { id; part; symptom; visible: 'none'|'loupe'|'obvious'; test: { tool; point; reading }; fix: 'replace'|'clean'|'reseat'|'resolder' }`. Reveal order: symptom text -> visual inspection (obvious faults like swelling, cracks) -> loupe/microscope (corrosion, burnt traces) -> multimeter at `pad_*` (voltage/continuity) -> boot/thermal test. Mystery crates add a second hidden fault. A wrong diagnosis (replacing a healthy part) is allowed but penalized. Upgrades widen what the player can see (magnifier, thermal camera).

## 8. Devices (build in this order, one per turn)
1. **Smartphone** (baseline): 4 back screws, clips, battery with plug, charge-port module, dust. Faults: port, battery, dust.
2. **Game controller:** 6 case screws, thumbsticks (drift), trigger spring, ribbon to the main board, small battery. Faults: stick drift (replace module), dead battery, dust.
3. **Wired headphones:** ear-cup clips, driver, cable break near the jack. Faults: broken cable (resolder or replace), blown driver.
4. **Earbuds with case:** tiny screws, case battery, hinge. Faults: case battery, dirty charge contacts.
5. **Handheld console (tier 2):** many screws of 2 sizes, ZIF ribbons, fan, thermal paste. Faults: fan, dust and heat, battery.
6. Later: Bluetooth speaker, keyboard, tablet, laptop, GPU (tier 3: soldering and thermal paste).
Each device needs: a hero GLB, a `DeviceDef`, 2 faults with different fixes, a step graph, and a bit/screw table.

## 9. State machines (keep these explicit in code)
`ShiftState`: waiting -> offered -> repair -> result -> day-end -> waiting. `RepairState` per job: delivered -> inspected -> opened -> disconnected -> parts-removed -> fixed -> reassembled -> tested -> handed-back. States only guide hints and scoring; the player may work in any physically possible order.

## 10. Economy, progression, reputation
Money: job fee (by faults and tier) times a star factor, plus scrap value, minus parts and tools bought. **Starting values (tune later):** start $150; fee $35 (dust), $60 (port), $75 (battery); star factor 0.7 + 0.1 per star; parts $8 to $25. **Stars (1 to 5):** base 3, +1 correct diagnosis before replacing, +1 under the target time, -1 per unnecessary swap (max -2), -1 for new damage, +1 for perfect repair (cap 5). **XP/levels** unlock devices and tools. **Reputation** (average stars) unlocks better customers and contracts. **Upgrades:** pro motor, better bits, magnifier, thermal camera, bigger tray set, heat tool, microscope. **Market:** buy broken devices at a discount, repair, resell (Flips). **Contracts:** short goals ("finish a regular's visit", "3 perfect repairs"). **Daily Mystery Crate:** one two-fault device per day with a bronze/silver/gold medal. Save to `localStorage` (try/catch).

## 11. Customers
3 to 6 personalities (original names, voices, appearance) with device preferences and returning visits. Short dialogue (2 lines). Reaction states: waiting, happy, unhappy. Simple animated figures are fine (idle/talk loops); do not spend time on walking.

## 12. Gloved hands (visual + function)
- Hide the default hand/controller visuals. Render **work gloves** (matte nitrile or ESD fabric) driven by the WebXR hand joints in Hands mode; in Controllers mode pose the same glove from the grip and trigger analog values (fingers curl).
- **Grip poses** per tool (`grip_<toolId>` empties): driver (pistol grip, index on trigger), spudger and brush (pen grip), probe (pen grip), tweezers (pinch), device (cradle). Blend between open, pinch, grip and tool poses.
- Verify the exact IWSDK/WebXR hand APIs with `hz-quest-verify-first` and the docs before coding. Fallback if per-joint skinning is blocked: low-poly glove segments (capsules) per joint with one shared material.
- Gloves must never block the view of small parts: keep them slightly translucent only if comfort testing shows occlusion problems.

## 13. Highlight rule (blue, minimal)
Only two things are outlined **sky blue (#4FC3FF)**: (1) the **object the player is holding**, (2) the **object or tool needed for the current step** (and its socket/target point). A wrong action flashes **red** briefly. No other glow, pulse or color. When the step completes, the highlight moves to the next target. Hover is a very faint outline. Implementation: inverted-hull outline (Quest friendly), no post-processing.

## 14. Performance
Instance screws and repeated parts; share materials and atlases; pool particles (dust puffs); sleep resting bodies; kinematic while attached; physics only on loose parts. Quality tiers as in the master prompt. Profile with `hz-perfetto-debug` before polish.

## 15. Acceptance tests per phase
Each phase ends with: a recorded XR-session run-through of the loop it touches, the verification protocol, and a 3-line report. Example for R1: the phone is repaired start to finish using only `DeviceDef` data; deleting phone-specific code paths does not change behavior.
