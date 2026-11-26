import { createSystem, Entity, Quaternion, UIKitMLAsset, Vector3 } from '@iwsdk/core';
import { bus } from '../game/bus.js';
import { CUSTOMERS, ORDERS_PER_DAY, PRICES, START_MONEY, UPGRADES, XP_PER_LEVEL, levelFromXp, makeOrder, payFor, starsFor, type Order } from '../data/repair-data.js';
import { PanelRef } from '../lib/panel-ref.js';
import { chime, setSound, sfx } from '../lib/audio.js';

type Save = { money: number; day: number; xp: number; rSum: number; rCount: number; stock: { port: number; battery: number }; upgrades: string[]; counter: number; crateDay: number };
const KEY = 'rebootlab-save-v1';
type Phase = 'waiting' | 'offered' | 'repair' | 'result' | 'day-end';

/** Customers, orders, money, shop tablet, HUD, repair log and the end-of-day receipt. */
export class ShopSystem extends createSystem({}) {
  private hud = new PanelRef(undefined); private orderP = new PanelRef(undefined); private logP = new PanelRef(undefined);
  private tab = new PanelRef(undefined); private rc = new PanelRef(undefined);
  private s: Save = { money: START_MONEY, day: 1, xp: 0, rSum: 0, rCount: 0, stock: { port: 1, battery: 1 }, upgrades: [], counter: 0, crateDay: 0 };
  private phase: Phase = 'waiting';
  private order: Order | null = null;
  private ordersToday = 0; private dayEarned = 0; private dayStars = 0; private pendingMystery = false;
  private timer = 1.5; private startT = 0; private now = 0; private logs: string[] = []; private page = 'parts'; private booted = false;
  private readonly wristPosition = new Vector3(); private readonly wristOffset = new Vector3(-0.035, 0.075, 0.055);
  private readonly worldOffset = new Vector3(); private readonly wristRotation = new Quaternion(); private readonly parentRotation = new Quaternion();

  init(): void {
    const p = (id: string): PanelRef => new PanelRef(this.world.getSceneObject<UIKitMLAsset>(id));
    this.hud = p('hud'); this.orderP = p('order-panel'); this.logP = this.orderP; this.tab = p('tablet-panel'); this.rc = this.tab;
    this.load();
    const c = this.cleanupFuncs;
    this.tab.onClick('tab-parts', () => this.setPage('parts'), c); this.tab.onClick('tab-up', () => this.setPage('up'), c); this.tab.onClick('tab-book', () => this.setPage('book'), c);
    this.tab.onClick('buy-port', () => this.buyPart('port'), c); this.tab.onClick('buy-battery', () => this.buyPart('battery'), c);
    UPGRADES.forEach((u, i) => this.tab.onClick(`up-${i + 1}`, () => this.buyUpgrade(u.id), c));
    this.tab.onClick('crate-btn', () => this.crate(), c); this.rc.onClick('rc-open', () => this.nextDay(), c);
    c.push(
      bus.on('press', (a: string) => { if (a === 'accept') this.accept(); else if (a === 'day') this.nextDay(); }),
      bus.on('phone-returned', (r: { seconds: number; target: number; usedMeter: boolean; extraSwaps: number; mistakes: number; order: Order }) => this.pay(r)),
      bus.on('spare-used', (k: 'port' | 'battery') => { this.s.stock[k] = Math.max(0, this.s.stock[k] - 1); this.save(); bus.emit('stock', { ...this.s.stock }); this.refreshTablet(); }),
      bus.on('log', (t: string) => { this.logs.push(t); if (this.logs.length > 40) this.logs.shift(); this.refreshLog(); }),
      bus.on('hint', (t: string) => this.hud.text('hud-hint', t)),
    );
    this.rc.show('receipt-screen', false); this.rc.show('shop-screen', true); this.setPage('parts');
    for (const id of ['a', 'b', 'c']) this.showCustomer(id, false);
    this.refreshAll();
  }

  private load(): void { try { const r = window.localStorage.getItem(KEY); if (r) this.s = { ...this.s, ...(JSON.parse(r) as Partial<Save>) }; } catch { /* empty */ } }
  private save(): void { try { window.localStorage.setItem(KEY, JSON.stringify(this.s)); } catch { /* ignore */ } }

  private showCustomer(id: string, on: boolean): void { const e: Entity | undefined = this.world.getSceneEntity(`customer-${id}`); if (e?.object3D) e.object3D.visible = on; }
  private say(text: string, status = ''): void { this.orderP.text('ord-line', text); if (status) this.orderP.text('ord-status', status); }

