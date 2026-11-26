# UI_SPEC.md: Reboot Lab VR

Source: the 20 screenshots in `reboot-shop-vr.rar` (a flat 2D tap game). Use them for **flow and information design only**; draw original art, icons, characters and copy.
**Rule: do not port a flat game into VR.** Anything the original does by tapping a button must become a physical action where possible, and only the rest becomes a small world-locked panel.

## 1. Design tokens (warm, cozy, cartoon-clean; approximate, pick your own originals)
Panel cream `#F7EBD4`, dark brown text/outline `#3B2A22`, CTA orange `#FF8A3D`, success mint `#4CC38A`, info teal `#2F8F86`, coin gold `#F2B63C`, danger red `#E5533D`, chip white `#FFFFFF`. Rounded corners, thick soft outlines, one friendly rounded sans font (one the UI kit supports; fallback sans).
Dark variant for the bench tablet and monitor: panel `#1B2A30`, text `#EAF4F2`, same accents.
VR legibility: world-locked panels 0.7 to 1.0 m away, body text at least 2.2 cm tall, headings 3.2 cm, buttons at least 4 x 12 cm, poke targets at least 3.5 cm, fade in/out about 150 ms, never head-locked. `.uikitml` units are cm. Validate every file with the uikitml CLI (`--kit horizon`).

## 2. Screen map: screenshot to VR element
| # | Screenshot | What it shows | VR equivalent | Where / how |
|---|---|---|---|---|
| 1 | `loading-main-screen` | Logo card, title | Boot logo on the **bench monitor**; **Start Shift** button | Right monitor; poke |
| 2 | `bench-workspace-ui` ("Who's next?") | 2 order cards: name, device, price | **Order clipboard rail**: cards pinned on the intake tray; pick one up and place it on the mat to start | Back rim; grab and drop |
| 3 | `bg view and customer telling isssue`, `user after telling issue user interface` | Customer portrait, speech bubble, status chip, offer, "Sure, I'll take a look!" | Customer figure at the counter, **speech bubble at head height**, status chip, price offer, physical **Accept** button on the counter edge | Figure out of reach; Accept in reach |
| 4 | top HUD chips (day, stars, coins, eye, pause) | Day, rating, money, hide UI, pause | **Wrist HUD** (day, stars, coins); pause on Menu button; "hide UI" in settings | Left wrist, glance to read |
| 5 | Repair log panel (left) | Checklist of steps done | **Repair log clipboard** beside the mat that writes itself as you work; read-only | Left of mat, tilted to the player |
| 6 | Hint pill (top) | One-line contextual hint ("Look inside: flip it over", "Scrub the battery cable") | **Hint pill** floating above the device, one at a time, dismisses on success | Billboard over the mat |
| 7 | **Do it for me** | Assist that performs the step | **Assist** button on the clipboard: ghost hands do the current step; costs a star; disabled in Perfect Repair | Clipboard |
| 8 | Status chips ("Won't turn on", "Won't charge", "No power") | Symptom tags | Chip printed on the **order tag**, mirrored by the device LED/screen | Order tag, device |
| 9 | Bottom tool palette + **Power** | Tool icons, green Power | **No palette.** Real tools on the left rack (driver, spudger, brush, heat tool, magnifier, multimeter). **Power** is a real green button on the test rig | Left rack; right of mat |
| 10 | `screw or unscrew`, `disassemble`, `mobile-batteryside-disasssembly`, `screen-open-mobile-motherboard` | Device on the mat, screws, battery, board | Physical device kit; screws into the **magnetic tray**; connectors you grab and pull | Mat |
| 11 | `broken-screen-mobile`, `mobile issue - no charging.`, `joystick-noPower-issue-ui`, `earbuds-wireless`, `headphones` | Device-specific symptoms | Device data in `devices.ts`; symptom on the order tag plus a device cue | Data-driven |
| 12 | `challenges-for-main-player` ("No new driver in stock": Rush it now $10 / Park it, order tomorrow / Keep working) | Stock-out decision | Small **decision plate** with three physical buttons; Rush = parcel arrives from the chute | Back rim |
| 13 | `day-to-night-completed` (Open day 3, contracts, Daily Mystery Crate card) | End of day, next day, contracts | **Receipt printer** prints the day summary; window goes night to day; **Open day** on the tablet | Right desk, window |
| 14 | `parts-part1`, `parts-part2` (stock, price, +1/+3) | Parts stock list | **Tablet > Parts** tab; stock is physically in the **drawers**; +1 / +3 buy buttons | Tablet; drawers |
| 15 | `tools-upgrade-popup` (Electric Driver, Cleaning Kit, Heat Tool, Magnifier) | Tool upgrades with prices | **Tablet > Upgrades** tab; owned upgrades appear on the rack | Tablet; rack |
| 16 | `market-sub-popup` (listings, Inspect, Buy, profit estimate) | Broken gadgets to buy and flip | **Tablet > Market** tab; bought gadgets arrive in the parcel chute | Tablet; chute |
| 17 | Tabs row (Upgrades, Parts, Market, Flips, Book) | Shop navigation | The same five tabs on the **shop tablet** | Right of mat |
| 18 | `help-section pop` ("Book": Guides, Tools, Gadgets; "How a repair goes") | Help and manual | A physical **repair manual** on the shelf; pinch to flip pages; also the tablet Book tab | Shelf, tablet |
| 19 | "Crate done: bronze medal. C in 154s" | Medal result | **Medal card** on the receipt and tablet; keepsake on the showcase shelf | Receipt, shelf |

## 3. Three player-facing panels
1. `hud-panel` on the left wrist: day, money, rating, level, progress and one contextual hint.
2. `order-panel` on the repair clipboard: customer offer before acceptance, then the live repair log while the job is active.
3. `tablet-panel` on the shop tablet: Parts, Upgrades and Book pages, plus tutorial and day receipt views when those are active.

Keep the bench monitor as a physical device screen and keep Accept, Power and next-day actions on their physical buttons. Do not add floating speech, log, receipt or tutorial panels. UIKitML is presentation only; game logic remains in systems.

## 4. States and feedback
Status chips: amber = loose/unknown, red = broken/short, green = healthy; the device LED matches. Success = chime + haptic pulse + coin burst; wrong action = soft thud + brief red flash. Highlights: hover white, selected sky-blue, correct snap green, wrong red; always pair colour with an icon or pulse shape. Haptics: screw-engagement ticks, snap click, brush-stroke buzz, power-on swell.

## 5. Interaction mapping
Pinch/trigger: select, press buttons, pick small parts. Grab/grip: hold devices and tools. Wrist twist (or trigger plus rotate): drive screws. Pull: unplug connectors. Stroke: brush. Poke: buttons. Desktop pointer-lock fallback: crosshair click, hold-click carry, wheel = distance, keys M menu, H hint, T assist (avoid Q E R X Z W A S D).

## 6. Acceptance checklist
- Every flat-game action in the screen map has a physical or diegetic VR version, with a panel only where listed.
- All `.uikitml` files validate with 0 errors; text sizes meet the legibility rule.
- Everything touchable is inside the 0.6 m seated arc; tested in an active XR session in both Hands and Controllers modes.
- First repair completes in about 5 minutes with no instruction wall.
