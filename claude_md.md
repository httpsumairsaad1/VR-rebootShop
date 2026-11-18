# CLAUDE.md — Reboot Shop VR: Gadget Repair (Meta Quest / Horizon OS)

> **Master Engineering & Design Specification for Claude Code**
> This document consolidates the complete Game Design Document (`GAME_DESIGN.md`), Spatial UI Specification (`UI_SPEC.md`), and Technical Architecture (`AGENTS.md`) into a single source of truth for building **Reboot Shop VR: Gadget Repair** on Meta Quest / Horizon OS.

---

## 1. Project Identity & Core Fantasy
- **Title:** Reboot Shop VR: Gadget Repair *(working title: Reboot Lab VR)*
- **Elevator Pitch:** A hands-on, cozy-yet-tactile electronics repair simulation game where you turn broken gadgets into happy customers. Run your own neighborhood repair shop and bring phones, controllers, headphones, and handheld consoles back to life.
- **Core Fantasy:** You are the neighborhood repair tech. Open a broken gadget, find the hidden fault with your own hands, and bring it back to life.
- **Signature "Magic Interaction":** Twist your wrist to drive a tiny screw out into a magnetic tray, snap in a fresh component, then press the physical green **Power** button and watch the dead gadget wake up.
- **Originality Mandate:** Game flow and information hierarchy are inspired by flat-screen gadget repair games (*Reboot Shop*), but **all names, characters, 3D art, icons, copy, and UI styling must be 100% original**. Never port flat 2D button-tapping mechanics into VR; every tap action must become a physical VR interaction where possible, reserving UI panels strictly for diegetic displays.

---

## 2. Target Platform, Stack & Performance Budgets
- **Target Hardware:** Meta Quest 3 / 3S primary (Quest 2 compatible). Standalone Horizon OS Browser / WebXR runtime.
- **Frame Rate & Tiers:** `72 Hz` minimum floor (`90 Hz` target on Quest 3). Implement three quality tiers (`low`, `medium`, `high`).
- **Tech Stack:**
  - **Engine/Framework:** Immersive Web SDK (`@iwsdk/core`), Entity-Component-System (ECS) architecture, Three.js (imported exclusively from `@iwsdk/core`), TypeScript, and Vite.
  - **Physics:** Havok Physics (`@babylonjs/havok` / IWSDK Havok integration) for rigid-body tools, loose screws, cable slack, and magnetic snap zones.
  - **Spatial UI:** `.uikitml` panels compiled/validated with `--kit horizon`.
- **Rendering & Performance Budgets:**
  - **Draw Calls:** `< 120` draw calls on `high` tier.
  - **Batching:** Instance all screws and repeated small components; share PBR materials across device kits; pool GPU dust particles.
  - **Lighting & Physics:** Baked-looking warm desk lamp + window lighting (no real-time dynamic shadows on `low` tier). Keep attached/screwed parts kinematic; activate rigid-body physics only when detached, and sleep resting bodies immediately.

---

## 3. Hard-Won IWSDK Rules (CRITICAL — DO NOT VIOLATE)
1. **No `Interactable` in Scene JSON:** Never put `Interactable` in static scene JSON files (the scene loader rejects it and renders a black screen). Attach interactable components dynamically in TypeScript at runtime, and only use components registered in the IWSDK catalog.
2. **Keep the Player Rig Level:** Never apply pitch or roll to the XR camera rig (causes immediate motion sickness). Keep the rig strictly level (`y ≈ 1.15m–1.25m` seated eye height) and angle the workbench/mat surface (`~12°–15°` tilt) so a natural downward gaze views the PCB comfortably. Include a one-time **palm-on-mat seat calibration** that offsets the rig Y-height to match the player's real seated posture.
3. **Unified Input Path:** Route all interactions through IWSDK interactables (`OneHandGrabbable`, `DistanceGrabbable`, `RayInteractable`, `PokeInteractable`). Never write mouse-only event listeners. Provide a desktop pointer-lock fallback (center crosshair raycast) that triggers the exact same ECS interaction handlers.
4. **Spatial UI Validation:** Every `.uikitml` file uses **centimeters** as units (`1 unit = 1 cm`) and must pass validation with zero errors before running:
   ```bash
   node node_modules/@drawcall/uikitml/dist/cli.js validate <file> --kit horizon
   ```
