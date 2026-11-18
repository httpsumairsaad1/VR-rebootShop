import { Entity, Object3D, Raycaster, Vector3, Quaternion } from '@iwsdk/core';

/** UI elements and buttons that can be clicked by the desktop crosshair (shared registry). */
export const clickables = new Map<Object3D, () => void>();

export type DesktopOptions = {
  head: () => Object3D;
  items: () => Iterable<[Object3D, Entity]>;
  panels: () => Object3D[];
  onGrab: (e: Entity) => void;
  onRelease: (e: Entity) => void;
  onMove: (e: Entity, pos: Vector3) => void;
  onHover: (e: Entity | null) => void;
  floorAt: (x: number, z: number) => number;
};

/**
 * Pointer-lock fallback for the IWSDK emulator "play mode": a crosshair at the view centre.
 * Click = press buttons/select, hold-click = carry an item, wheel = carry distance, Shift+wheel = twist (driver).
 */
export class DesktopInput {
  carried: { entity: Entity; dist: number } | null = null;
  twistTicks = 0;
  private crosshair: HTMLDivElement | null = null;
  private hover: Entity | null = null;
  private readonly ray = new Raycaster();
  private readonly o = new Vector3();
  private readonly d = new Vector3();
  private readonly q = new Quaternion();
  private readonly p = new Vector3();
  private readonly lastFire = new Map<unknown, number>();
  private readonly off: Array<() => void> = [];

  constructor(private readonly opt: DesktopOptions) {
    const down = (ev: MouseEvent): void => { if (document.pointerLockElement && ev.button === 0) this.down(); };
    const up = (ev: MouseEvent): void => { if (ev.button === 0) this.up(); };
    const wheel = (ev: WheelEvent): void => {
      if (!this.carried) return;
      if (ev.shiftKey) this.twistTicks += Math.sign(ev.deltaY);
      else this.carried.dist = Math.min(1.2, Math.max(0.2, this.carried.dist - Math.sign(ev.deltaY) * 0.04));
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    document.addEventListener('wheel', wheel, { passive: true });
    this.off.push(() => { document.removeEventListener('mousedown', down); document.removeEventListener('mouseup', up); document.removeEventListener('wheel', wheel); });
  }

  private headRay(): void {
    const h = this.opt.head();
    h.getWorldPosition(this.o);
    h.getWorldQuaternion(this.q);
    this.d.set(0, 0, -1).applyQuaternion(this.q).normalize();
  }

  private resolve(): { fn?: () => void; entity?: Entity; point: Vector3 } | null {
    const targets: Object3D[] = [];
    for (const p of this.opt.panels()) if (p.visible) targets.push(p);
    const map = new Map<Object3D, Entity>();
    for (const [obj, e] of this.opt.items()) { if (obj.visible) { targets.push(obj); map.set(obj, e); } }
    this.headRay();
    this.ray.set(this.o, this.d);
    for (const h of this.ray.intersectObjects(targets, true)) {
      let o: Object3D | null = h.object;
      while (o) {
        const fn = clickables.get(o);
        if (fn) return { fn, point: h.point };
        const e = map.get(o);
        if (e) return { entity: e, point: h.point };
        o = o.parent;
      }
    }
    return null;
  }

  private down(): void {
    const hit = this.resolve();
    if (!hit) return;
    if (hit.fn) {
      const now = performance.now();
      if (now - (this.lastFire.get(hit.fn) ?? -1e9) > 200) { this.lastFire.set(hit.fn, now); hit.fn(); }
      return;
    }
    if (hit.entity) {
      this.headRay();
      this.carried = { entity: hit.entity, dist: Math.min(1.1, Math.max(0.25, hit.point.distanceTo(this.o))) };
      this.opt.onGrab(hit.entity);
    }
  }
  private up(): void {
    if (!this.carried) return;
    const e = this.carried.entity;
    this.carried = null;
    this.opt.onRelease(e);
  }

  update(): void {
    const locked = !!document.pointerLockElement;
    if (locked && !this.crosshair) {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border:2px solid #4fc3ff;border-radius:50%;pointer-events:none;z-index:9999;box-shadow:0 0 6px #4fc3ff';
      document.body.appendChild(el);
      this.crosshair = el;
    }
    if (this.crosshair) this.crosshair.style.display = locked ? 'block' : 'none';
    if (!locked) { this.up(); return; }
    if (this.carried) {
      this.headRay();
      this.p.copy(this.o).addScaledVector(this.d, this.carried.dist);
      this.p.y = Math.max(this.p.y, this.opt.floorAt(this.p.x, this.p.z) + 0.02);
      this.opt.onMove(this.carried.entity, this.p);
      return;
    }
    const e = this.resolve()?.entity ?? null;
    if (e !== this.hover) { this.hover = e; this.opt.onHover(e); }
  }
  dispose(): void { this.off.forEach((f) => f()); this.crosshair?.remove(); this.up(); }
}
