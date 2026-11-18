import { Box3, CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, SRGBColorSpace, Vector3 } from '@iwsdk/core';

/** A live 2D-canvas screen. The GLB screen quad has no UVs, so we cover it with a UV'd plane of the same size. */
export class CanvasScreen {
  readonly canvas = document.createElement('canvas');
  private readonly g: CanvasRenderingContext2D;
  private readonly tex: CanvasTexture;
  constructor(public readonly plane: Mesh, readonly w: number, readonly h: number) {
    this.canvas.width = w; this.canvas.height = h;
    this.g = this.canvas.getContext('2d')!;
    this.tex = new CanvasTexture(this.canvas);
    this.tex.colorSpace = SRGBColorSpace;
    (plane.material as MeshBasicMaterial).map = this.tex;
    (plane.material as MeshBasicMaterial).needsUpdate = true;
  }
  draw(fn: (g: CanvasRenderingContext2D, w: number, h: number) => void): void { fn(this.g, this.w, this.h); this.tex.needsUpdate = true; }
  static attach(root: Object3D | undefined, nodeName: string, facing: 'z' | 'y', w = 256, h = 160): CanvasScreen | null {
    const node = root?.getObjectByName(nodeName);
    if (!node || !root) return null;
    root.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(node);
    const size = box.getSize(new Vector3()), centerW = box.getCenter(new Vector3());
    const parent = node.parent ?? root;
    const sx = root.scale.x || 1;
    const geo = facing === 'z' ? new PlaneGeometry(size.x / sx, size.y / sx) : new PlaneGeometry(size.x / sx, size.z / sx);
    const plane = new Mesh(geo, new MeshBasicMaterial({ color: '#ffffff', toneMapped: false, side: DoubleSide }));
    if (facing === 'y') plane.rotation.x = -Math.PI / 2;
    parent.add(plane);
    plane.position.copy(parent.worldToLocal(centerW.clone()));
    if (facing === 'y') plane.position.y += 0.0004; else plane.position.z += 0.0004;
    plane.raycast = () => {};
    node.visible = false;
    return new CanvasScreen(plane, w, h);
  }
}
