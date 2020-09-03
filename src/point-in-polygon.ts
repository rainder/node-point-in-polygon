import assert = require('assert');
import { cloneObject } from './clone-object';
import { BoundingBox, MultiPolygon, Point, Polygon, Vert } from './types';


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

    this.boundingBoxes = polygons.map((polygon) => PointInPolygon.calculateBoundingBox(polygon));
    this.verts = polygons.map((polygon) => PointInPolygon.calculateVert(polygon));
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
    let minX;
    let minY;
    let maxX;
    let maxY;

    for (const coords of polygon.coordinates) {
      for (const coord of coords) {
        const [y, x] = coord;

        minX = Math.min(minX ?? x, x);
        maxX = Math.max(maxX ?? x, x);

        minY = Math.min(minY ?? y, y);
        maxY = Math.max(maxY ?? y, y);
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
    // const size = polygon.coordinates.reduce((sum, item) => sum + item.length, 0);
    // const vert2: Vert = new Array(size + 1 + (2 * polygon.coordinates.length));
    const vert: Vert = [[0, 0]];

    for (const array of polygon.coordinates) {
      vert.push(...array, array[0], [0, 0]);
    }

    // console.log(vert.length, vert2.length);

    return vert;
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
    assert(point.type === 'Point', 'type must be `Point');

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
    return this.boundingBoxes.some((boundingBox) => {
      const [y, x] = point.coordinates;

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
    return this.verts.some((vert) => {
      const [y, x] = point.coordinates;

      let inside = false;

      for (let i = 0, j = vert.length - 1; i < vert.length; j = i++) {
        const a = vert[i][0] > y;
        const b = vert[j][0] > y;

        if (a != b) {
          const a = vert[j][1] - vert[i][1];
          const b = y - vert[i][0];
          const c = vert[j][0] - vert[i][0];
          const d = vert[i][1];
          const r = a * b / c + d;

          if (x < r) {
            inside = !inside;
          }
        }
      }

      return inside;
    });
  }
}
