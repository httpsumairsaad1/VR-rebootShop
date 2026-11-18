import {
  Quaternion,
  UIKit,
  UIKitMLAsset,
  Vector3,
  createSystem,
} from '@iwsdk/core';
import type { Entity } from '@iwsdk/core';
import { UiBindingState } from '../components.js';

type UiTextField =
  | 'day'
  | 'stars'
  | 'coins'
  | 'orderNumber'
  | 'customer'
  | 'device'
  | 'symptom'
  | 'reward'
  | 'customerLine'
  | 'monitorStatus'
  | 'bootTest'
  | 'voltage'
  | 'repairHeading'
  | 'repairStep1'
  | 'repairStep2'
  | 'repairStep3'
  | 'repairStep4'
  | 'hint'
  | 'contracts'
  | 'crate'
  | 'crateDetail'
  | 'shopPage'
  | 'receiptEarnings'
  | 'receiptStars'
  | 'medal'
  | 'nextDay'
  | 'decisionRush'
  | 'decisionPark'
  | 'decisionContinue';

type UiVisibilityField = 'speechVisible' | 'receiptVisible' | 'decisionVisible';

interface TextBinding {
  element: UIKit.Text;
  field: UiTextField;
  value: string;
}

interface VisibilityBinding {
  object: UIKitMLAsset;
  field: UiVisibilityField;
  value: boolean;
}

const TEXT_BINDINGS: ReadonlyArray<
  readonly [string, string, UiTextField]
> = [
  ['wrist-hud-panel', 'hud-day', 'day'],
  ['wrist-hud-panel', 'hud-stars', 'stars'],
  ['wrist-hud-panel', 'hud-coins', 'coins'],
  ['order-tag-panel', 'order-number', 'orderNumber'],
  ['order-tag-panel', 'order-customer', 'customer'],
  ['order-tag-panel', 'order-device', 'device'],
  ['order-tag-panel', 'order-symptom', 'symptom'],
  ['order-tag-panel', 'order-payout', 'reward'],
  ['speech-bubble-panel', 'speech-name', 'customer'],
  ['speech-bubble-panel', 'speech-line', 'customerLine'],
  ['speech-bubble-panel', 'speech-symptom', 'symptom'],
  ['speech-bubble-panel', 'speech-offer', 'reward'],
  ['bench-monitor-panel', 'monitor-status', 'monitorStatus'],
  ['bench-monitor-panel', 'monitor-boot-test', 'bootTest'],
  ['bench-monitor-panel', 'monitor-voltage', 'voltage'],
  ['repair-log-panel', 'repair-heading', 'repairHeading'],
  ['repair-log-panel', 'repair-step-1', 'repairStep1'],
  ['repair-log-panel', 'repair-step-2', 'repairStep2'],
  ['repair-log-panel', 'repair-step-3', 'repairStep3'],
  ['repair-log-panel', 'repair-step-4', 'repairStep4'],
  ['hint-pill-panel', 'hint-text', 'hint'],
  ['shop-tablet-panel', 'tablet-contracts', 'contracts'],
  ['shop-tablet-panel', 'tablet-crate', 'crate'],
  ['shop-tablet-panel', 'tablet-crate-detail', 'crateDetail'],
  ['shop-tablet-panel', 'tablet-page', 'shopPage'],
  ['day-receipt-panel', 'receipt-earnings', 'receiptEarnings'],
  ['day-receipt-panel', 'receipt-stars', 'receiptStars'],
  ['day-receipt-panel', 'receipt-medal', 'medal'],
  ['day-receipt-panel', 'receipt-open-next', 'nextDay'],
  ['decision-plate-panel', 'decision-rush', 'decisionRush'],
  ['decision-plate-panel', 'decision-park', 'decisionPark'],
  ['decision-plate-panel', 'decision-continue', 'decisionContinue'],
];

const VISIBILITY_BINDINGS: ReadonlyArray<
  readonly [string, UiVisibilityField]
> = [
  ['speech-bubble-panel', 'speechVisible'],
  ['day-receipt-panel', 'receiptVisible'],
  ['decision-plate-panel', 'decisionVisible'],
];

export class UiBindingSystem extends createSystem({
  state: { required: [UiBindingState] },
}) {
  private readonly textBindings: TextBinding[] = [];
  private readonly visibilityBindings: VisibilityBinding[] = [];
  private stateEntity?: Entity;
  private wristPanel?: UIKitMLAsset;
  private readonly wristPosition = new Vector3();
  private readonly wristOffset = new Vector3(-0.035, 0.075, 0.055);
  private readonly worldOffset = new Vector3();
  private readonly wristRotation = new Quaternion();
  private readonly parentRotation = new Quaternion();

  init(): void {
    this.queries.state.subscribe('qualify', (entity) => this.bindState(entity));
    for (const entity of this.queries.state.entities) {
      this.bindState(entity);
    }
  }

  update(): void {
    const state = this.stateEntity;
    if (state == null) return;

    for (const binding of this.textBindings) {
      const value = state.getValue(UiBindingState, binding.field);
      if (value == null) {
        throw new Error(`Missing UI binding value: ${binding.field}`);
      }
      if (value === binding.value) continue;
      binding.element.setProperties({ text: value });
      binding.value = value;
    }

    for (const binding of this.visibilityBindings) {
      const visible = state.getValue(UiBindingState, binding.field);
      if (visible == null) {
        throw new Error(`Missing UI visibility value: ${binding.field}`);
      }
      if (visible === binding.value) continue;
      binding.object.visible = visible;
      binding.value = visible;
    }

    if (this.world.xrEnabled && this.wristPanel != null) {
      this.followLeftGrip();
    }
  }

  private bindState(entity: Entity): void {
    if (this.stateEntity === entity) return;
    this.stateEntity = entity;

    for (const [nodeId, elementId, field] of TEXT_BINDINGS) {
      const panel = this.world.requireSceneObject<UIKitMLAsset>(nodeId);
      const element = panel.requireElementById<UIKit.Text>(elementId);
      this.textBindings.push({ element, field, value: '' });
    }

    for (const [nodeId, field] of VISIBILITY_BINDINGS) {
      const panel = this.world.requireSceneObject<UIKitMLAsset>(nodeId);
      this.visibilityBindings.push({
        object: panel,
        field,
        value: true,
      });
      panel.visible = false;
    }

    this.wristPanel = this.world.requireSceneObject<UIKitMLAsset>('wrist-hud-panel');
  }

  private followLeftGrip(): void {
    const grip = this.world.playerSpaceEntities.gripSpaces.left.object3D;
    const panel = this.wristPanel;
    const parent = panel?.parent;
    if (grip == null || panel == null || parent == null) return;

    grip.updateWorldMatrix(true, false);
    grip.getWorldPosition(this.wristPosition);
    grip.getWorldQuaternion(this.wristRotation);
    this.worldOffset.copy(this.wristOffset).applyQuaternion(this.wristRotation);
    this.wristPosition.add(this.worldOffset);

    parent.updateWorldMatrix(true, false);
    panel.position.copy(parent.worldToLocal(this.wristPosition));
    parent.getWorldQuaternion(this.parentRotation);
    panel.quaternion.copy(this.parentRotation.invert().multiply(this.wristRotation));
  }
}