  private nextOrder(): void {
    const mystery = this.pendingMystery; this.pendingMystery = false;
    this.order = makeOrder(this.s.counter++, mystery); this.save();
    for (const c of CUSTOMERS) this.showCustomer(c.id, c.id === this.order.customer.id);
    const cid = `customer-${this.order.customer.id}`;
    bus.emit('anim', { node: 'shop-door', clip: 'open' }); bus.emit('anim', { node: 'counter', clip: 'ring' }); sfx.bell();
    bus.emit('anim', { node: cid, clip: 'talk', loop: true });
    this.orderP.show('order-card', true); this.logP.show('repair-log', false);
    this.orderP.text('ord-name', this.order.customer.name + (this.order.mystery ? '  (MYSTERY CRATE)' : ''));
    this.orderP.text('ord-chip', this.order.mystery ? 'Two hidden faults' : `"${this.order.faults.map((f) => ({ port: "Won't charge", battery: 'Dies at 40%', dust: 'Overheats' })[f]).join(' + ')}"`);
    this.say(this.order.line, 'Press the GREEN button on the bench to accept.'); this.orderP.text('ord-fee', `Offer: $${this.order.fee}`);
    this.phase = 'offered'; bus.emit('monitor', { title: 'NEW CUSTOMER', lines: [this.order.customer.name, 'is waiting.', 'Press the green button.'], tone: 'idle' });
    bus.emit('hint', 'A customer arrived. Press the green ACCEPT button.');
  }

  private accept(): void {
    if (this.phase !== 'offered' || !this.order) { if (this.phase === 'waiting' || this.phase === 'result') bus.emit('hint', 'Next customer is on the way...'); return; }
    this.phase = 'repair'; this.startT = this.now; this.logs = [];
    bus.emit('anim', { node: 'btn-accept', clip: 'press' }); bus.emit('anim', { node: `customer-${this.order.customer.id}`, clip: 'idle', loop: true });
    this.orderP.show('order-card', false); this.logP.show('repair-log', true);
    bus.emit('start-order', this.order); this.say('Thanks! I will wait right here.', 'Job in progress'); sfx.click();
    this.refreshLog();
  }

  private pay(r: { seconds: number; target: number; usedMeter: boolean; extraSwaps: number; mistakes: number; order: Order }): void {
    const o = this.order; if (!o) return;
    const stars = starsFor(r), pay = payFor(o.fee, stars);
    this.s.money += pay; this.s.xp += 20 + stars * 5 + (o.mystery ? 25 : 0); this.s.rSum += stars; this.s.rCount++;
    this.ordersToday++; this.dayEarned += pay; this.dayStars += stars; this.save();
    chime(); sfx.coin(); this.say(o.customer.thanks, `Paid $${pay}   |   ${stars} / 5 stars`);
    bus.emit('anim', { node: `customer-${o.customer.id}`, clip: 'talk', loop: true });
    this.phase = 'result'; this.timer = 4; this.orderP.show('order-card', true); this.logP.show('repair-log', false); bus.emit('daylight', 1 - 0.75 * (this.ordersToday / ORDERS_PER_DAY));
    bus.emit('log', `Paid $${pay} (${stars} stars)`); this.refreshAll();
    if (this.ordersToday >= ORDERS_PER_DAY) this.timer = 4.5;
  }

  private endDay(): void {
    this.phase = 'day-end'; this.rc.show('shop-screen', false); this.rc.show('receipt-screen', true); this.orderP.show('order-card', false); this.logP.show('repair-log', false);
    for (const c of CUSTOMERS) this.showCustomer(c.id, false);
    bus.emit('anim', { node: 'printer', clip: 'print' }); bus.emit('daylight', 0.1); sfx.coin();
    const avg = (this.dayStars / Math.max(1, this.ordersToday)).toFixed(1);
    const medal = Number(avg) >= 4.5 ? 'GOLD' : Number(avg) >= 3.5 ? 'SILVER' : 'BRONZE';
    this.rc.text('rc-title', `DAY ${this.s.day} COMPLETE`); this.rc.text('rc-1', `Repairs: ${this.ordersToday}`); this.rc.text('rc-2', `Earned: $${this.dayEarned}`);
    this.rc.text('rc-3', `Average rating: ${avg}`); this.rc.text('rc-4', `Medal: ${medal}   |   Cash: $${this.s.money}`);
    bus.emit('monitor', { title: `DAY ${this.s.day} DONE`, lines: [`Earned $${this.dayEarned}`, `Medal: ${medal}`, 'Press ORANGE button', 'for the next day.'], tone: 'ok' });
    bus.emit('hint', 'Day finished! Press the orange button (or OPEN NEXT DAY).');
  }

  private nextDay(): void {
    if (this.phase !== 'day-end') return;
    this.s.day++; this.ordersToday = 0; this.dayEarned = 0; this.dayStars = 0; this.rc.show('receipt-screen', false); this.rc.show('shop-screen', true); this.orderP.show('order-card', true); this.save();
    bus.emit('anim', { node: 'btn-day', clip: 'press' }); bus.emit('daylight', 1); this.phase = 'waiting'; this.timer = 2; sfx.click(); this.refreshAll();
  }

