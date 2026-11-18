# GAME_DESIGN.md: REBOOT LAB VR (working title)

Merged from the two briefs you pasted. **Stack decision: IWSDK (WebXR, TypeScript, ECS, Three.js, Havok)**, because the Gemini brief matches your toolchain and the Meta VR Start competition rules. The ChatGPT brief targets Unity, so its game design was kept and its Unity architecture was dropped.
Put this file next to the IWSDK-generated `AGENTS.md` (framework rules, do not overwrite it). This file owns the game. `UI_SPEC.md` owns the UI.

## 1. One-sentence fantasy
You are the neighbourhood repair tech: open a broken gadget, find the hidden fault with your own hands, and bring it back to life.
**Magic interaction:** twist your wrist to drive a screw out, then press Power and watch the dead gadget wake up.
**Originality rule:** the flow is inspired by Reboot Shop, but all names, characters, art, icons, copy and UI styling must be original. The screenshots are for structure only. Never copy their art or text.

## 2. Platform and tests
- Meta Quest 3 / 3S first; keep Quest 2 playable (72 fps floor, quality tiers low/medium/high). Browser WebXR, VR mode.
- Input: hands first (pinch grab, wrist twist to drive screws), controllers fully supported (trigger = use, grip = hold, Left X menu, Left Y help, Right A confirm, Right B back).
- **Seated, "airplane seat" test:** everything the player touches is within a 0.6 m reach arc. Seated eye about 1.15 m. Slight downward view to the mat. No locomotion.
- **Bus-stop test:** first full repair in about 5 minutes; a shift (3 repairs) in about 10.
- "Flat preview is not proof": test in an active XR session in the IWSDK emulator (Enter XR) and later on a headset.

## 3. Hard-won IWSDK rules (do not repeat these mistakes)
1. `Interactable` is **not allowed in the scene JSON** (the scene loader rejects it and the runtime goes black). Add it in code at runtime. Use only components that exist in the catalog.
2. The player rig stays **level** (never pitch or roll it). Put the work surface where a level gaze sees it; add a one-time seat calibration (palm-on-mat) that offsets the rig to the real head height.
3. One input path: everything goes through IWSDK interactables (`OneHandGrabbable`, `DistanceGrabbable`, `RayInteractable`, `PokeInteractable`). No mouse-only handlers. Provide a pointer-lock desktop fallback (crosshair raycast) that calls the same handlers.
4. Spatial UI = `.uikitml` panels. Validate every file: `node node_modules/@drawcall/uikitml/dist/cli.js validate <file> --kit horizon` must show 0 errors. Units are centimetres (1 unit = 1 cm).
5. Never allocate in `update()`. Systems use queries and `qualify/disqualify` subscriptions; clean up in `cleanupFuncs`. Import Three.js from `@iwsdk/core`.
6. Typecheck (`npm run typecheck`) and read the console after every step. Keep game data in `src/data/`, not in systems.
7. Persist with `localStorage` inside try/catch (works in a browser; fall back to empty state).

## 4. Core loop (VR version)
1. **Customer:** a figure appears at the counter; a speech bubble tells the problem ("Won't charge"). Poke **Accept**. The device slides down the **intake chute** onto the repair mat.
2. **Inspect:** pick it up, turn it over, press Power (nothing happens), read the status chip on the order tag. Use the **magnifier** or **multimeter** to narrow the fault. The fault is hidden until diagnosed.
3. **Open:** electric driver (wrist twist) removes screws into the **magnetic tray**; spudger pries clips; lift the back cover.
4. **Fix:** unplug connectors (grab and pull), brush dust (stroke the brush), replace the faulty part from the **parts drawers** (snap sockets), re-plug, close, re-screw.
5. **Test:** press **Power**. Pass = green LED and boot screen on the bench monitor. Fail = amber/red cue, keep diagnosing.
6. **Payout:** customer pays; coins, star rating, XP. End of shift: receipt printed on the desk, day turns to night.
7. **Shop:** on the **desk tablet** spend money on Upgrades, Parts, Market (buy broken gadgets), Flips (resell), Book (help).
8. **Daily Mystery Crate:** one gadget with **two** hidden faults, a medal (bronze/silver/gold) by time and accuracy.

