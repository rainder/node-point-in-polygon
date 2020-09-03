export type Tuple = [number, number];
export type BoundingBox = [Tuple, Tuple];
export type Vert = Array<Tuple>;
export type Point = {
  type: 'Point';
  coordinates: Tuple;
};
export type Polygon = {
  type: 'Polygon';
  coordinates: Array<Array<Tuple>>;
};
export type MultiPolygon = {
  type: 'MultiPolygon';
  coordinates: Array<Array<Array<Tuple>>>;
};