  private crate(): void {
    if (this.s.crateDay === this.s.day) { bus.emit('hint', 'The Daily Mystery Crate is done today. Come back tomorrow!'); return; }
    if (this.phase === 'repair' || this.phase === 'offered') { bus.emit('hint', 'Finish the current job first.'); return; }
    this.s.crateDay = this.s.day; this.pendingMystery = true; this.save(); this.phase = 'waiting'; this.timer = 0.5; sfx.click(); this.refreshTablet(); bus.emit('hint', 'Mystery crate incoming!');
  }

  private buyPart(k: 'port' | 'battery'): void {
    if (this.s.money < PRICES[k]) { bus.emit('hint', 'Not enough money.'); sfx.bad(); return; }
    this.s.money -= PRICES[k]; this.s.stock[k]++; this.save(); sfx.coin(); bus.emit('stock', { ...this.s.stock }); this.refreshAll();
  }
  private buyUpgrade(id: string): void {
    const u = UPGRADES.find((x) => x.id === id); if (!u) return;
    if (this.s.upgrades.includes(id)) { bus.emit('hint', `${u.name} is already installed.`); return; }
    if (this.s.money < u.cost) { bus.emit('hint', 'Not enough money.'); sfx.bad(); return; }
    this.s.money -= u.cost; this.s.upgrades.push(id); this.save(); sfx.coin(); bus.emit('upgrades', [...this.s.upgrades]); this.refreshAll();
  }

  private setPage(p: string): void {
    this.page = p; for (const k of ['parts', 'up', 'book']) this.tab.show(`page-${k}`, k === p);
    for (const k of ['parts', 'up', 'book']) this.tab.bg(`tab-${k}`, k === p ? '#ff8a3d' : '#efe0c0');
  }

  private refreshAll(): void { this.refreshHud(); this.refreshTablet(); this.refreshLog(); }
  private refreshHud(): void {
    this.hud.text('hud-day', `DAY ${this.s.day}`); this.hud.text('hud-money', `$${this.s.money}`);
    this.hud.text('hud-rating', this.s.rCount ? `RATING ${(this.s.rSum / this.s.rCount).toFixed(1)}` : 'RATING --');
    this.hud.text('hud-level', `LV ${levelFromXp(this.s.xp)}`); this.hud.width('hud-xp', ((this.s.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 52.8);
  }
  private refreshTablet(): void {
    this.tab.text('tab-money', `$${this.s.money}`);
    this.tab.text('buy-port', `Port module  $${PRICES.port}   (stock ${this.s.stock.port})`); this.tab.text('buy-battery', `Battery  $${PRICES.battery}   (stock ${this.s.stock.battery})`);
    UPGRADES.forEach((u, i) => this.tab.text(`up-${i + 1}`, this.s.upgrades.includes(u.id) ? `${u.name}: OWNED` : `${u.name}  $${u.cost}  -  ${u.desc}`));
    this.tab.text('crate-btn', this.s.crateDay === this.s.day ? 'MYSTERY CRATE: DONE TODAY' : 'DAILY MYSTERY CRATE  (2 faults)');
  }
  private refreshLog(): void {
    const last = this.logs.slice(-9);
    for (let i = 0; i < 9; i++) this.logP.text(`log-${i + 1}`, last[i] ? `- ${last[i]}` : '');
  }

  update(delta: number, time: number): void {
    this.now = time;
    if (this.world.xrEnabled) this.followWristHud();
    if (!this.booted) { this.booted = true; bus.emit('stock', { ...this.s.stock }); bus.emit('upgrades', [...this.s.upgrades]); bus.emit('daylight', 1); setSound(true); this.refreshAll(); }
    if (this.phase === 'repair') { const t = Math.floor(time - this.startT); this.logP.text('log-timer', `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`); }
    if (this.phase === 'waiting' || this.phase === 'result') {
      this.timer -= delta;
      if (this.timer <= 0) { if (this.ordersToday >= ORDERS_PER_DAY) this.endDay(); else this.nextOrder(); }
    }
  }

  private followWristHud(): void {
    const grip = this.world.playerSpaceEntities.gripSpaces.left.object3D, panel = this.hud.root, parent = panel?.parent;
    if (!grip || !panel || !parent) return;
    grip.updateWorldMatrix(true, false); grip.getWorldPosition(this.wristPosition); grip.getWorldQuaternion(this.wristRotation);
    this.worldOffset.copy(this.wristOffset).applyQuaternion(this.wristRotation); this.wristPosition.add(this.worldOffset);
    parent.updateWorldMatrix(true, false); panel.position.copy(parent.worldToLocal(this.wristPosition));
    parent.getWorldQuaternion(this.parentRotation); panel.quaternion.copy(this.parentRotation.invert().multiply(this.wristRotation));
  }
}
