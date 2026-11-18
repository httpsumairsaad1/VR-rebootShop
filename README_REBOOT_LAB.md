# Reboot Lab VR: install (IWSDK, Meta Quest)
Unzip into your project root (`VR-rebootShop`) and replace files when asked. Then run `npm run dev`.

## Files
- `public/models/*.glb` (45 low-poly models, many with baked animation clips), `public/ui/*.uikitml` (5 cozy panels), `public/scenes/main.iwsdk.scene.json`
- `src/index.ts`, `assets.ts`, `components.ts`, `data/`, `lib/`, `game/bus.ts`, `systems/{ambient,repair,shop}-system.ts`
- `iwsdk.config.json` (replace)
- You can delete the starter files that are no longer used: `src/panel.ts`, `src/robot.ts`, `src/robot-component.ts`, `public/ui/welcome.uikitml`. Keep `public/audio/chime.mp3` (used on repair success).

## Play loop
1. Customer arrives (door opens, bell rings). Press the GREEN button on the bench to accept.
2. The phone slides down the chute onto the mat. Follow the hint line on the HUD.
3. Driver (left): twist your wrist or hold the trigger to loosen the 4 screws; they pop out. Drop them in the magnetic tray.
4. Spudger: rub the cover edge to pop the clips, lift the cover.
5. Multimeter probe: touch the gold pads (port / battery) to find the hidden fault (0 V port = bad, low battery = swollen). Brush off dust.
6. Pull the battery plug first, then swap the bad part for the spare (bins at the back; buy more on the tablet).
7. Plug back in, close the cover, seat and tighten the screws, press the green POWER button on the rig.
8. Pass = green LED, chime. Put the phone in the OUT tray: customer pays, stars, XP. 3 jobs = end-of-day receipt; orange button = next day. Daily Mystery Crate on the tablet = 2 faults.
Desktop pointer-lock fallback: crosshair click, hold-click carry, wheel = distance, Shift+wheel = twist driver, P = power test.

## Verified here / not verified
Verified: all 45 GLB files pass the Khronos validator (0 errors, including animations); all 5 `.uikitml` pass the official validator; TypeScript typechecks against `@iwsdk/core` 1.1.0-rc.2.
NOT verified (no emulator or headset here): look and feel, hand-twist screwdriving, snap tolerances, performance. Open the browser console on first run and send me any red errors or "missing scene items" warnings.
Known limits: customers are simple figures (idle/talk loops), no real walking; Market/Flips tabs and other devices are not built yet; look is stylized low-poly, not photoreal.
