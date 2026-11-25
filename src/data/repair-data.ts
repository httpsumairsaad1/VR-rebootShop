export type FaultId = string;
export const FAULTS: Record<FaultId, { label: string; symptom: string; fee: number; tip: string }> = {
  port: { label: 'Charge port module', symptom: "Won't charge", fee: 60, tip: 'The port pad reads 0 V.' },
  battery: { label: 'Swollen battery', symptom: 'Dies at 40%', fee: 75, tip: 'The battery pad reads low.' },
  dust: { label: 'Dust build-up', symptom: 'Overheats', fee: 35, tip: 'Brush the board clean.' },
};
export const START_MONEY = 150;
export const PRICES = { port: 12, battery: 18 } as const;
export const ORDERS_PER_DAY = 3;
export const XP_PER_LEVEL = 100;
export const levelFromXp = (xp: number): number => Math.floor(xp / XP_PER_LEVEL) + 1;

export type CustomerId = 'a' | 'b' | 'c';
export const CUSTOMERS: Array<{ id: CustomerId; name: string; lines: Record<FaultId, string>; thanks: string; angry: string }> = [
  { id: 'a', name: 'Ayesha', thanks: 'Wonderful! You saved my photos!', angry: 'Hmm, it still is not working...',
    lines: { port: "My phone won't charge anymore. I plugged it in all night!", battery: 'It dies at forty percent. Please look at it?', dust: 'It gets so hot in my hand. Can you check inside?' } },
  { id: 'b', name: 'Hamza', thanks: 'Legend! Good as new!', angry: "Bro, it's still dead.",
    lines: { port: 'Cable just spins loose in the port. No charge at all.', battery: 'The back is bulging a bit... is that bad?', dust: 'My gaming phone throttles after five minutes.' } },
  { id: 'c', name: 'Mr. Khan', thanks: 'Excellent work, young one.', angry: 'This is not fixed, I think.',
    lines: { port: 'Phone is dead. Not charging since Monday.', battery: 'Battery drains very fast, even when off.', dust: 'Make it cool again, please. Burning hot.' } },
];

export type Order = { id: number; deviceId?: string; customer: (typeof CUSTOMERS)[number]; faults: FaultId[]; fee: number; line: string; mystery: boolean; targetSeconds: number };
const SEQ: FaultId[][] = [['port'], ['dust'], ['battery'], ['port', 'dust'], ['battery', 'dust'], ['port'], ['dust'], ['battery']];
export function makeOrder(counter: number, mystery: boolean): Order {
  const faults: FaultId[] = mystery ? (counter % 2 === 0 ? ['port', 'dust'] : ['battery', 'dust']) : SEQ[counter % SEQ.length];
  const customer = CUSTOMERS[counter % CUSTOMERS.length];
  const fee = Math.round(faults.reduce((s, f) => s + FAULTS[f].fee, 0) * (mystery ? 1.5 : 1));
  const line = mystery ? 'A mystery crate! Two problems inside. Good luck.' : customer.lines[faults[0]];
  return { id: counter, deviceId: 'phone', customer, faults, fee, line, mystery, targetSeconds: mystery ? 300 : 120 + 60 * faults.length };
}

export const UPGRADES = [
  { id: 'motor', name: 'Pro motor', desc: 'Driver spins 2x faster', cost: 90 },
  { id: 'magnifier', name: 'Magnifier', desc: 'Meter shows OK / FAULT', cost: 120 },
  { id: 'cleaning', name: 'Cleaning kit', desc: 'Brush cleans 2x faster', cost: 70 },
] as const;
export type UpgradeId = (typeof UPGRADES)[number]['id'];

export function starsFor(o: { seconds: number; target: number; usedMeter: boolean; extraSwaps: number; mistakes: number }): number {
  let s = 3;
  if (o.usedMeter) s += 1;
  if (o.seconds <= o.target) s += 1;
  s -= Math.min(2, o.extraSwaps);
  s -= Math.min(1, o.mistakes);
  return Math.max(1, Math.min(5, s));
}
export const payFor = (fee: number, stars: number): number => Math.round(fee * (0.7 + 0.1 * stars));