5. **Zero Per-Frame Allocations:** Never allocate vectors, quaternions, objects, or arrays inside `update()`. Use ECS queries with `qualify` / `disqualify` lifecycle subscriptions and clean up all listeners in `cleanupFuncs`. Always import Three.js symbols from `@iwsdk/core`.
6. **Data-Driven Design:** Keep all device definitions, fault tables, prices, and repair steps in `src/data/`—never hardcoded inside ECS systems.
7. **Safe Persistence:** Wrap all `localStorage` save/load calls in `try/catch` blocks with graceful fallback to a fresh state.
8. **Verification Discipline:** Run `npm run typecheck`, validate `.uikitml`, check console logs, inspect entities (`ecs_find_entities`), and verify inside an active WebXR session (both Hands and Controllers modes—flat 2D preview is not proof).

---

## 4. Ergonomics & Spatial Workbench Layout ("Airplane Seat Test")
- **Stationary Seated Play:** Zero locomotion. 100% of interactive tools, parts, buttons, and panels must sit within a **0.60 m (2-foot) comfortable seated reach arc**.
- **Zone Map:**
  - **Center (`0°`, `0.35m` forward):** ESD-safe anti-static rubber repair mat with a rotating/tilted device clamp/vise and a physical green **Power** test button on the right edge of the test rig.
  - **Immediate Left (`-35°` to `-55°`):**
    - Angled magnetic tool rack holding physical tools: **Electric Precision Screwdriver**, **Spudger/Pry Tool**, **Anti-Static Cleaning Brush**, **Hot-Air Rework / Heat Tool**, **Magnifying Loupe**, and **Multimeter Probes**.
    - **Magnetic Screw Sorting Tray** (screws snap neatly into grid slots when dropped nearby).
    - **Repair Log Clipboard** tilted toward the player (auto-updating checklist + physical **Assist** button).
  - **Immediate Right (`+35°` to `+55°`):**
    - **Bench Diagnostic Monitor** (displays boot logo, live POST/boot test results, voltage/thermal readouts).
    - **Shop Tablet** (mounted on an adjustable desk stand: Upgrades, Parts, Market, Flips, Book).
    - **Receipt Printer** (prints end-of-day shift summary & medal cards).
  - **Upper Back Rim (`0.45m` forward):**
    - **Compact Component Drawers** (physically stocked with replacement batteries, charge ports, screens, capacitors, thermal paste).
    - **Incoming / Outgoing Parcel Chute** (delivers accepted customer jobs, rush-ordered parts, and market purchases).
    - **Showcase Shelf** (displays rare restored gadgets and earned Daily Mystery Crate medals).
  - **Background Beyond Reach (`> 1.2m`):** Customer counter where NPC customers stand (out of reach) with a floating speech bubble at head height, plus a large shop window that transitions lighting from warm morning/daylight to cozy evening/night.

---

