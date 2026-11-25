import {
  AnimatedControllerHand, AnimatedHand, CanvasTexture, Mesh, MeshStandardMaterial, RepeatWrapping,
  type VisualConstructor, type VisualImplementation, type XRInputManager, type Object3D,
} from '@iwsdk/core';

/** Build a small repeating woven fabric map shared by both IWSDK hand visuals. */
function makeFabricMap(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#858b83';
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = '#aeb2a8';
  ctx.lineWidth = 1;
  for (let i = -64; i < 128; i += 4) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 64, 64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i, 64); ctx.lineTo(i + 64, 0); ctx.stroke();
  }
  const map = new CanvasTexture(canvas);
  map.wrapS = map.wrapT = RepeatWrapping;
  map.repeat.set(2, 2);
  map.colorSpace = 'srgb';
  map.needsUpdate = true;
  return map;
}

const fabricMap = makeFabricMap();

/** Re-tint the stock tracked-hand mesh as a dark, woven ESD work glove. */
function dressGlove(model: Object3D): void {
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const gloved = materials.map((material) => {
      if (!(material instanceof MeshStandardMaterial)) return material;
      const next = material.clone();
      next.color.set('#9ba69d');
      next.map = fabricMap;
      next.roughness = 0.92;
      next.metalness = 0.02;
      next.emissive.set('#07110f');
      next.emissiveIntensity = 0.08;
      return next;
    });
    object.material = Array.isArray(object.material) ? gloved : gloved[0];
  });
}

class ESDGloveHand extends AnimatedHand {
  override init(): void { super.init(); dressGlove(this.model); }
}

class ESDGloveControllerHand extends AnimatedControllerHand {
  override init(): void { super.init(); dressGlove(this.model); }
}

/** Selects IWSDK's hand-skeleton visuals for both tracked hands and controllers. */
export function installGloveVisuals(input: XRInputManager): void {
  const handVisual = ESDGloveHand as unknown as VisualConstructor<VisualImplementation>;
  const controllerHandVisual = ESDGloveControllerHand as unknown as VisualConstructor<VisualImplementation>;
  input.visualAdapters.hand.left.updateVisualImplementation(handVisual);
  input.visualAdapters.hand.right.updateVisualImplementation(handVisual);
  input.visualAdapters.controller.left.updateVisualImplementation(controllerHandVisual);
  input.visualAdapters.controller.right.updateVisualImplementation(controllerHandVisual);
}
