/**
 * Shared material palette for the Reboot Shop VR workbench.
 *
 * Warm cozy repair-shop look per the design spec. All materials are
 * deterministic and side-effect free so the manifest can be evaluated in the
 * app runtime and the editor realms independently.
 */

import { createSceneMaterial, MeshStandardMaterial } from '@iwsdk/core';

// Furniture wood (warm walnut).
export const wood = createSceneMaterial({
  id: 'shop-wood',
  model: 'standard',
  baseColor: '#6B4A38',
  roughness: 0.55,
});

// Dark trim wood (aprons, legs, rack boards, counter).
export const woodDark = createSceneMaterial({
  id: 'shop-wood-dark',
  model: 'standard',
  baseColor: '#3B2A22',
  roughness: 0.7,
});

// Brushed metal (tools, rig, lamp arm, chute).
export const metal = createSceneMaterial({
  id: 'shop-metal',
  model: 'physical',
  baseColor: '#9AA0A8',
  roughness: 0.35,
  metalness: 0.7,
});

// ESD anti-static rubber mat.
export const mat = createSceneMaterial({
  id: 'shop-mat',
  model: 'standard',
  baseColor: '#2E3A45',
  roughness: 0.9,
});

// ESD mat border trim.
export const matBorder = createSceneMaterial({
  id: 'shop-mat-border',
  model: 'standard',
  baseColor: '#46586A',
  roughness: 0.85,
});

// Dark tech body (monitor bezel, power rig base, vise jaws).
export const techDark = createSceneMaterial({
  id: 'shop-tech-dark',
  model: 'standard',
  baseColor: '#1B2A30',
  roughness: 0.4,
});

// Cream lamp shade / light trim.
export const cream = createSceneMaterial({
  id: 'shop-cream',
  model: 'standard',
  baseColor: '#F7EBD4',
  roughness: 0.6,
});

// Copper accents (drawer knobs).
export const copper = createSceneMaterial({
  id: 'shop-copper',
  model: 'standard',
  baseColor: '#C98A4B',
  roughness: 0.5,
  metalness: 0.4,
});

// Green Power button body (success mint from the UI palette).
export const green = createSceneMaterial({
  id: 'shop-green',
  model: 'standard',
  baseColor: '#4CC38A',
  roughness: 0.4,
});

// CTA orange — the smoke-test grab puck.
export const orange = createSceneMaterial({
  id: 'shop-orange',
  model: 'standard',
  baseColor: '#FF8A3D',
  roughness: 0.5,
});

// Room shell.
export const floorMat = createSceneMaterial({
  id: 'shop-floor',
  model: 'standard',
  baseColor: '#3A2E28',
  roughness: 0.85,
});

export const wallMat = createSceneMaterial({
  id: 'shop-wall',
  model: 'standard',
  baseColor: '#4A3B31',
  roughness: 0.9,
});

// Always-on emissive glows (never mutated at runtime).
export const bulbGlow = new MeshStandardMaterial({
  color: 0xffb066,
  emissive: 0xffb066,
  emissiveIntensity: 2.5,
  roughness: 0.3,
});

export const windowGlow = new MeshStandardMaterial({
  color: 0xffd9a0,
  emissive: 0xffd9a0,
  emissiveIntensity: 1.8,
  roughness: 0.4,
});