## 5. Input Mapping (Hands-First + Controllers + Desktop Fallback)
| Action | Hand Tracking (Primary) | Touch Plus Controllers | Desktop Pointer-Lock Fallback |
| :--- | :--- | :--- | :--- |
| **Grab / Hold Tool or Device** | Pinch / Fist grab | Grip button | Hold Left Click (Mouse wheel = distance) |
| **Select / Pick Small Part** | Index-thumb pinch | Trigger | Left Click |
| **Drive Screw (Unscrew/Tighten)** | Wrist twist while driver tip engages screw | Hold Trigger + wrist rotation (or thumbstick twist) | Hold Left Click / Scroll while engaged |
| **Unplug / Plug Ribbon Cable** | Pinch connector & pull/push along socket normal | Grip/Trigger & pull/push | Click & drag |
| **Clean Dust / Apply Paste** | Hold brush/applicator & stroke across PCB | Hold tool & stroke | Move crosshair while holding click |
| **Press UI / Physical Buttons** | Index finger poke (`PokeInteractable`) | Index poke or Ray + Trigger (`Right A` confirm, `Right B` back) | Crosshair Left Click |
| **System Shortcuts** | Wrist glance for HUD | `Left X` Menu, `Left Y` Hint | `M` Menu, `H` Hint, `T` Assist *(avoid WASD/QERXZ)* |

---

## 6. Core Gameplay Loop & Progression
1. **Shift Start & Calibration:** Poke **Start Shift** on the bench monitor. Perform quick palm-on-mat height calibration.
2. **Customer Intake:** A customer approaches the counter; a diegetic speech bubble states the issue (e.g., *"Won't charge"*), paired with a symptom status chip and payout offer. Poke the physical **Accept** button on the counter edge.
3. **Delivery & Inspection:** The broken gadget slides down the intake chute onto the mat. Pick it up, flip it over, press **Power** to observe failure cues (dead LED, amber blink, red short), and inspect with the **Magnifier** or **Multimeter** to reveal hidden faults.
4. **Disassembly:** Engage screws with the electric screwdriver (wrist twist + haptic ticks) and drop them into the magnetic tray. Use the spudger to pop chassis clips and lift the back cover.
5. **Repair, Clean & Solder:**
   - Unplug battery/display ribbon cables before servicing.
   - Brush away procedural dust masks or blow out debris; clean old thermal paste and apply fresh paste on higher-tier hardware.
   - Swap damaged modules (charge port, battery, cracked OLED screen, drifting thumbstick) from the parts drawers into magnetic snap sockets, or desolder/resolder burnt capacitors with the heat tool without scorching the PCB (`> 4.5s` overheat penalizes quality score).
6. **Reassembly & Power Test:** Reconnect cables, close the shell, drive screws back in, and press the physical green **Power** button.
   - **Pass:** Green LED, boot chime, live OS boot screen on the bench monitor.
   - **Fail:** Amber/red diagnostic flash; re-open and check missed connections or secondary faults.
7. **Payout, Economy & Shop Loop:**
   - Customer pays coins, awards 1–5 stars (based on accuracy, speed, and PCB care), and grants XP.
   - **Shop Tablet:** Buy replacement parts (`+1` / `+3` restocks), upgrade tools (faster electric driver, precision heat tool, wider cleaning kit, thermal magnifier), buy broken gadgets from the **Market** to restore and **Flip** for profit (or place rare restorations on your **Showcase Shelf**), and browse the **Book** manual.
   - **Stock-Out Decisions:** If out of a required part, a physical **Decision Plate** offers: *Rush Order Now ($10 via chute)*, *Park Job & Order Tomorrow*, or *Keep Working*.
   - **End of Day & Daily Mystery Crate:** Receipt printer summarizes daily earnings/stars; window shifts to night; tackle the **Daily Mystery Crate**—a special gadget with **two hidden faults** graded on time and precision for Bronze, Silver, or Gold medals.

---

