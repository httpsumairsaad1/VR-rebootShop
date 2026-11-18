import {
  AnimationAction, AnimationClip, AnimationMixer, AssetManager, BufferAttribute, BufferGeometry, Color, createSystem, Entity,
  LoopOnce, LoopRepeat, Mesh, MeshStandardMaterial, MeshBasicMaterial, Object3D, Points, PointsMaterial,
} from '@iwsdk/core';
import { Animated } from '../components.js';
import { bus } from '../game/bus.js';
import { CanvasScreen } from '../lib/canvas-screen.js';

type Rec = { mixer: AnimationMixer; clips: AnimationClip[]; actions: Map<string, AnimationAction>; loopNow?: AnimationAction };
type MonitorMsg = { title: string; lines: string[]; tone: 'idle' | 'ok' | 'warn' | 'bad' };
type LightLike = { intensity: number; color: Color; isLight?: boolean };

/** Everything that makes the shop feel alive: baked clip playback, dust motes, lamp flicker, day/night, CRT screens. */
export class AmbientSystem extends createSystem({ animated: { required: [Animated] } }) {
  private readonly recs = new Map<Entity, Rec>();
  private motes!: Points;
  private moteBase!: Float32Array;
  private monitor: CanvasScreen | null = null;
  private scope: CanvasScreen | null = null;
  private monitorMsg: MonitorMsg = { title: 'REBOOT LAB', lines: ['READY.', 'Accept a job to begin.'], tone: 'idle' };
  private scopeT = 0;
  private time = 0;
  private daylight = 1;
  private readonly lightBase = new Map<string, number>();

