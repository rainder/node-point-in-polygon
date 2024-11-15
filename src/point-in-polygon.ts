import assert = require('assert');
import { cloneObject } from './clone-object';
import { BoundingBox, MultiPolygon, Point, Polygon, Vert } from './types';

export * from './types';

export class PointInPolygon {
  public boundingBoxes: BoundingBox[];
  public verts: Vert[];

  /**
   *
   * @param geometry
   */
  constructor(geometry: Polygon | MultiPolygon) {
    assert(typeof geometry === 'object', 'argument must be an object');
    assert('type' in geometry, 'object must have type property');
    assert('coordinates' in geometry, 'object must have coordinates property');
    assert(['Polygon', 'MultiPolygon'].includes(geometry.type), 'type must be `Polygon` or `MuliPolygon`');

    const polygons: Polygon[] = PointInPolygon.toArrayOfPolygons(cloneObject(geometry));

    this.boundingBoxes = polygons.map(PointInPolygon.calculateBoundingBox);
    this.verts = polygons.map(PointInPolygon.calculateVert);
  }

  /**
   *
   * @param {Polygon | MultiPolygon} geometry
   * @returns {Polygon[]}
   * @private
   */
  private static toArrayOfPolygons(geometry: Polygon | MultiPolygon): Polygon[] {
    if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.map((coordinates) => ({
        type: 'Polygon',
        coordinates: coordinates,
      }));
    }

    return [geometry];
  }

  /**
   *
   * @returns {BoundingBox}
   * @private
   * @param polygon
   */
  private static calculateBoundingBox(polygon: Polygon): BoundingBox {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const coords of polygon.coordinates) {
      for (const coord of coords) {
        const [y, x] = coord;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);

        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }

    return [[minX, minY], [maxX, maxY]];
  }

  /**
   *
   * @returns {*[]}
   * @private
   * @param polygon
   */
  private static calculateVert(polygon: Polygon): Vert {
    return polygon.coordinates.reduce((result, array) => result.concat(
      array,
      [array[0], [0, 0]],
    ), [[0,0]])
  }

  /**
   *
   * @param point
   * @returns {boolean}
   */
  isPointInside(point: Point) {
    assert(typeof point === 'object', 'argument must be an object');
    assert('type' in point, 'object must have type property');
    assert('coordinates' in point, 'object must have coordinates property');
    assert(point.type === 'Point', 'type must be `Point`');

    if (!this.pointInBoundingBox(point)) {
      return false;
    }

    return this.isPointInPolygon(point);
  }

  /**
   *
   * @param point
   * @returns {boolean}
   * @private
   */
  private pointInBoundingBox(point: Point) {
    const [y, x] = point.coordinates;

    return this.boundingBoxes.some((boundingBox) => {
      if (x < boundingBox[0][0] || x > boundingBox[1][0]) {
        return false;
      }

      if (y < boundingBox[0][1] || y > boundingBox[1][1]) {
        return false;
      }

      return true;
    });
  }

  /**
   *
   * @param point
   * @param vert
   * @returns {boolean}
   * @private
   */
  private isPointInPolygon(point: Point): boolean {
    const [y, x] = point.coordinates;

    return this.verts.some((vert) => {
      let inside = false;

      for (let i = 0, j = vert.length - 1; i < vert.length; j = i++) {
        const yi = vert[i][0];
        const xi = vert[i][1];
        const yj = vert[j][0];
        const xj = vert[j][1];

        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    });
  }
}