## 7. Modular Device & Fault Architecture (`src/data/devices.ts`)
Every gadget is a modular GLB kit driven entirely by data schemas (adding new devices requires zero new ECS system code):
- **Tier 1 (Starter):** Smartphone *(vertical slice: "Won't charge" -> faulty USB-C charge-port module)*, Controller *("No power" -> loose battery cable / drifting stick)*, Wired Headphones *(bad driver/jack)*, Wireless Mouse, Bluetooth Speaker.
- **Tier 2 (Intermediate):** Wireless Earbuds & Case, Retro Handheld Console, Mechanical Keyboard, Tablet.
- **Tier 3 (Advanced):** Gaming GPU, Next-Gen Console, Desktop Motherboard, Laptop.
- **Device Schema Fields:** `id`, `name`, `tier`, `basePayout`, `glbAsset`, `parts[]` (shell, screws, battery, PCB, ports, screen, fans), `screwPoints[]`, `connectors[]` (plug + socket transforms), `dustZones[]`, `possibleFaults[]` (`no_power`, `wont_charge`, `cracked_screen`, `dead_battery`, `loose_connector`, `overheating_dust`, `burnt_capacitor`, `stick_drift`), and `requiredSteps[]`.

---

## 8. ECS Architecture (`src/components.ts` & `src/systems/`)
- **Core Components (`src/components.ts`):** `DeviceRoot`, `RepairPart`, `ScrewFastener`, `CableConnector`, `SnapSocket`, `DustSurface`, `SolderJoint`, `ToolItem`, `DiagnosticProbe`, `OrderTicket`, `PartDrawerSlot`.
- **Core Systems (`src/systems/`):**
  - `ShiftSystem` & `OrderSystem`: Manages daily shifts, customer queue, order cards, and stock-out decision plates.
  - `DiagnosisSystem`: Tracks hidden vs. discovered faults via magnifier focus, multimeter voltage continuity, and thermal inspection.
  - `FastenerSystem`: Maps wrist-twist angular delta to screw Z-translation + rotation, haptic ticks, and magnetic tray snapping.
  - `ConnectorSystem` & `SnapZoneSystem`: Handles cable pull/plug thresholds and magnetic part alignment highlights + snap clicks.
  - `CleaningSystem`: Updates dynamic PCB dust masks under brush/air-nozzle raycasts and spawns pooled dust particles.
  - `HeatToolSystem` & `SolderingSystem`: Simulates pad temperature (`25°C`–`420°C`), solder reflow at `~320°C`, and trace scorch penalties (`> 4.5s`).
  - `PowerTestSystem`: Validates circuit completeness, cable continuity, and healthy part states on **Power** press; drives LEDs and bench monitor POST output.
  - `EconomySystem`, `MarketSystem`, `UpgradeSystem`, `ReputationSystem`: Manages currency, part inventory, tool tiers, market flips, showcase items, and star ratings.
  - `HintSystem`: Displays a single concise contextual hint pill above the mat when idle/stuck; triggers **Assist** ghost-hand completion (costs 1 star; disabled in Perfect Repair mode).
  - `DayNightSystem`, `SaveSystem`, `AudioHapticsSystem`, `UiBindingSystem`: Handles lighting transitions, `localStorage` persistence, spatial SFX/controller haptics, and reactive data binding to `.uikitml` panels.

---

## 9. Spatial UI Specification (`public/ui/*.uikitml`)
### Visual Tokens & Legibility Rules
- **Warm Cozy Palette:** Panel Cream `#F7EBD4`, Dark Brown Text/Outline `#3B2A22`, CTA Orange `#FF8A3D`, Success Mint `#4CC38A`, Info Teal `#2F8F86`, Coin Gold `#F2B63C`, Danger Red `#E5533D`, Chip White `#FFFFFF`. Rounded corners, thick soft outlines, friendly rounded sans font.
- **Dark Tech Variant (Monitor & Tablet):** Panel `#1B2A30`, Text `#EAF4F2`, paired with the same semantic accents.
- **VR Legibility Constraints:**
  - World-locked panels placed `0.7m–1.0m` from eyes (never head-locked).
  - Body text `>= 2.2 cm` tall; headings `>= 3.2 cm`.
  - Buttons `>= 4 cm x 12 cm`; poke targets `>= 3.5 cm`.
  - Fade transitions `~150 ms`.

