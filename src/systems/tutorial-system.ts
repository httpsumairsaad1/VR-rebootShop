import {
  createSystem, Entity, Grabbed, Hovered, UIKitMLAsset, UIKit,
} from '@iwsdk/core';
import { GuidedTarget, RepairItem, TutorialState, UiBindingState } from '../components.js';
import { Highlighter } from '../lib/highlighter.js';
import { bus } from '../game/bus.js';
import type { FaultId } from '../data/repair-data.js';

type Step = {
  id: string;
  title: string;
  detail: string;
  targetKind?: string;
  targetId?: string;
  condition: (sys: TutorialSystem) => boolean;
  onComplete: (sys: TutorialSystem) => void;
};

const STEPS: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome to Reboot Lab',
    detail: 'A customer is waiting. Press the GREEN button on the bench to accept the job.',
    targetId: 'btn-accept',
    condition: (sys) => sys['shopAccepted'],
    onComplete: (sys) => { sys['shopAccepted'] = true; bus.emit('hint', 'Great! The phone is coming down the chute.'); },
  },
  {
    id: 'loosen-screws',
    title: 'Step 1: Loosen the 4 Screws',
    detail: 'Pick up the SCREWDRIVER (orange handle). Twist each screw or hold the trigger to unscrew all 4 corners.',
    targetId: 'driver',
    targetKind: 'tool',
    condition: (sys) => sys['screwsRemoved'] >= 4,
    onComplete: (sys) => { bus.emit('hint', 'All screws removed! Now pry the cover open.'); },
  },
  {
    id: 'pry-cover',
    title: 'Step 2: Pry Open the Back Cover',
    detail: 'Pick up the SPUDGER (flat metal tool). Insert it at the edge of the cover and pry gently until the clips pop.',
    targetId: 'spudger',
    targetKind: 'tool',
    condition: (sys) => sys['coverPopped'],
    onComplete: (sys) => { sys['coverPopped'] = true; bus.emit('hint', 'Cover popped! Lift it off to see the inside.'); },
  },
  {
    id: 'lift-cover',
    title: 'Step 3: Lift Off the Back Cover',
    detail: 'Grab the BACK COVER with your hand and lift it straight up. Place it on the mat.',
    targetId: 'phone-back',
    targetKind: 'cover',
    condition: (sys) => sys['coverLifted'],
    onComplete: (sys) => { sys['coverLifted'] = true; bus.emit('hint', 'Good! Now use the MULTIMETER to find the fault.'); },
  },
  {
    id: 'diagnose',
    title: 'Step 4: Diagnose with the Multimeter',
    detail: 'Pick up the MULTIMETER and PROBE (red tip). Touch the probe to the BATTERY PAD and PORT PAD on the circuit board. A bad part shows a fault reading.',
    targetId: 'probe',
    targetKind: 'tool',
    condition: (sys) => sys['usedMeter'],
    onComplete: (sys) => { bus.emit('hint', 'Fault found! Now disconnect the battery plug.'); },
  },
  {
    id: 'unplug-battery',
    title: 'Step 5: Disconnect the Battery',
    detail: 'Pull the BATTERY PLUG (white connector) straight out from the board. This cuts power before swapping parts.',
    targetId: 'plug',
    condition: (sys) => sys['batteryUnplugged'],
    onComplete: (sys) => { sys['batteryUnplugged'] = true; bus.emit('hint', 'Battery disconnected. Swap the faulty part now.'); },
  },
  {
    id: 'swap-part',
    title: 'Step 6: Swap the Faulty Part',
    detail: 'Remove the bad BATTERY or CHARGE PORT. Pick up the SPARE (green tray) and press it into the empty slot until it clicks.',
    targetKind: 'spare',
    condition: (sys) => sys['partSwapped'],
    onComplete: (sys) => { sys['partSwapped'] = true; bus.emit('hint', 'Part swapped! Reconnect the battery plug.'); },
  },
  {
    id: 'replug-battery',
    title: 'Step 7: Reconnect the Battery',
    detail: 'Push the BATTERY PLUG back into its socket on the board. You should hear a click.',
    targetId: 'plug',
    condition: (sys) => sys['batteryReplugged'],
    onComplete: (sys) => { sys['batteryReplugged'] = true; bus.emit('hint', 'Power restored. Put the cover back on.'); },
  },
  {
    id: 'replace-cover',
    title: 'Step 8: Replace the Back Cover',
    detail: 'Pick up the BACK COVER and lower it onto the phone. Press the edges until the clips snap shut.',
    targetId: 'phone-back',
    targetKind: 'cover',
    condition: (sys) => sys['coverReplaced'],
    onComplete: (sys) => { sys['coverReplaced'] = true; bus.emit('hint', 'Cover on! Now seat and tighten all 4 screws.'); },
  },
  {
    id: 'tighten-screws',
    title: 'Step 9: Tighten the 4 Screws',
    detail: 'Use the SCREWDRIVER on each screw. Twist or hold the trigger until all 4 are snug (green check).',
    targetId: 'driver',
    targetKind: 'tool',
    condition: (sys) => sys['screwsTightened'] >= 4,
    onComplete: (sys) => { bus.emit('hint', 'All screws tight! Press the POWER button on the test rig.'); },
  },
  {
    id: 'power-test',
    title: 'Step 10: Run the Power Test',
    detail: 'Press the POWER BUTTON on the test rig (grey box with lights). All 3 LEDs should turn GREEN.',
    targetId: 'rig',
    condition: (sys) => sys['powerTestPassed'],
    onComplete: (sys) => { sys['powerTestPassed'] = true; bus.emit('hint', 'Test PASSED! Put the phone in the OUT tray (right side).'); },
  },
  {
    id: 'return-phone',
    title: 'Step 11: Return the Phone',
    detail: 'Place the repaired phone in the OUT TRAY on the right side of the bench. The customer will take it.',
    targetId: 'out-tray',
    condition: (sys) => sys['phoneReturned'],
    onComplete: (sys) => { sys['phoneReturned'] = true; bus.emit('hint', 'Job complete! Press the ORANGE button for the next day.'); },
  },
];