  init(): void {
    for (const e of this.queries.animated.entities) this.setup(e);
    this.cleanupFuncs.push(this.queries.animated.subscribe('qualify', (e) => this.setup(e)));
    this.cleanupFuncs.push(
      bus.on('anim', (p: { node: string; clip: string; loop?: boolean }) => (p.loop ? this.loopClip(p.node, p.clip) : this.playOnce(p.node, p.clip))),
      bus.on('daylight', (d: number) => { this.daylight = Math.max(0, Math.min(1, d)); this.applyDaylight(); }),
      bus.on('monitor', (m: MonitorMsg) => { this.monitorMsg = m; this.drawMonitor(); }),
    );
    // dust motes drifting in the window light
    const n = 160;
    this.moteBase = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { this.moteBase[i * 3] = -1.7 + Math.random() * 1.5; this.moteBase[i * 3 + 1] = 0.9 + Math.random() * 1.4; this.moteBase[i * 3 + 2] = -1.7 + Math.random() * 1.4; }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(this.moteBase), 3));
    this.motes = new Points(geo, new PointsMaterial({ size: 0.011, color: '#fff0c4', transparent: true, opacity: 0.5, depthWrite: false }));
    this.motes.frustumCulled = false;
    this.world.scene.add(this.motes);
    this.cleanupFuncs.push(() => { this.world.scene.remove(this.motes); geo.dispose(); });
    // screens
    this.monitor = CanvasScreen.attach(this.world.getSceneObject('bench-monitor') as Object3D | undefined, 'screen', 'z', 320, 224);
    this.scope = CanvasScreen.attach(this.world.getSceneObject('oscilloscope') as Object3D | undefined, 'screen', 'z', 256, 192);
    this.drawMonitor();
    this.applyDaylight();
  }

  private setup(e: Entity): void {
    if (this.recs.has(e) || !e.object3D) return;
    const asset = e.getValue(Animated, 'asset') ?? '';
    const gltf = AssetManager.getGLTF(asset);
    if (!gltf) { console.warn(`Animated: asset "${asset}" not loaded`); return; }
    const rec: Rec = { mixer: new AnimationMixer(e.object3D), clips: gltf.animations, actions: new Map() };
    this.recs.set(e, rec);
    if ((e.getValue(Animated, 'mode') ?? 'loop') === 'loop') {
      const speed = e.getValue(Animated, 'speed') ?? 1;
      for (const name of (e.getValue(Animated, 'clip') ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
        const a = this.action(rec, name);
        if (!a) continue;
        a.setLoop(LoopRepeat, Infinity); a.timeScale = speed; a.time = Math.random() * a.getClip().duration; a.play();
      }
    }
  }
  private action(rec: Rec, name: string): AnimationAction | undefined {
    let a = rec.actions.get(name);
    if (!a) { const clip = AnimationClip.findByName(rec.clips, name); if (!clip) return undefined; a = rec.mixer.clipAction(clip); rec.actions.set(name, a); }
    return a;
  }
  private rec(node: string): Rec | undefined {
    const e = this.world.getSceneEntity(node);
    if (!e) return undefined;
    if (!this.recs.has(e)) this.setup(e);
    return this.recs.get(e);
  }
  playOnce(node: string, clip: string): void {
    const rec = this.rec(node); const a = rec && this.action(rec, clip);
    if (!a) return;
    a.reset(); a.setLoop(LoopOnce, 1); a.clampWhenFinished = true; a.play();
  }
  /** Cross-fade to a looping clip (customer idle <-> talk). */
  loopClip(node: string, clip: string): void {
    const rec = this.rec(node); const a = rec && this.action(rec, clip);
    if (!rec || !a || rec.loopNow === a) return;
    a.reset(); a.setLoop(LoopRepeat, Infinity); a.enabled = true;
    if (rec.loopNow) a.crossFadeFrom(rec.loopNow, 0.35, false); a.play();
    rec.loopNow = a;
  }

  private applyDaylight(): void {
    const d = this.daylight;
    const set = (id: string, base: number, fn: (l: LightLike) => void): void => {
      const l = this.world.getSceneObject(id) as unknown as LightLike | undefined;
      if (!l || typeof l.intensity !== 'number') return;
      if (!this.lightBase.has(id)) this.lightBase.set(id, l.intensity);
      l.intensity = (this.lightBase.get(id) ?? base) * 1;
      fn(l);
    };
    set('sun', 3, (l) => { l.intensity = (this.lightBase.get('sun') ?? 3) * (0.05 + 0.95 * d); l.color.setRGB(1, 0.78 + 0.18 * d, 0.55 + 0.35 * d); });
    set('hemi', 1, (l) => { l.intensity = (this.lightBase.get('hemi') ?? 1) * (0.35 + 0.65 * d); });
    set('bench-light', 3, (l) => { l.intensity = (this.lightBase.get('bench-light') ?? 3) * (1.35 - 0.35 * d); });
    const win = this.world.getSceneObject('window') as Object3D | undefined;
    win?.traverse((o) => {
      if (o.name === 'sky' || o.parent?.name === 'sky') {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (m?.color) { const c = d > 0.5 ? new Color(0.75, 0.88, 1).lerp(new Color(1.0, 0.72, 0.5), (1 - d) * 2) : new Color(1.0, 0.72, 0.5).lerp(new Color(0.06, 0.08, 0.2), 1 - d * 2); m.color.copy(c); m.emissive?.copy(c).multiplyScalar(0.8); }
      }
      if (o.name.startsWith('shaft')) o.visible = d > 0.3;
    });
  }

  private drawMonitor(): void {
    const m = this.monitorMsg;
    const tone = { idle: '#7fe3c2', ok: '#5dff9a', warn: '#ffc857', bad: '#ff6b6b' }[m.tone];
    this.monitor?.draw((g, w, h) => {
      g.fillStyle = '#07140f'; g.fillRect(0, 0, w, h);
      g.strokeStyle = tone; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = tone; g.font = '700 26px monospace'; g.fillText(m.title, 20, 44);
      g.font = '600 20px monospace'; m.lines.slice(0, 6).forEach((t, i) => g.fillText(t.slice(0, 30), 20, 86 + i * 30));
      g.globalAlpha = 0.08; g.fillStyle = '#fff'; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1); g.globalAlpha = 1;
    });
  }

  update(delta: number, time: number): void {
    const dt = Math.min(delta, 0.05);
    this.time = time;
    for (const r of this.recs.values()) r.mixer.update(dt);
    // dust motes
    const pos = this.motes.geometry.getAttribute('position') as BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = this.moteBase[i] + Math.sin(time * 0.15 + i) * 0.08;
      arr[i + 1] = this.moteBase[i + 1] + Math.sin(time * 0.1 + i * 1.3) * 0.06 - ((time * 0.01) % 1) * 0.0;
      arr[i + 2] = this.moteBase[i + 2] + Math.cos(time * 0.12 + i * 0.7) * 0.08;
    }
    pos.needsUpdate = true;
    (this.motes.material as PointsMaterial).opacity = 0.15 + 0.4 * this.daylight;
    // lamp flicker
    const lamp = this.world.getSceneObject('lamp-light') as unknown as LightLike | undefined;
    if (lamp && typeof lamp.intensity === 'number') {
      if (!this.lightBase.has('lamp-light')) this.lightBase.set('lamp-light', lamp.intensity);
      lamp.intensity = (this.lightBase.get('lamp-light') ?? 1.6) * (1 + 0.04 * Math.sin(time * 31) * Math.sin(time * 7.3));
    }
    // oscilloscope trace
    this.scopeT += dt;
    if (this.scope && this.scopeT > 0.08) {
      this.scopeT = 0;
      this.scope.draw((g, w, h) => {
        g.fillStyle = '#031a0c'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#0c4a22'; g.lineWidth = 1;
        for (let x = 0; x <= w; x += w / 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y <= h; y += h / 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
        g.strokeStyle = '#5dff9a'; g.lineWidth = 2.5; g.beginPath();
        for (let x = 0; x < w; x += 3) { const t = x / w * 12 + this.time * 3; const y = h / 2 + Math.sin(t) * h * 0.26 + Math.sin(t * 2.7) * h * 0.08 + (Math.random() - 0.5) * 5; x === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
        g.stroke();
      });
    }
  }
}
export { MeshBasicMaterial };
