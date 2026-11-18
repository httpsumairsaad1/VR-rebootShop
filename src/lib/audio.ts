let ctx: AudioContext | null = null;
let enabled = true;
export const setSound = (on: boolean): void => { enabled = on; };
export function beep(freq: number, dur: number, vol = 0.03, type: OscillatorType = 'sine'): void {
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur);
  } catch { /* audio is optional */ }
}
export const sfx = {
  tick: () => beep(1100, 0.03, 0.02, 'square'), click: () => beep(760, 0.05), snap: () => { beep(520, 0.05, 0.04, 'triangle'); beep(880, 0.08, 0.03); },
  bad: () => beep(180, 0.16, 0.04, 'sawtooth'), pop: () => beep(320, 0.07, 0.05, 'triangle'), coin: () => { beep(1200, 0.07); setTimeout(() => beep(1600, 0.1), 70); },
  power: () => { beep(440, 0.1); setTimeout(() => beep(660, 0.1), 110); setTimeout(() => beep(880, 0.18), 220); }, bell: () => { beep(1500, 0.5, 0.025); beep(2250, 0.4, 0.015); },
};
export function chime(): void {
  if (!enabled) return;
  try { const a = new Audio(`${import.meta.env.BASE_URL}audio/chime.mp3`); a.volume = 0.6; void a.play(); } catch { /* optional */ }
}
/** Haptic pulse on a Gamepad-like object from the IWSDK input layer (safe no-op if unavailable). */
export function pulse(pad: unknown, strength: number, ms: number): void {
  try {
    const g = (pad as { gamepad?: unknown } | undefined)?.gamepad as { hapticActuators?: Array<{ pulse?: (s: number, d: number) => void }>; vibrationActuator?: { playEffect?: (t: string, o: object) => void } } | undefined;
    const act = g?.hapticActuators?.[0];
    if (act?.pulse) act.pulse(strength, ms);
    else g?.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: strength, weakMagnitude: strength });
  } catch { /* optional */ }
}
