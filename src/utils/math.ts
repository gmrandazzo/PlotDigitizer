/**
 * Performs linear interpolation between two points.
 * 
 * @param p The current pixel coordinate
 * @param p1 The pixel coordinate of the first calibration point
 * @param p2 The pixel coordinate of the second calibration point
 * @param v1 The data value at p1
 * @param v2 The data value at p2
 * @returns The interpolated data value at p
 */
export const interpolate = (p: number, p1: number, p2: number, v1: number, v2: number): number => {
  const pixelDelta = p2 - p1;
  if (Math.abs(pixelDelta) < 0.000001) return v1;
  return v1 + (p - p1) * (v2 - v1) / pixelDelta;
};