## 5. Devices and faults (data-driven)
Tiers: 1 phone, wired headphones, controller, mouse, speaker; 2 earbuds, handheld, keyboard, tablet; 3 laptop, GPU, motherboard, desktop.
Every device is a modular GLB kit defined in `src/data/devices.ts`: parts (shell, screws, battery, board, port module, screen, speaker, buttons...), screw points, connector plugs and sockets, dust zones, **fault list** (no power, won't charge, cracked screen, dead battery, loose connector, dusty/overheating, bad speaker, stick drift), and the **steps** each repair needs. Add a device by adding data plus assets, not by writing a new system.
**Vertical slice device:** Smartphone, "Won't charge" (faulty charge-port module). Then: controller "no power" (battery cable), earbuds, headphones.

## 6. Systems (src/systems/)
`ShiftSystem` (day, orders, customers), `OrderSystem`, `DiagnosisSystem` (hidden faults, probes, magnifier), `FastenerSystem` (wrist-twist screws, magnetic tray), `ConnectorSystem` (plug/unplug cables), `SnapZoneSystem` (sockets, magnetic snap, haptics), `CleaningSystem` (brush strokes, dust mask), `SolderingSystem` and `HeatToolSystem` (phase 3), `PowerTestSystem` (boot test and LED states), `EconomySystem` (money, prices, profit), `MarketSystem`, `UpgradeSystem` (tools and shop), `ReputationSystem` (stars from accuracy, time, correct diagnosis), `HintSystem` (one short hint pill at a time), `DayNightSystem`, `SaveSystem`, `AudioHapticsSystem`, `UiBindingSystem` (all panels).
Components live in `src/components.ts`; ScriptableObject-style data lives in `src/data/`.

## 7. Layout (reach arc, scene JSON authoring)
Center: ESD repair mat with device clamp. Left (-35° to -55°): magnetic tool rack (electric driver, spudger, brush, heat tool, magnifier, multimeter) and the **screw tray**. Right (+35° to +55°): bench monitor (boot test, voltages) and the **shop tablet**. Back rim (0.45 m): parts drawers and the intake/outgoing **parcel chute**. The customer stands at the counter beyond the reach arc (not touchable). Window behind the counter drives day/night lighting.

## 8. Performance
Under about 120 draw calls on the high tier; instance screws and small parts; reuse materials; pooled particles for dust; baked-looking lighting (no real-time shadows on low); physics only on loose parts, kinematic while attached or screwed in; sleep resting bodies.

## 9. Build order (one step per turn, wait for "next")
1. **Seated bench and rig:** level rig, mat, lamp, shelves, intake chute, Havok world, interaction smoke test (grab cube, poke button, ray select) in an XR session.
2. **Screw loop:** electric driver, magnetic tray, four screws on the phone, wrist-twist unscrew with haptics, back cover lifts.
3. **Phone repair slice:** connector unplug, port module swap with snap zones, brush dust, close and re-screw, **Power test**.
4. **Orders and payout:** customer bubble, Accept, chute delivery, payment, stars, end-of-shift receipt, day/night.
5. **UI pass:** build the screens in `UI_SPEC.md`, in the order it lists.
6. **Shop:** tablet tabs, parts stock, tools upgrades, Market and Flips.
7. **More devices and the Daily Mystery Crate.**
8. **Polish:** audio, haptics, quality tiers, seat calibration, save/load, first-five-minutes script.
Cut order if short on time: Flips, extra devices, soldering, contracts. Never cut: screw loop, snap-in part swap, Power test, payout.

## 10. First five minutes (judged)
0:00 desk monitor boot logo, poke **Start Shift**; palm-on-mat calibration. 0:30 customer bubble, **Accept**, phone slides onto the mat. 1:00 flip, unscrew four screws, pry cover, unplug battery connector. 2:30 swap the charge port, re-plug, close. 3:30 press **Power**: green LED, customer pays, coins and a star. 4:30 tablet shows "Day 1 complete" and the Daily Mystery Crate teaser. No instruction walls: hint pills only.

## 11. Verification (each step)
`npm run typecheck`; `.uikitml` validator; console clean; `ecs_find_entities`; XR-session screenshots in Hands and Controllers modes; report draw calls per tier; commit to git.
