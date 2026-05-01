import { describe, it, expect } from 'vitest';
import { interpolate } from './math';

describe('interpolate', () => {
  it('correctly maps values on a linear X-axis', () => {
    // pMin=100, pMax=500, vMin=0, vMax=10
    expect(interpolate(100, 100, 500, 0, 10)).toBe(0);
    expect(interpolate(500, 100, 500, 0, 10)).toBe(10);
    expect(interpolate(300, 100, 500, 0, 10)).toBe(5);
  });

  it('correctly maps values on an inverted Y-axis (screen coordinates)', () => {
    // pMin=500 (bottom), pMax=100 (top), vMin=0, vMax=100
    expect(interpolate(500, 500, 100, 0, 100)).toBe(0);
    expect(interpolate(100, 500, 100, 0, 100)).toBe(100);
    expect(interpolate(300, 500, 100, 0, 100)).toBe(50);
  });

  it('handles zero pixel delta by returning v1', () => {
    expect(interpolate(200, 100, 100, 0, 100)).toBe(0);
  });

  it('handles negative values correctly', () => {
    // pMin=100, pMax=200, vMin=-10, vMax=10
    expect(interpolate(150, 100, 200, -10, 10)).toBe(0);
  });
});
