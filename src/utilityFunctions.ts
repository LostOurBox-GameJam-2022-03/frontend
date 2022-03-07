export interface IPoint {
    x: number;
    y: number;
}

export interface ITrianglePoints {
    a: IPoint;
    b: IPoint;
    c: IPoint;
}

/**
 * Check that all points of the other triangle are on the same side of the triangle after mapping to barycentric coordinates.
 * 
 * @returns Whether all points are outside on the same side or not.
 */
const cross2 = (points: ITrianglePoints, triangle: ITrianglePoints) => {
  const pa = points.a;
  const pb = points.b;
  const pc = points.c;
  const p0 = triangle.a;
  const p1 = triangle.b;
  const p2 = triangle.c;
  const dXa = pa.x - p2.x;
  const dYa = pa.y - p2.y;
  const dXb = pb.x - p2.x;
  const dYb = pb.y - p2.y;
  const dXc = pc.x - p2.x;
  const dYc = pc.y - p2.y;
  const dX21 = p2.x - p1.x;
  const dY12 = p1.y - p2.y;
  const D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
  const sa = dY12 * dXa + dX21 * dYa;
  const sb = dY12 * dXb + dX21 * dYb;
  const sc = dY12 * dXc + dX21 * dYc;
  const ta = (p2.y - p0.y) * dXa + (p0.x - p2.x) * dYa;
  const tb = (p2.y - p0.y) * dXb + (p0.x - p2.x) * dYb;
  const tc = (p2.y - p0.y) * dXc + (p0.x - p2.x) * dYc;
  if (D < 0) return ((sa >= 0 && sb >= 0 && sc >= 0) ||
        (ta >= 0 && tb >= 0 && tc >= 0) ||
        (sa + ta <= D && sb + tb <= D && sc + tc <= D));
  return ((sa <= 0 && sb <= 0 && sc <= 0) ||
        (ta <= 0 && tb <= 0 && tc <= 0) ||
        (sa + ta >= D && sb + tb >= D && sc + tc >= D));
};

export const trianglesIntersect = (t0: ITrianglePoints, t1: ITrianglePoints) => {
  return !(cross2(t0, t1) ||
        cross2(t1, t0));
};

/**
 * Given a local point, the center point, and the local rotation, returns the absolute point coordinates.
 * 
 * @returns true point coordinates
 */
export const calculateRealPointBasedOnRelativePointAndRotation = (
  localPoint: IPoint,
  centerPoint: IPoint,
  rotation: number
): IPoint => {
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  const xDistanceFromCenter = localPoint.x - centerPoint.x;
  const yDistanceFromCenter = localPoint.y - centerPoint.y;

  const xPointAfterRotation = (xDistanceFromCenter * cosRot) - (yDistanceFromCenter * sinRot);
  const yPointAfterRotation = (xDistanceFromCenter * sinRot) + (yDistanceFromCenter * cosRot);

  const returnPoint = {
    x: centerPoint.x + xPointAfterRotation,
    y: centerPoint.y + yPointAfterRotation
  };

  return returnPoint;
};
