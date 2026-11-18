import {
  BoxGeometry, createSystem, DoubleSide, Entity, Euler, Grabbed, Hovered, InputComponent, Interactable, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, Quaternion, RayInteractable, Transform, Vector3,
} from '@iwsdk/core';
import layout from '../data/layout.json';
import { Animated, Pressable, RepairItem } from '../components.js';
import { bus } from '../game/bus.js';
import type { FaultId, Order } from '../data/repair-data.js';
import { CanvasScreen } from '../lib/canvas-screen.js';
import { DesktopInput, clickables } from '../lib/desktop-input.js';
import { Highlighter } from '../lib/highlighter.js';
import { chime, pulse, sfx } from '../lib/audio.js';

const PH = layout.phone;
const T = PH.thick, CT = PH.coverThick, W = PH.halfW, L = PH.halfL;
const v3 = (a: number[]): Vector3 => new Vector3(a[0], a[1], a[2]);
const BAY = v3(PH.bayCenter), SOCK_B = v3(PH.socketBattery), SOCK_P = v3(PH.socketPort), TAB = v3(PH.batteryTab), PAD_B = v3(PH.batteryPad), PAD_P = v3(PH.portPad);
const TIPS: Record<string, Vector3> = { driver: v3(layout.tips.driver), spudger: v3(layout.tips.spudger), brush: v3(layout.tips.brush), probe: v3(layout.tips.probe) };
const UP = new Vector3(0, 1, 0);
const TURNS = 1.25, RAD = TURNS * Math.PI * 2, RISE = 0.012, MOTOR = 9; // rad/s
const BENCH = { minX: -0.62, maxX: 0.62, minZ: -0.94, maxZ: -0.22, top: 0.76 };
const MAT = { minX: -0.3, maxX: 0.3, minZ: -0.65, maxZ: -0.27, top: 0.763 };
const TRAY = { x: -0.43, z: -0.3, hx: layout.trayHalf[0], hz: layout.trayHalf[1], top: 0.763 };
const OUT = { x: 0.4, z: -0.3, hx: 0.1, hz: 0.08, top: 0.766 };
const MAT_CENTER = new Vector3(0, MAT.top, -0.46);
const CHUTE_EXIT = new Vector3(0, 0.79, -0.66);
const PHONE_Q = new Quaternion().setFromAxisAngle(UP, Math.PI / 2);
const REST: Record<string, number> = { screw: 0.01, driver: 0.0185, spudger: 0.0085, brush: 0.0078, probe: 0.0085 };
const REQUIRED = ['phone-body', 'phone-back', 'screw1', 'screw2', 'screw3', 'screw4', 'battery-ok', 'battery-bad', 'battery-spare', 'port-ok', 'port-bad', 'port-spare', 'plug', 'driver', 'spudger', 'brush', 'multimeter', 'probe'];

type Pose = { p: Vector3; q: Quaternion };
type Item = { id: string; kind: string; e: Entity; home: Pose; parked: boolean };
type Screw = { in: boolean; p: number };