export class TutorialSystem extends createSystem({
  tutorial: { required: [TutorialState] },
  guided: { required: [GuidedTarget] },
  items: { required: [RepairItem] },
}) {
  private stateEntity?: Entity;
  private guidePanel?: UIKitMLAsset;
  private currentStep = 0;
  private shopAccepted = false;
  private screwsRemoved = 0;
  private coverPopped = false;
  private coverLifted = false;
  private usedMeter = false;
  private batteryUnplugged = false;
  private partSwapped = false;
  private batteryReplugged = false;
  private coverReplaced = false;
  private screwsTightened = 0;
  private powerTestPassed = false;
  private phoneReturned = false;

  init(): void {
    this.queries.tutorial.subscribe('qualify', (e) => this.bindState(e));
    for (const e of this.queries.tutorial.entities) this.bindState(e);

    // Get guide panel
    try {
      this.guidePanel = this.world.getSceneObject<UIKitMLAsset>('guide-panel');
    } catch { /* panel not found */ }

    this.cleanupFuncs.push(
      bus.on('start-order', () => this.onJobStart()),
      bus.on('phone-returned', (r: any) => { if (r.passed) this.onPhoneReturned(); }),
      bus.on('log', (t: string) => this.onLog(t)),
    );

    // Listen for guide button clicks
    if (this.guidePanel) {
      const handler = (event: { target: { id: number } }) => this.onGuideClick(event);
      this.guidePanel.addEventListener('click', handler);
      this.cleanupFuncs.push(() => this.guidePanel?.removeEventListener('click', handler));
    }
  }

  private onGuideClick(event: { target: { id: number } }): void {
    const id = String(event.target.id);
    if (id === 'guide-next') this.advanceStep();
    else if (id === 'guide-prev' && this.currentStep > 0) { this.currentStep--; this.updateGuideUI(); }
    else if (id === 'guide-skip') this.skipTutorial();
  }

  private bindState(entity: Entity): void {
    if (this.stateEntity === entity) return;
    this.stateEntity = entity;
    this.currentStep = entity.getValue(TutorialState, 'step') ?? 0;
    this.updateGuidedTarget();
    this.updateGuideUI();
  }

  private onJobStart(): void {
    if (!this.stateEntity) return;
    if (!this.stateEntity.getValue(TutorialState, 'firstJobAccepted')) {
      this.stateEntity.setValue(TutorialState, 'firstJobAccepted', true);
      this.advanceStep();
    }
  }

  private onPhoneReturned(): void {
    if (!this.stateEntity) return;
    if (!this.stateEntity.getValue(TutorialState, 'firstPhoneReturned')) {
      this.stateEntity.setValue(TutorialState, 'firstPhoneReturned', true);
      this.advanceStep();
      // Tutorial complete - disable guide
      this.stateEntity.setValue(TutorialState, 'showGuide', false);
      this.clearGuidedTarget();
      this.updateGuideUI();
    }
  }

  private onLog(text: string): void {
    const t = text.toLowerCase();
    if (t.includes('removed screw')) this.screwsRemoved++;
    else if (t.includes('popped the cover')) this.coverPopped = true;
    else if (t.includes('lifted off the back cover')) this.coverLifted = true;
    else if (t.includes('touch a pad') || t.includes('probe') || t.includes('fault')) this.usedMeter = true;
    else if (t.includes('disconnected the battery')) this.batteryUnplugged = true;
    else if (t.includes('installed the') || t.includes('swapped')) this.partSwapped = true;
    else if (t.includes('reconnected the battery')) this.batteryReplugged = true;
    else if (t.includes('put the cover back')) this.coverReplaced = true;
    else if (t.includes('seated screw') || t.includes('tightened') || t.includes('all screws tight')) this.screwsTightened++;
    else if (t.includes('test passed') || t.includes('boot ok')) this.powerTestPassed = true;

    this.checkStepConditions();
  }

  private checkStepConditions(): void {
    if (this.currentStep >= STEPS.length) return;
    const step = STEPS[this.currentStep];
    if (step.condition(this)) {
      step.onComplete(this);
      this.advanceStep();
    }
    this.updateGuidedTarget();
  }

  private advanceStep(): void {
    this.currentStep++;
    if (this.stateEntity) {
      this.stateEntity.setValue(TutorialState, 'step', this.currentStep);
      this.stateEntity.setValue(TutorialState, 'completedSteps', this.currentStep);
    }
    this.updateGuideUI();
  }

  private skipTutorial(): void {
    this.currentStep = STEPS.length;
    if (this.stateEntity) {
      this.stateEntity.setValue(TutorialState, 'step', this.currentStep);
      this.stateEntity.setValue(TutorialState, 'completedSteps', this.currentStep);
      this.stateEntity.setValue(TutorialState, 'showGuide', false);
    }
    this.clearGuidedTarget();
    this.updateGuideUI();
  }

  private updateGuidedTarget(): void {
    // Clear all guided targets
    for (const e of this.queries.guided.entities) {
      e.setValue(GuidedTarget, 'active', false);
    }

    if (this.currentStep >= STEPS.length) return;
    const step = STEPS[this.currentStep];
    if (!step.targetId && !step.targetKind) return;

    // Find the target entity
    let targetEntity: Entity | undefined;
    for (const e of this.queries.items.entities) {
      const id = e.getValue(RepairItem, 'id') ?? '';
      const kind = e.getValue(RepairItem, 'kind') ?? '';
      if (step.targetId && id === step.targetId) { targetEntity = e; break; }
      if (step.targetKind && kind === step.targetKind) { targetEntity = e; break; }
    }

    if (targetEntity) {
      targetEntity.addComponent(GuidedTarget);
      targetEntity.setValue(GuidedTarget, 'active', true);
      targetEntity.setValue(GuidedTarget, 'stepIndex', this.currentStep);
    }
  }

  private clearGuidedTarget(): void {
    for (const e of this.queries.guided.entities) {
      e.setValue(GuidedTarget, 'active', false);
    }
  }

  private updateGuideUI(): void {
    if (!this.guidePanel || !this.stateEntity) return;

    const showGuide = this.stateEntity.getValue(TutorialState, 'showGuide') ?? true;
    if (this.currentStep >= STEPS.length || !showGuide) {
      this.guidePanel.visible = false;
      if (this.stateEntity) this.stateEntity.setValue(UiBindingState, 'guideVisible', false);
      return;
    }

    this.guidePanel.visible = true;
    if (this.stateEntity) this.stateEntity.setValue(UiBindingState, 'guideVisible', true);
    const step = STEPS[this.currentStep];
    const progressPct = ((this.currentStep) / STEPS.length) * 100;

    if (this.stateEntity) {
      this.stateEntity.setValue(UiBindingState, 'guideStepNum', String(this.currentStep + 1));
      this.stateEntity.setValue(UiBindingState, 'guideStepTitle', step.title);
      this.stateEntity.setValue(UiBindingState, 'guideStepDetail', step.detail);
      this.stateEntity.setValue(UiBindingState, 'guideTip', 'The next tool you need will glow GREEN. Grab it and follow the step.');
      this.stateEntity.setValue(UiBindingState, 'guideProgress', `${Math.round(progressPct)}%`);
    }
  }

  update(delta: number, time: number): void {
    // Re-check conditions each frame
    this.checkStepConditions();
  }
}