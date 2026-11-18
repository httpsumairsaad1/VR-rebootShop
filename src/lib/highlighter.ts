import { BackSide, Entity, Mesh, MeshBasicMaterial, MeshStandardMaterial } from '@iwsdk/core';

/** 0 none, 1 hover (white), 2 correct (green), 3 wrong (red), 4 hint (amber pulse), 5 selected (sky blue), 6 guided (bright green pulse) */
const COLORS = ['#000000', '#ffffff', '#3dff8f', '#ff4d5e', '#ffb04a', '#4fc3ff', '#00ff44'];
const GLOW = [0, 0.12, 0.4, 0.45, 0.4, 0.35, 0.6];
type Entry = { std: Array<{ m: MeshStandardMaterial; e: string; i: number }>; out: Array<{ mesh: Mesh; mat: MeshBasicMaterial }> };

/** Cheap inverted-hull outline + emissive tint. No post-processing (Quest friendly). */
export class Highlighter {
  private readonly entries = new Map<Entity, Entry>();
  private readonly states = new Map<Entity, number>();
  private readonly until = new Map<Entity, number>();
  state(e: Entity): number { return this.states.get(e) ?? 0; }
  set(e: Entity, s: number, now = 0, hold = 0): void {
    if (this.states.get(e) === s && !hold) return;
    this.states.set(e, s);
    if (hold) this.until.set(e, now + hold); else this.until.delete(e);
    this.apply(e, s, 1);
  }
  update(now: number): void {
    for (const [e, s] of this.states) {
      const t = this.until.get(e);
      if (t !== undefined && now > t) { this.set(e, 0); continue; }
      if (s === 4 || s === 2) this.apply(e, s, 0.7 + Math.sin(now * 8) * 0.3);
    }
  }
  private apply(e: Entity, s: number, k: number): void {
    const en = this.get(e);
    for (const x of en.std) { if (s === 0) { x.m.emissive.set(x.e); x.m.emissiveIntensity = x.i; } else { x.m.emissive.set(COLORS[s]); x.m.emissiveIntensity = GLOW[s] * k; } }
    for (const o of en.out) { o.mat.color.set(COLORS[s]); o.mat.opacity = s === 0 ? 0 : s === 1 ? 0.3 : 0.75 * k; o.mesh.visible = s !== 0; o.mesh.scale.setScalar(s === 1 ? 1.03 : 1.06); }
  }
  private get(e: Entity): Entry {
    const have = this.entries.get(e);
    if (have) return have;
    const en: Entry = { std: [], out: [] };
    const meshes: Mesh[] = [];
    e.object3D?.traverse((o) => { if (o instanceof Mesh && o.name !== 'Interaction Outline' && !(o.material as { transparent?: boolean }).transparent) meshes.push(o); });
    for (const mesh of meshes) {
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const clones = list.map((m) => m.clone());
      mesh.material = Array.isArray(mesh.material) ? clones : clones[0];
      for (const m of clones) if (m instanceof MeshStandardMaterial) en.std.push({ m, e: m.emissive.getHexString(), i: m.emissiveIntensity });
      const mat = new MeshBasicMaterial({ color: '#ffffff', side: BackSide, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
      const out = new Mesh(mesh.geometry, mat);
      out.name = 'Interaction Outline'; out.visible = false; out.raycast = () => {};
      mesh.add(out); en.out.push({ mesh: out, mat });
    }
    this.entries.set(e, en);
    return en;
  }
  dispose(): void { for (const en of this.entries.values()) for (const o of en.out) { o.mesh.parent?.remove(o.mesh); o.mat.dispose(); } this.entries.clear(); this.states.clear(); }
}