export class RepairSystem extends createSystem({
  items: { required: [RepairItem] },
  grabbed: { required: [RepairItem, Grabbed] },
  hovered: { required: [RepairItem, Hovered] },
  pressables: { required: [Pressable] },
}) {
  private readonly items = new Map<string, Item>();
  private readonly objToEntity = new Map<Object3D, Entity>();
  private readonly hl = new Highlighter();
  private desk!: DesktopInput;
  private ready = false;
  private now = 0;

  // phone / order state
  private order: Order | null = null;
  private active = false;
  private screws: Screw[] = [0, 1, 2, 3].map(() => ({ in: true, p: 0 }));
  private covered = true; private popped = false; private closing = false; private pryT = 0;
  private plugged = true; private battery: string | null = 'battery-ok'; private port: string | null = 'port-ok';
  private dust = 0; private faults: FaultId[] = [];
  private usedMeter = false; private extraSwaps = 0; private mistakes = 0; private startT = 0; private passed = false;
  private removedOriginal = new Set<string>();
  private stock = { port: 1, battery: 1 };
  private upgrades = new Set<string>();
  private lastHint = ''; private hintAcc = 0; private warnAt = -9; private loggedBrush = false;
  private slide: { t: number; from: Vector3 } | null = null;

  // motion
  private readonly settling = new Map<Entity, { vy: number; rest: number }>();
  private readonly returning = new Map<Entity, { t: number; from: Pose }>();
  private readonly trayScrews = new Set<string>();
  private drvPrev = new Quaternion(); private drvWas = false;
  private tipPrev = new Map<string, Vector3>();
  private ribbon!: Mesh; private probeCable!: Mesh;
  private meterScreen: CanvasScreen | null = null; private meterLast = '';
  private leds = new Map<string, MeshStandardMaterial>();
  private phoneLed: MeshStandardMaterial | null = null; private dustMat: MeshStandardMaterial | null = null;

  // scratch
  private readonly bp = new Vector3(); private readonly bq = new Quaternion(); private readonly bqi = new Quaternion();
  private readonly a = new Vector3(); private readonly b = new Vector3(); private readonly c = new Vector3(); private readonly d = new Vector3();
  private readonly qa = new Quaternion(); private readonly qb = new Quaternion(); private readonly eu = new Euler();
  private readonly lp = new Vector3(); private readonly lq = new Quaternion(); private readonly pq = new Quaternion();

  // ====================================================================== setup
  init(): void {
    for (const e of this.queries.items.entities) this.reg(e);
    this.cleanupFuncs.push(this.queries.items.subscribe('qualify', (e) => this.reg(e)));
    const missing = REQUIRED.filter((id) => !this.items.has(id));
    if (missing.length) { console.error('RepairSystem: missing scene items:', missing.join(', ')); return; }
    this.cleanupFuncs.push(
      this.queries.grabbed.subscribe('qualify', (e) => this.grab(e)),
      this.queries.grabbed.subscribe('disqualify', (e) => this.release(e)),
      this.queries.hovered.subscribe('qualify', (e) => { if (!this.isHeld(e) && this.hl.state(e) === 0) this.hl.set(e, 1); }),
      this.queries.hovered.subscribe('disqualify', (e) => { if (!this.isHeld(e) && this.hl.state(e) === 1) this.hl.set(e, 0); }),
      bus.on('start-order', (o: Order) => this.startOrder(o)),
      bus.on('press', (a: string) => { if (a === 'power') this.powerTest(); }),
      bus.on('stock', (s: { port: number; battery: number }) => { this.stock = s; this.refreshSpares(); }),
      bus.on('upgrades', (u: string[]) => { this.upgrades = new Set(u); }),
    );
    const key = (ev: KeyboardEvent): void => { if (!ev.repeat && ev.key.toLowerCase() === 'p') this.powerTest(); };
    window.addEventListener('keydown', key);
    this.cleanupFuncs.push(() => window.removeEventListener('keydown', key));

    // Pressables (physical buttons / rig): poke, pinch, ray or click
    for (const e of this.queries.pressables.entities) {
      const obj = e.object3D, action = e.getValue(Pressable, 'action') ?? '';
      if (!obj) continue;
      if (!e.hasComponent(Interactable)) e.addComponent(Interactable);
      if (!e.hasComponent(RayInteractable)) e.addComponent(RayInteractable);
      obj.traverse((o) => { o.pointerEvents = 'auto'; });
      const fire = (): void => { bus.emit('press', action); this.press(obj); };
      obj.addEventListener('click', fire);
      clickables.set(obj, fire);
      this.cleanupFuncs.push(() => { obj.removeEventListener('click', fire); clickables.delete(obj); });
    }

    this.desk = new DesktopInput({
      head: () => this.player.head,
      items: () => this.visibleItems(),
      panels: () => ['hud', 'order-panel', 'log-panel', 'tablet-panel', 'receipt-panel'].map((id) => this.world.getSceneObject(id) as Object3D | undefined).filter((o): o is Object3D => !!o),
      onGrab: (e) => this.grab(e), onRelease: (e) => this.release(e),
      onMove: (e, p) => { e.object3D?.getWorldQuaternion(this.qa); this.setPose(e, p, this.qa); },
      onHover: (e) => { for (const it of this.items.values()) if (this.hl.state(it.e) === 1 && it.e !== e) this.hl.set(it.e, 0); if (e && !this.isHeld(e) && this.hl.state(e) === 0) this.hl.set(e, 1); },
      floorAt: (x, z) => this.surfaceAt(x, z),
    });
    this.cleanupFuncs.push(() => { this.desk.dispose(); this.hl.dispose(); });

    // cables (battery ribbon + multimeter probe lead)
    const mk = (color: string, t: number): Mesh => { const m = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color, roughness: 0.6 })); m.scale.set(t, t * 0.35, 0.01); m.visible = false; m.raycast = () => {}; this.world.scene.add(m); return m; };
    this.ribbon = mk('#e08a1c', 0.016); this.probeCable = mk('#b32424', 0.004);
    this.cleanupFuncs.push(() => { this.world.scene.remove(this.ribbon, this.probeCable); });

    // per-instance screens / LEDs / dust
    const meter = this.items.get('multimeter')!.e.object3D;
    this.meterScreen = CanvasScreen.attach(meter, 'screen', 'y', 256, 128);
    this.drawMeter('--.--', 'TOUCH A PAD', '#2b3d1f');
    const rig = this.world.getSceneObject('rig') as Object3D | undefined;
    for (const n of ['led1', 'led2', 'led3']) { const m = this.ownMaterial(rig?.getObjectByName(n)); if (m) this.leds.set(n, m); }
    this.phoneLed = this.ownMaterial(this.items.get('phone-back')!.e.object3D?.getObjectByName('led'));
    this.dustMat = this.ownMaterial(this.items.get('phone-body')!.e.object3D?.getObjectByName('dust'));
    if (this.dustMat) { this.dustMat.transparent = true; this.dustMat.depthWrite = false; this.dustMat.side = DoubleSide; this.dustMat.opacity = 0; }

    for (const id of REQUIRED) { const it = this.items.get(id)!; if (it.kind !== 'tool') this.park(it); }
    this.ready = true;
    this.refreshSpares();
    bus.emit('monitor', { title: 'REBOOT LAB', lines: ['READY.', 'Press the green button', 'to accept a job.'], tone: 'idle' });
  }

  private ownMaterial(o: Object3D | undefined): MeshStandardMaterial | null {
    if (!(o instanceof Mesh)) return null;
    const m = (o.material as MeshStandardMaterial).clone();
    o.material = m;
    return m;
  }

  private reg(e: Entity): void {
    const obj = e.object3D, id = e.getValue(RepairItem, 'id') ?? '', kind = e.getValue(RepairItem, 'kind') ?? '';
    if (!obj || !id || this.items.has(id)) return;
    if (!e.hasComponent(Interactable)) e.addComponent(Interactable);
    if (!e.hasComponent(RayInteractable)) e.addComponent(RayInteractable);
    obj.traverse((o) => { o.pointerEvents = 'auto'; });
    this.items.set(id, { id, kind, e, home: this.worldPose(obj), parked: false });
    this.objToEntity.set(obj, e);
  }
  private *visibleItems(): Iterable<[Object3D, Entity]> { for (const it of this.items.values()) if (!it.parked && it.e.object3D) yield [it.e.object3D, it.e]; }
  private it(id: string): Item { return this.items.get(id)!; }
  private idOf(e: Entity): string { return e.getValue(RepairItem, 'id') ?? ''; }
  private isHeld(e: Entity): boolean { return e.hasComponent(Grabbed) || this.desk?.carried?.entity === e; }
  private held(id: string): boolean { return this.isHeld(this.it(id).e); }

  // ====================================================================== geometry helpers
  private worldPose(o: Object3D): Pose { o.updateWorldMatrix(true, false); return { p: o.getWorldPosition(new Vector3()), q: o.getWorldQuaternion(new Quaternion()) }; }
  private setPose(e: Entity, pos: Vector3, quat: Quaternion): void {
    const o = e.object3D; if (!o) return;
    const parent = o.parent, lp = this.lp.copy(pos), lq = this.lq.copy(quat);
    if (parent) { parent.updateWorldMatrix(true, false); parent.worldToLocal(lp); parent.getWorldQuaternion(this.pq).invert(); lq.premultiply(this.pq); }
    o.position.copy(lp); o.quaternion.copy(lq);
    const pv = e.getVectorView(Transform, 'position'); pv[0] = lp.x; pv[1] = lp.y; pv[2] = lp.z;
    const ov = e.getVectorView(Transform, 'orientation'); ov[0] = lq.x; ov[1] = lq.y; ov[2] = lq.z; ov[3] = lq.w;
  }
  private park(it: Item): void { it.parked = true; this.settling.delete(it.e); this.returning.delete(it.e); if (it.e.object3D) it.e.object3D.visible = false; this.setPose(it.e, this.a.set(0, -50, 0), this.qa.identity()); this.hl.set(it.e, 0); }
  private unpark(it: Item, pos?: Vector3, quat?: Quaternion): void { it.parked = false; if (it.e.object3D) it.e.object3D.visible = true; if (pos) this.setPose(it.e, pos, quat ?? this.qa.identity()); }
  private toHome(it: Item): void { this.unpark(it, it.home.p, it.home.q); }

  /** body-local point -> world */
  private loc(v: Vector3, out: Vector3): Vector3 { return out.copy(v).applyQuaternion(this.bq).add(this.bp); }
  /** world point -> body-local */
  private toLoc(w: Vector3, out: Vector3): Vector3 { return out.copy(w).sub(this.bp).applyQuaternion(this.bqi); }
  private refreshBody(): void {
    const o = this.it('phone-body').e.object3D!;
    o.getWorldPosition(this.bp); o.getWorldQuaternion(this.bq); this.bqi.copy(this.bq).invert();
  }
  private surfaceAt(x: number, z: number): number {
    let y = 0;
    const inb = x >= BENCH.minX && x <= BENCH.maxX && z >= BENCH.minZ && z <= BENCH.maxZ;
    if (inb) y = BENCH.top;
    if (x >= MAT.minX && x <= MAT.maxX && z >= MAT.minZ && z <= MAT.maxZ) y = MAT.top;
    if (Math.abs(x - TRAY.x) < TRAY.hx && Math.abs(z - TRAY.z) < TRAY.hz) y = TRAY.top;
    if (Math.abs(x - OUT.x) < OUT.hx && Math.abs(z - OUT.z) < OUT.hz) y = OUT.top;
    if (this.active && !this.it('phone-body').parked) {
      this.a.set(x, this.bp.y, z); this.toLoc(this.a, this.b);
      if (Math.abs(this.b.x) < W && Math.abs(this.b.z) < L) y = Math.max(y, this.bp.y + (this.covered ? T + CT : 0.01));
    }
    return y;
  }

  // ====================================================================== orders
  private startOrder(o: Order): void {
    this.order = o; this.faults = o.faults; this.active = true; this.passed = false;
    this.screws.forEach((s) => { s.in = true; s.p = 0; });
    this.covered = true; this.popped = false; this.closing = false; this.pryT = 0; this.plugged = true;
    this.dust = o.faults.includes('dust') ? 1 : 0;
    this.battery = o.faults.includes('battery') ? 'battery-bad' : 'battery-ok';
    this.port = o.faults.includes('port') ? 'port-bad' : 'port-ok';
    this.usedMeter = false; this.extraSwaps = 0; this.mistakes = 0; this.startT = this.now; this.removedOriginal.clear(); this.trayScrews.clear(); this.loggedBrush = false;
    for (const id of ['battery-ok', 'battery-bad', 'port-ok', 'port-bad']) { const it = this.it(id); if (id !== this.battery && id !== this.port) this.park(it); else this.unpark(it); }
    for (const id of ['phone-body', 'phone-back', 'screw1', 'screw2', 'screw3', 'screw4', 'plug']) this.unpark(this.it(id));
    this.setPose(this.it('phone-body').e, CHUTE_EXIT, PHONE_Q);
    this.slide = { t: 0, from: CHUTE_EXIT.clone() };
    this.refreshSpares();
    this.setLed(this.phoneLed, 'off'); for (const n of ['led1', 'led2', 'led3']) this.setLed(this.leds.get(n) ?? null, 'off');
    bus.emit('anim', { node: 'intake-chute', clip: 'open' }); sfx.pop();
    bus.emit('log', `New job: ${o.customer.name}'s phone`);
    bus.emit('monitor', { title: 'JOB ACCEPTED', lines: [`Owner: ${o.customer.name}`, 'Symptom reported.', 'Diagnose, then repair.'], tone: 'idle' });
    this.lastHint = '';
  }

  private refreshSpares(): void {
    for (const kind of ['battery', 'port'] as const) {
      const it = this.it(`${kind}-spare`), installed = (kind === 'battery' ? this.battery : this.port) === it.id;
      if (installed) continue;
      if (this.stock[kind] > 0 && it.parked) this.toHome(it);
      else if (this.stock[kind] <= 0) this.park(it);
    }
  }

  // ====================================================================== grab / release
  private grab(e: Entity): void {
    const id = this.idOf(e);
    this.settling.delete(e); this.returning.delete(e);
    this.hl.set(e, 5);
    const s = this.screwIndex(id);
    if (s >= 0 && this.screws[s].in && this.screws[s].p >= 0.999) this.screws[s].in = false;
    this.trayScrews.delete(id);
  }

  private release(e: Entity): void {
    const id = this.idOf(e), it = this.items.get(id);
    if (!it || it.parked || !e.object3D) return;
    this.hl.set(e, 0);
    e.object3D.getWorldPosition(this.c);
    const s = this.screwIndex(id);
    let placed = false;
    if (s >= 0) placed = this.releaseScrew(it, s);
    else if (id === 'phone-back') placed = this.releaseCover(it);
    else if (id === 'plug') placed = this.releasePlug(it);
    else if (id.startsWith('battery') || id.startsWith('port')) placed = this.releasePart(it);
    if (placed) return;
    if (it.kind === 'tool') { if (this.surfaceAt(this.c.x, this.c.z) > 0) this.settling.set(e, { vy: 0, rest: REST[id] ?? 0 }); else { this.returning.set(e, { t: 0, from: this.worldPose(e.object3D) }); } return; }
    this.settling.set(e, { vy: 0, rest: REST[it.kind] ?? REST[id] ?? 0 });
  }

  private screwIndex(id: string): number { return id.startsWith('screw') ? Number(id.slice(5)) - 1 : -1; }

  private holeWorld(i: number, out: Vector3): Vector3 { return this.loc(this.d.set(PH.holes[i][0], T + CT, PH.holes[i][1]), out); }

  private releaseScrew(it: Item, i: number): boolean {
    const pos = this.c; // screw origin (head bottom)
    // magnetic tray
    if (Math.abs(pos.x - TRAY.x) < TRAY.hx + 0.012 && Math.abs(pos.z - TRAY.z) < TRAY.hz + 0.012 && pos.y < TRAY.top + 0.07) {
      const slots = layout.traySlots as number[][]; let best = -1, bd = 1e9;
      slots.forEach(([sx, sz], k) => { const dd = Math.hypot(pos.x - (TRAY.x + sx), pos.z - (TRAY.z + sz)); const taken = [...this.trayScrews].some((id) => id !== it.id && this.slotOf(id) === k); if (!taken && dd < bd) { bd = dd; best = k; } });
      if (best >= 0) { this.setPose(it.e, this.a.set(TRAY.x + slots[best][0], TRAY.top + 0.0036 + REST.screw, TRAY.z + slots[best][1]), this.qa.identity()); this.trayScrews.add(it.id); this.trayMap.set(it.id, best); sfx.snap(); bus.emit('log', `Screw ${i + 1} stored in the magnetic tray`); return true; }
    }
    // seat in a hole
    if (this.covered && !this.screws[i].in) {
      this.refreshBody();
      let bestH = -1, bd = 1e9;
      for (let h = 0; h < 4; h++) { if (this.screws.some((s, k) => s.in && this.holeAssigned[k] === h)) continue; this.holeWorld(h, this.b); const dd = Math.hypot(pos.x - this.b.x, pos.z - this.b.z); if (dd < bd && Math.abs(pos.y - (this.b.y + RISE)) < 0.04) { bd = dd; bestH = h; } }
      this.a.set(0, 1, 0).applyQuaternion(this.qa.copy(it.e.object3D!.getWorldQuaternion(this.qb)));
      if (bestH >= 0 && bd < 0.022 && this.a.dot(UP) > 0.75) { this.screws[i].in = true; this.screws[i].p = 1; this.holeAssigned[i] = bestH; sfx.snap(); pulse(this.input?.gamepads?.right, 0.4, 25); bus.emit('log', `Seated screw ${i + 1}`); return true; }
    }
    return false;
  }
  private readonly holeAssigned = [0, 1, 2, 3];
  private readonly trayMap = new Map<string, number>();
  private slotOf(id: string): number { return this.trayMap.get(id) ?? -1; }

  private releaseCover(it: Item): boolean {
    if (this.covered) return false;
    this.refreshBody();
    this.loc(this.d.set(0, T, 0), this.b);
    this.c.copy(it.e.object3D!.getWorldPosition(this.a));
    if (Math.hypot(this.c.x - this.b.x, this.c.z - this.b.z) < 0.05 && Math.abs(this.c.y - this.b.y) < 0.045) {
      this.covered = true; this.popped = false; this.closing = true; sfx.snap(); pulse(this.input?.gamepads?.right, 0.5, 40); bus.emit('log', 'Put the cover back on');
      return true;
    }
    return false;
  }
  private releasePlug(it: Item): boolean {
    if (this.plugged || !this.battery) return false;
    this.refreshBody(); this.loc(SOCK_B, this.b);
    it.e.object3D!.getWorldPosition(this.c);
    if (this.c.distanceTo(this.b) < 0.03) { this.plugged = true; sfx.snap(); pulse(this.input?.gamepads?.right, 0.5, 40); bus.emit('log', 'Reconnected the battery'); return true; }
    return false;
  }
  private releasePart(it: Item): boolean {
    if (this.covered) return false;
    const isBat = it.id.startsWith('battery');
    if (isBat ? this.battery : this.port) return false;
    this.refreshBody(); this.loc(isBat ? BAY : SOCK_P, this.b);
    it.e.object3D!.getWorldPosition(this.c);
    if (Math.hypot(this.c.x - this.b.x, this.c.z - this.b.z) < (isBat ? 0.045 : 0.035) && Math.abs(this.c.y - this.b.y) < 0.05) {
      if (isBat) this.battery = it.id; else this.port = it.id;
      const slot = isBat ? 'battery' : 'port';
      if (it.id.endsWith('spare') && this.removedOriginal.has(`${slot}-ok`)) this.extraSwaps++;
      sfx.snap(); pulse(this.input?.gamepads?.right, 0.6, 50); bus.emit('log', `Installed the ${isBat ? 'battery' : 'charge-port module'}`);
      return true;
    }
    return false;
  }

  // ====================================================================== per frame
  update(delta: number, time: number): void {
    if (!this.ready) return;
    const dt = Math.min(delta, 0.05);
    this.now = time;
    this.desk.update();
    this.hl.update(time);
    if (!this.active) { this.updateMotion(dt); return; }
    const body = this.it('phone-body');
    if (this.slide && !this.isHeld(body.e)) {
      this.slide.t = Math.min(1, this.slide.t + dt / 1.5);
      const k = 1 - Math.pow(1 - this.slide.t, 3);
      this.setPose(body.e, this.a.copy(this.slide.from).lerp(MAT_CENTER, k).add(this.b.set(0, Math.sin(k * Math.PI) * 0.01, 0)), PHONE_Q);
      if (this.slide.t >= 1) this.slide = null;
    } else if (this.slide) this.slide = null;
    this.refreshBody();
    this.heldChecks();
    this.applyAssembly();
    this.updateDriver(dt); this.updateSpudger(dt); this.updateBrush(dt); this.updateProbe(dt);
    this.updateMotion(dt);
    this.updateCables();
    this.checkOutTray();
    if (this.dustMat) this.dustMat.opacity = this.covered ? 0 : this.dust * 0.85;
    this.hintAcc += dt;
    if (this.hintAcc > 0.5) { this.hintAcc = 0; this.pushHint(); }
  }

  private warn(msg: string): void { if (this.now - this.warnAt > 1.8) { this.warnAt = this.now; bus.emit('hint', msg); sfx.bad(); } }

  private screwLocked(i: number): boolean { return this.screws[i].in && this.screws[i].p < 0.9; }
  private coverLocked(): boolean { return !this.popped || this.screws.some((s) => s.in && s.p < 0.9); }

  /** Release locked parts from the hand and detect parts the player pulls out. */
  private heldChecks(): void {
    const cover = this.it('phone-back');
    if (this.covered && this.held('phone-back')) {
      this.loc(this.d.set(0, T, 0), this.b); cover.e.object3D!.getWorldPosition(this.c);
      if (this.coverLocked()) { if (this.c.distanceTo(this.b) > 0.015) this.warn(this.screws.some((s) => s.in && s.p < 0.9) ? 'Screws still hold the cover!' : 'Pry the cover clips with the spudger first.'); }
      else if (this.c.distanceTo(this.b) > 0.05) { this.covered = false; sfx.pop(); bus.emit('log', 'Lifted off the back cover'); }
    }
    for (let i = 0; i < 4; i++) if (this.screws[i].in && this.held(`screw${i + 1}`) && this.screws[i].p < 0.9) this.warn('Use the screwdriver: twist it, or hold the trigger.');
    if (this.battery && this.held(this.battery)) {
      if (this.plugged) this.warn('Disconnect the battery plug first!');
      else { this.loc(BAY, this.b); this.it(this.battery).e.object3D!.getWorldPosition(this.c); if (this.c.distanceTo(this.b) > 0.05) { this.removedOriginal.add(this.battery.replace('-bad', '-ok')); this.battery = null; sfx.pop(); bus.emit('log', 'Took the battery out'); } }
    }
    if (this.port && this.held(this.port)) {
      if (this.plugged) this.warn('Unplug the battery before touching the port!');
      else { this.loc(SOCK_P, this.b); this.it(this.port).e.object3D!.getWorldPosition(this.c); if (this.c.distanceTo(this.b) > 0.04) { this.removedOriginal.add(this.port.replace('-bad', '-ok')); this.port = null; sfx.pop(); bus.emit('log', 'Pulled the charge-port module out'); } }
    }
    if (this.plugged && this.held('plug')) { this.loc(SOCK_B, this.b); this.it('plug').e.object3D!.getWorldPosition(this.c); if (this.c.distanceTo(this.b) > 0.028) { this.plugged = false; sfx.pop(); pulse(this.input?.gamepads?.right, 0.4, 40); bus.emit('log', 'Disconnected the battery'); } }
  }

  /** Installed parts follow the phone body (and are held in place while locked). */
  private applyAssembly(): void {
    const put = (id: string, local: Vector3, extra?: Quaternion): void => {
      const it = this.it(id); if (it.parked) return;
      this.loc(local, this.a); this.qa.copy(this.bq); if (extra) this.qa.multiply(extra);
      this.setPose(it.e, this.a, this.qa);
    };
    const free = (id: string, locked: boolean): boolean => !this.held(id) || locked;
    if (this.covered && free('phone-back', this.coverLocked())) put('phone-back', this.d.set(0, T, 0));
    for (let i = 0; i < 4; i++) {
      const s = this.screws[i], id = `screw${i + 1}`;
      if (!s.in || !this.covered || this.it(id).parked) continue;
      if (!free(id, s.p < 0.9)) continue;
      const h = PH.holes[this.holeAssigned[i]];
      this.eu.set(0, -s.p * RAD, 0); this.qb.setFromEuler(this.eu);
      put(id, this.c.set(h[0], T + CT + s.p * RISE, h[1]), this.qb);
    }
    if (this.battery && free(this.battery, this.plugged)) put(this.battery, BAY);
    if (this.port && free(this.port, this.plugged)) put(this.port, SOCK_P);
    if (this.plugged && this.battery && free('plug', false)) put('plug', SOCK_B);
    this.it('phone-body').e.object3D!.getWorldPosition(this.bp);
  }

  // ====================================================================== tools
  private triggerHeldNear(pos: Vector3): boolean {
    for (const side of ['left', 'right'] as const) {
      const pad = this.input?.gamepads?.[side]; const grip = this.player.gripSpaces?.[side];
      if (!pad || !grip) continue;
      if (pad.getButtonPressed(InputComponent.Trigger) && grip.getWorldPosition(this.d).distanceTo(pos) < 0.3) return true;
    }
    return false;
  }
  private tipOf(id: string, out: Vector3, fwd?: Vector3): Object3D {
    const o = this.it(id).e.object3D!;
    o.getWorldPosition(out); o.getWorldQuaternion(this.qa);
    if (fwd) fwd.set(0, 0, -1).applyQuaternion(this.qa);
    out.add(this.d.copy(TIPS[id]).applyQuaternion(this.qa));
    return o;
  }
  private speedOf(id: string, tip: Vector3, dt: number): number {
    const prev = this.tipPrev.get(id);
    const sp = prev ? prev.distanceTo(tip) / Math.max(dt, 1e-3) : 0;
    if (prev) prev.copy(tip); else this.tipPrev.set(id, tip.clone());
    return sp;
  }

  private updateDriver(dt: number): void {
    const it = this.it('driver');
    if (!this.held('driver')) { this.drvWas = false; return; }
    const tip = this.a, fwd = this.b;
    const obj = this.tipOf('driver', tip, fwd);
    obj.getWorldQuaternion(this.qb);
    let twist = 0;
    if (this.drvWas) {
      const dq = this.pq.copy(this.drvPrev).invert().multiply(this.qb);
      twist = -2 * Math.atan2(dq.z, dq.w);
      if (twist > Math.PI) twist -= 2 * Math.PI; else if (twist < -Math.PI) twist += 2 * Math.PI;
      if (Math.abs(twist) > 1.2) twist = 0;
    }
    this.drvPrev.copy(this.qb); this.drvWas = true;
    const motorOn = this.triggerHeldNear(obj.getWorldPosition(this.c));
    const speed = MOTOR * (this.upgrades.has('motor') ? 2 : 1);
    let total = twist + (motorOn ? (this.closing ? 1 : -1) * speed * dt : 0);
    if (this.desk.carried?.entity === it.e && this.desk.twistTicks) { total += this.desk.twistTicks * -0.6; this.desk.twistTicks = 0; }
    // which screw is the bit on?
    let target = -1, bd = 0.02;
    if (this.covered) for (let i = 0; i < 4; i++) {
      const s = this.screws[i]; if (!s.in) continue;
      const so = this.it(`screw${i + 1}`).e.object3D!; so.getWorldPosition(this.c); so.getWorldQuaternion(this.qa);
      this.c.add(this.d.set(0, 0.004, 0).applyQuaternion(this.qa));
      const dd = tip.distanceTo(this.c), up = this.d.set(0, 1, 0).applyQuaternion(this.qa);
      if (dd < bd && fwd.dot(up) < -0.7) { bd = dd; target = i; }
    }
    const bit = obj.getObjectByName('bit');
    if (bit && (motorOn || Math.abs(total) > 0.001)) bit.rotation.z += (total || 0.3);
    if (target < 0 || Math.abs(total) < 1e-4) return;
    const s = this.screws[target], before = Math.floor(s.p * 12);
    s.p = Math.max(0, Math.min(1, s.p - total / RAD));
    if (Math.floor(s.p * 12) !== before) { sfx.tick(); pulse(this.input?.gamepads?.right, 0.25, 12); pulse(this.input?.gamepads?.left, 0.25, 12); }
    if (s.p >= 1) { s.in = false; this.settling.set(this.it(`screw${target + 1}`).e, { vy: 0.9, rest: REST.screw }); sfx.pop(); bus.emit('log', `Removed screw ${target + 1}`); }
    else if (s.p <= 0.001 && this.closing) { if (this.screws.every((x) => x.in && x.p < 0.05)) bus.emit('log', 'All screws tightened'); }
  }

  private updateSpudger(dt: number): void {
    if (!this.held('spudger') || !this.covered || this.popped || this.screws.some((s) => s.in && s.p < 0.9)) return;
    const tip = this.a; this.tipOf('spudger', tip);
    const sp = this.speedOf('spudger', tip, dt);
    this.toLoc(tip, this.b);
    const inside = Math.abs(this.b.x) < W + 0.02 && Math.abs(this.b.z) < L + 0.02, rim = Math.min(W - Math.abs(this.b.x), L - Math.abs(this.b.z)) < 0.03;
    if (inside && rim && Math.abs(this.b.y - (T + CT)) < 0.03 && sp > 0.04) {
      this.pryT += dt; pulse(this.input?.gamepads?.right, 0.2, 10);
      if (this.pryT > 0.6) { this.popped = true; sfx.pop(); pulse(this.input?.gamepads?.right, 0.8, 70); bus.emit('log', 'Popped the cover clips'); }
    }
  }

  private updateBrush(dt: number): void {
    if (!this.held('brush') || this.covered || this.dust <= 0) return;
    const tip = this.a; this.tipOf('brush', tip);
    const sp = this.speedOf('brush', tip, dt);
    this.toLoc(tip, this.b);
    if (Math.abs(this.b.x) < 0.062 && this.b.z > -0.132 && this.b.z < 0.09 && this.b.y > -0.01 && this.b.y < 0.03 && sp > 0.03) {
      this.dust = Math.max(0, this.dust - dt * 0.55 * Math.min(1.5, sp * 3) * (this.upgrades.has('cleaning') ? 2 : 1));
      pulse(this.input?.gamepads?.right, 0.15, 10);
      if (!this.loggedBrush) { this.loggedBrush = true; bus.emit('log', 'Brushing the dust off the board'); }
      if (this.dust <= 0.02) { this.dust = 0; sfx.snap(); bus.emit('log', 'Board is clean'); }
    }
  }

  private updateProbe(dt: number): void {
    if (!this.held('probe')) { if (this.meterLast !== 'idle') { this.meterLast = 'idle'; this.drawMeter('--.--', 'TOUCH A PAD', '#2b3d1f'); } return; }
    const tip = this.a; this.tipOf('probe', tip);
    let reading = '', label = '', tone = '#2b3d1f', hit = false;
    for (const it of this.items.values()) {
      if (it.parked || !(it.id.startsWith('battery') || it.id.startsWith('port')) || !it.e.object3D) continue;
      const pad = it.id.startsWith('battery') ? PAD_B : PAD_P;
      it.e.object3D.localToWorld(this.c.copy(pad));
      if (tip.distanceTo(this.c) < 0.014) {
        hit = true; this.usedMeter = true;
        const bad = it.id.endsWith('bad'), bat = it.id.startsWith('battery');
        reading = bat ? (bad ? '2.10' : '3.92') : (bad ? '0.00' : '5.02'); label = bat ? 'BATTERY PAD' : 'PORT PAD';
        if (this.upgrades.has('magnifier')) label += bad ? '  FAULT' : '  OK';
        tone = bad ? '#7a1f1f' : '#1f5a2b'; break;
      }
    }
    const key = hit ? reading + label : 'none';
    if (key !== this.meterLast) { this.meterLast = key; if (hit) { sfx.tick(); pulse(this.input?.gamepads?.right, 0.3, 20); } this.drawMeter(hit ? reading : '--.--', hit ? label : 'TOUCH A PAD', tone); }
  }
  private drawMeter(value: string, label: string, bg: string): void {
    this.meterScreen?.draw((g, w, h) => {
      g.fillStyle = '#b9c9a0'; g.fillRect(0, 0, w, h); g.fillStyle = bg; g.globalAlpha = 0.25; g.fillRect(0, 0, w, h); g.globalAlpha = 1;
      g.fillStyle = '#1b2410'; g.font = '700 22px monospace'; g.fillText(label, 12, 28); g.font = '700 74px monospace'; g.fillText(value, 12, 100); g.font = '700 30px monospace'; g.fillText('V', w - 44, 100);
    });
  }

  // ====================================================================== motion: settle, return, cables, out tray
  private updateMotion(dt: number): void {
    for (const [e, r] of this.returning) {
      const home = this.items.get(this.idOf(e))?.home;
      if (!home || this.isHeld(e)) { this.returning.delete(e); continue; }
      r.t = Math.min(1, r.t + dt / 0.5);
      const k = r.t * r.t * (3 - 2 * r.t);
      this.setPose(e, this.a.copy(r.from.p).lerp(home.p, k), this.qa.copy(r.from.q).slerp(home.q, k));
      if (r.t >= 1) this.returning.delete(e);
    }
    for (const [e, s] of this.settling) {
      const o = e.object3D;
      if (!o || this.isHeld(e)) { this.settling.delete(e); continue; }
      s.vy -= 9.81 * dt;
      o.getWorldPosition(this.a); o.getWorldQuaternion(this.qa);
      const ground = this.surfaceAt(this.a.x, this.a.z) + s.rest;
      const ny = this.a.y + s.vy * dt;
      if (ny <= ground) {
        this.a.y = ground;
        this.eu.setFromQuaternion(this.qa, 'YXZ'); this.qb.setFromAxisAngle(UP, this.eu.y);
        const id = this.idOf(e);
        if (id.startsWith('screw')) this.qb.identity();
        this.setPose(e, this.a, this.qb);
        if (Math.abs(s.vy) > 1.1) s.vy = -s.vy * 0.2; else {
          this.settling.delete(e);
          if (ground - s.rest <= 0.001) { const it = this.items.get(id); if (it) this.returning.set(e, { t: 0, from: this.worldPose(o) }); }
          else sfx.tick();
        }
      } else { this.a.y = ny; this.setPose(e, this.a, this.qa); }
    }
  }

  private updateCables(): void {
    // battery ribbon: tab of the installed battery -> plug
    const bat = this.battery ? this.it(this.battery) : null, plug = this.it('plug');
    if (bat && !bat.parked && !plug.parked && this.active) {
      bat.e.object3D!.localToWorld(this.a.copy(TAB));
      plug.e.object3D!.localToWorld(this.b.set(0, 0.0015, 0.008));
      if (!this.plugged && !this.isHeld(plug.e)) {
        // tether: the ribbon is 0.1 m long; settle the plug near the battery if it was dropped too far
      }
      this.stretch(this.ribbon, this.a, this.b);
      if (!this.plugged && this.a.distanceTo(this.b) > 0.11 && this.isHeld(plug.e)) { this.d.copy(this.b).sub(this.a).setLength(0.11).add(this.a); plug.e.object3D!.getWorldQuaternion(this.qa); this.setPose(plug.e, this.d.sub(this.c.set(0, 0, 0)), this.qa); }
    } else this.ribbon.visible = false;
    // multimeter lead
    const mm = this.it('multimeter'), pr = this.it('probe');
    if (!mm.parked && !pr.parked) { mm.e.object3D!.localToWorld(this.a.set(0.0, 0.02, 0.09)); pr.e.object3D!.localToWorld(this.b.set(0, 0, 0.085)); this.stretch(this.probeCable, this.a, this.b); } else this.probeCable.visible = false;
  }
  private stretch(m: Mesh, from: Vector3, to: Vector3): void {
    const len = from.distanceTo(to); if (len < 0.003) { m.visible = false; return; }
    m.visible = true; m.position.copy(from).add(to).multiplyScalar(0.5); m.lookAt(to); m.scale.z = len;
  }

  private checkOutTray(): void {
    const body = this.it('phone-body');
    if (!this.active || this.isHeld(body.e) || this.slide) return;
    body.e.object3D!.getWorldPosition(this.a);
    if (Math.abs(this.a.x - OUT.x) < OUT.hx && Math.abs(this.a.z - OUT.z) < OUT.hz && this.surfaceAt(this.a.x, this.a.z) > 0 && this.a.y < 0.82) this.handBack();
  }

  private handBack(): void {
    const seconds = this.now - this.startT;
    if (!this.passed) {
      bus.emit('monitor', { title: 'NOT READY', lines: ['Customer says it is not', 'fixed yet. Run the power', 'test first!'], tone: 'warn' });
      bus.emit('hint', 'It must pass the POWER test before you hand it back.'); sfx.bad();
      this.slide = { t: 0, from: this.a.clone() }; this.mistakes++; return;
    }
    const used: string[] = [];
    if (this.battery === 'battery-spare') used.push('battery'); if (this.port === 'port-spare') used.push('port');
    for (const k of used) bus.emit('spare-used', k);
    this.active = false;
    for (const id of REQUIRED) { const it = this.it(id); if (it.kind !== 'tool') this.park(it); }
    this.ribbon.visible = false;
    bus.emit('phone-returned', { passed: true, seconds, target: this.order?.targetSeconds ?? 180, usedMeter: this.usedMeter, extraSwaps: this.extraSwaps, mistakes: this.mistakes, order: this.order });
    this.refreshSpares();
  }

  // ====================================================================== power test
  private setLed(m: MeshStandardMaterial | null, c: 'off' | 'green' | 'red' | 'amber'): void {
    if (!m) return;
    const col = { off: '#2a2a2a', green: '#19e65c', red: '#ff2a1f', amber: '#ffa31a' }[c];
    m.color.set(col); m.emissive.set(c === 'off' ? '#000000' : col); m.emissiveIntensity = c === 'off' ? 0 : 1.6;
  }
  private press(_obj: Object3D): void { sfx.click(); }

  private powerTest(): void {
    if (!this.active) { bus.emit('hint', 'Accept a job first (green button).'); return; }
    bus.emit('anim', { node: 'rig', clip: 'press' }); sfx.power();
    const assembled = this.covered && this.screws.every((s) => s.in && s.p < 0.15) && this.plugged && !!this.battery && !!this.port;
    const led = (n: string, c: 'off' | 'green' | 'red' | 'amber'): void => this.setLed(this.leds.get(n) ?? null, c);
    if (!assembled) {
      const why = !this.covered ? 'Cover is off.' : this.screws.some((s) => !s.in || s.p >= 0.15) ? 'Screws are loose.' : !this.battery ? 'No battery.' : !this.port ? 'No port module.' : 'Battery unplugged.';
      led('led1', 'amber'); led('led2', 'off'); led('led3', 'off');
      bus.emit('monitor', { title: 'POWER TEST', lines: ['Phone is not closed up.', why], tone: 'warn' }); bus.emit('hint', `Not ready: ${why}`); return;
    }
    const reasons: string[] = [];
    if (this.port === 'port-bad') reasons.push('USB: no charge detected');
    if (this.battery === 'battery-bad') reasons.push('BATT: swollen / low V');
    if (this.dust > 0.25) reasons.push('THERMAL: overheating');
    led('led1', 'green'); led('led2', this.port === 'port-bad' ? 'red' : 'green'); led('led3', this.dust > 0.25 ? 'amber' : this.battery === 'battery-bad' ? 'red' : 'green');
    if (reasons.length) {
      this.mistakes++; this.passed = false; this.setLed(this.phoneLed, 'red');
      bus.emit('monitor', { title: 'TEST FAILED', lines: reasons, tone: 'bad' }); bus.emit('log', 'Power test FAILED'); bus.emit('hint', 'Something is still wrong. Re-check the pads with the multimeter.'); sfx.bad();
    } else {
      this.passed = true; this.setLed(this.phoneLed, 'green'); chime();
      bus.emit('monitor', { title: 'BOOT OK', lines: ['USB: charging 5.0 V', 'BATT: 3.9 V  healthy', 'TEMP: normal', 'Hand it back: OUT tray.'], tone: 'ok' }); bus.emit('log', 'Power test PASSED'); bus.emit('hint', 'Perfect! Put the phone in the OUT tray.');
    }
  }

  // ====================================================================== hints
  private pushHint(): void {
    let text = '', target = '';
    const screwsOut = this.screws.every((s) => !s.in || s.p >= 0.999);
    if (this.passed) { text = 'Passed! Put the phone in the OUT tray.'; }
    else if (this.covered && !screwsOut && !this.closing) { text = 'Loosen the 4 screws: twist the driver or hold the trigger.'; target = 'driver'; }
    else if (this.covered && !this.popped && !this.closing && screwsOut) { text = 'Pry the cover edge with the spudger.'; target = 'spudger'; }
    else if (this.covered && this.popped) { text = 'Lift the back cover off.'; }
    else if (!this.covered) {
      if (this.plugged && this.faults.length && !this.usedMeter) { text = 'Probe the pads with the multimeter to find the fault.'; target = 'probe'; }
      else if (this.dust > 0.1 && this.faults.includes('dust')) { text = 'Brush the dust off the board.'; target = 'brush'; }
      else if (this.plugged && (this.faults.includes('port') || this.faults.includes('battery'))) { text = 'Pull the battery plug to disconnect power.'; }
      else if (!this.plugged && this.battery === 'battery-bad') { text = 'Swap the swollen battery for the spare.'; }
      else if (!this.plugged && this.port === 'port-bad') { text = 'Swap the burnt port module for the spare.'; }
      else if (!this.plugged && this.faults.includes('port') && !this.port) { text = 'Install the spare port module.'; }
      else if (!this.plugged) { text = 'Plug the battery connector back in.'; }
      else text = 'Put the cover back on.';
    } else if (this.closing) {
      text = this.screws.every((s) => s.in && s.p < 0.15) ? 'Press the POWER button on the test rig.' : 'Seat the screws and tighten them with the driver.';
    }
    if (text === this.lastHint) return;
    this.lastHint = text; bus.emit('hint', text);
    for (const id of ['driver', 'spudger', 'probe', 'brush']) { const it = this.it(id); if (this.hl.state(it.e) === 4) this.hl.set(it.e, 0); }
    if (target) this.hl.set(this.it(target).e, 4, this.now, 6);
  }
}
void Animated;