### Required `.uikitml` Panels (Pure View Layer via `UiBindingSystem`)
1. `bench-monitor.uikitml`: Boot logo, **Start Shift** button, live POST/boot diagnostic screen, voltage readout.
2. `speech-bubble.uikitml`: Customer greeting, symptom status chip, coin offer *(paired with physical Accept button on counter)*.
3. `order-tag.uikitml`: Customer name, device model, symptom chip (`amber` = loose/unknown, `red` = broken/short, `green` = healthy), payout.
4. `repair-log.uikitml`: Auto-checking step list beside the mat + **Assist** button.
5. `hint-pill.uikitml`: Single-line contextual hint floating subtly above the mat; auto-dismisses on step completion.
6. `wrist-hud.uikitml`: Left-wrist glanceable display showing Day, Stars, and Coins.
7. `shop-tablet.uikitml`: `40 cm x 30 cm` desk tablet with 5 tabs (`Upgrades`, `Parts`, `Market`, `Flips`, `Book`), Contracts, and Daily Mystery Crate launcher.
8. `day-receipt.uikitml`: End-of-day earnings breakdown, stars earned, crate medal, and **Open Next Day** button.
9. `decision-plate.uikitml`: Stock-out choice plate (*Rush $10*, *Park Order*, *Keep Working*).

---

## 10. Iterative Build Plan & First-5-Minutes Experience
### Target First-5-Minutes Flow (Judged Benchmark)
- **0:00** — Bench monitor displays boot logo; player pokes **Start Shift** and completes palm-on-mat calibration.
- **0:30** — First customer arrives with speech bubble (*"Won't charge"*); player pokes **Accept**; smartphone slides onto the mat.
- **1:00** — Player flips phone, uses electric screwdriver (wrist twist) to remove 4 screws into the magnetic tray, pries back cover, and unplugs battery cable.
- **2:30** — Player grabs fresh charge-port module from parts drawer, snaps it in, reconnects battery, closes shell, and drives screws back in.
- **3:30** — Player presses green **Power** button -> green LED & boot screen -> customer pays coins & awards a star.
- **4:30** — Tablet displays Day 1 summary & unlocks the Daily Mystery Crate teaser. *(Zero instruction walls—hint pills only.)*

### Execution Milestones (Build Incrementally & Verify Each Step)
1. **Milestone 1 — Seated Workbench & Rig:** Level XR rig, palm-on-mat seat calibration, tilted ESD mat, warm lamp, shelves, parcel chute, Havok world, and XR interaction smoke test (grab cube, poke button, ray select).
2. **Milestone 2 — Screw & Disassembly Loop:** Magnetic tool rack, electric screwdriver with wrist-twist rotation & haptics, magnetic screw tray, and 4-screw smartphone back-cover removal.
3. **Milestone 3 — Vertical Slice Repair (Smartphone):** Ribbon cable unplug/plug, charge-port module swap with magnetic snap zones, brush dust cleaning, reassembly, and physical **Power** button boot test.
4. **Milestone 4 — Customer Orders & Shift Loop:** Customer counter bubble, **Accept** button, chute delivery, coin/star payout, end-of-day receipt printer, and day/night window lighting.
5. **Milestone 5 — Spatial UI Pass:** Build and validate all 9 `.uikitml` panels in `UI_SPEC.md` and wire them to `UiBindingSystem`.
6. **Milestone 6 — Shop Economy & Progression:** Implement tablet tabs (`Upgrades`, `Parts` drawer restocking, `Market` broken gadget buying, `Flips` resale, `Book` manual) and stock-out decision plate.
7. **Milestone 7 — Multi-Device Expansion & Daily Mystery Crate:** Add Controller, Headphones, Earbuds, Handheld, GPU, and Console kits + Daily Mystery Crate (2 hidden faults, Bronze/Silver/Gold medals, showcase shelf).
8. **Milestone 8 — Polish & Optimization:** Spatial audio SFX, fine-tuned haptics, quality tiers (`low`/`medium`/`high` draw call verification), `localStorage` save/load, and full first-5-minutes pacing pass.