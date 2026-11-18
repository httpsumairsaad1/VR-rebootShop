/**
 * SeatCalibrationSystem — Palm-on-mat seat calibration.
 *
 * The player places their palm flat on the ESD mat; the system measures the
 * tracked hand position and offsets the XR rig Y-height so the player's
 * seated eye height matches their real posture.
 *
 * Per spec: player rig must stay strictly level (no pitch/roll). The mat is
 * tilted ~12° so a natural downward gaze views the PCB comfortably.
 */

import { createSystem, Matrix4, Vector3, signal } from '@iwsdk/core';
import { SeatCalibration } from './components.js';

export class SeatCalibrationSystem extends createSystem({
  calibration: { required: [SeatCalibration] },
  // We query the tracked hand state directly in update() via input.xr
}) {
  private tempVec = new Vector3();
  private tempMat = new Matrix4();
  private calibrated = false;

  init(): void {
    // The calibration is triggered by a UI button on the bench monitor.
    // We listen for the calibration entity to be created and ready.
    this.queries.calibration.subscribe('qualify', (entity) => {
      // The system is ready; wait for user to press Start Shift + palm-on-mat.
    });
  }

  update(): void {
    if (this.calibrated) return;

    const xr = this.input.xr;
    if (!this.world.xrEnabled) return;

    // Check for the calibration gesture with the supported hand-tracking API.
    const leftHand = xr.visualAdapters.hand.left;
    if (!leftHand.jointTransforms) return;

    let wristJointIndex = -1;
    for (let i = 0; i < leftHand.jointSpaces.length; i++) {
      if (leftHand.jointSpaces[i].jointName === 'wrist') {
        wristJointIndex = i;
        break;
      }
    }
    if (wristJointIndex < 0) return;

    xr.xrOrigin.gripSpaces.left.updateWorldMatrix(true, false);
    this.tempMat.fromArray(leftHand.jointTransforms, wristJointIndex * 16);
    this.tempMat.premultiply(xr.xrOrigin.gripSpaces.left.matrixWorld);
    this.tempVec.setFromMatrixPosition(this.tempMat);

    // Mat is at y ≈ 0.865, tilted 12° around X.
    // Check if palm is near the mat surface (within ~3cm).
    const matHeight = 0.865;
    const matTilt = Math.PI / 15; // 12° in radians
    const matNormalY = Math.cos(matTilt);
    const matNormalZ = -Math.sin(matTilt);
    const toPalmY = this.tempVec.y - matHeight;
    const toPalmZ = this.tempVec.z - (-0.85);
    const distToPlane = Math.abs(toPalmY * matNormalY + toPalmZ * matNormalZ);

    // Also check X/Z bounds of mat (0.6m x 0.45m).
    const dx = this.tempVec.x;
    const dz = this.tempVec.z - (-0.85);

    // Rotate dx/dz by -matTilt to check against unrotated mat bounds.
    const localZ = dz * Math.cos(matTilt) + (this.tempVec.y - matHeight) * Math.sin(matTilt);

    const inBounds = Math.abs(dx) < 0.28 && Math.abs(localZ) < 0.2;

    // The supported API exposes both a discrete pinch state and pinch strength.
    const pinching =
      xr.getSelectState('left').active || leftHand.getPinchStrength() >= 0.5;

    // Calibrate when palm is flat on mat and pinching.
    if (distToPlane < 0.03 && inBounds && pinching) {
      this.performCalibration(this.tempVec.y);
      this.calibrated = true;
    }
  }

  private performCalibration(palmY: number): void {
    // Mat surface at palm contact is ~0.865 + 0.015/2 = 0.8725.
    // Player's real seated eye height = palmY + offset (forearm + head).
    // Typical seated: eye height ≈ 1.15–1.25m. Palm on mat ≈ 0.87m.
    // Offset ≈ 0.3m. We'll measure the current rig height and adjust.

    const rig = this.player;
    const currentRigY = rig.position.y;

    // Desired rig Y so that eyes are at the right height.
    // The rig's head is at rig.position + head offset.
    const headOffset = new Vector3();
    this.player.head.updateWorldMatrix(true, false);
    headOffset.setFromMatrixPosition(this.player.head.matrixWorld);
    headOffset.sub(rig.position);

    const measuredEyeHeight = currentRigY + headOffset.y;
    const targetEyeHeight = palmY + 0.3; // approximate seated eye height from palm

    const deltaY = targetEyeHeight - measuredEyeHeight;
    const newRigY = currentRigY + deltaY;

    // Clamp to reasonable seated range.
    const clampedY = Math.max(1.1, Math.min(1.3, newRigY));

    rig.position.y = clampedY;

    // Mark calibration complete.
    for (const entity of this.queries.calibration.entities) {
      entity.setValue(SeatCalibration, 'calibrated', true);
      entity.setValue(SeatCalibration, 'matHeight', 0.865);
    }

    // Emit calibration event via global signal for UI feedback.
    const globals = this.globals as Record<string, unknown>;
    if (!globals.seatCalibratedSignal) {
      globals.seatCalibratedSignal = signal({ height: 0 });
    }
    (globals.seatCalibratedSignal as ReturnType<typeof signal>).value = { height: clampedY };
  }
}