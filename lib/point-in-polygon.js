'use strict';

const assert = require('assert');

module.exports = class PointInPolygon {

  /**
   *
   * @param polygon
   */
  constructor(polygon) {
    assert(typeof polygon === 'object', 'argument must be an object');
    assert('type' in polygon, 'object must have type property');
    assert('coordinates' in polygon, 'object must have coordinates property');
    assert(polygon.type === 'Polygon', 'type must be `Polygon`');

    this.bounding_box = this._calculateBondingBox(polygon.coordinates);
    this.vert = this._calculateVert(polygon.coordinates);
  }

  /**
   *
   * @param point
   * @returns {boolean}
   */
  isPointInside(point) {
    assert(typeof point === 'object', 'argument must be an object');
    assert('type' in point, 'object must have type property');
    assert('coordinates' in point, 'object must have coordinates property');
    assert(point.type === 'Point', 'type must be `Point');

    if (!this._pointInBoundingBox(point)) {
      return false;
    }

    return this._isPointInPolygon(point);
  }

  /**
   *
   * @param coords
   * @returns {*[]}
   * @private
   */
  _calculateBondingBox(coords) {
    let minX;
    let minY;
    let maxX;
    let maxY;

    for (const coord of coords[0]) {
      const x = coord[1];
      const y = coord[0];

      minX = Math.min(minX || x, x);
      maxX = Math.max(maxX || x, x);

      minY = Math.min(minY || y, y);
      maxY = Math.max(maxY || y, y);
    }

    return [[minX, minY], [maxX, maxY]];
  }

  /**
   *
   * @param coords
   * @returns {*[]}
   * @private
   */
  _calculateVert(coords) {
    const vert = [[0, 0]];

    for (const array of coords) {
      vert.push(...array, array[0], [0, 0]);
    }

    return vert;
  }

  /**
   *
   * @param point
   * @returns {boolean}
   * @private
   */
  _pointInBoundingBox(point) {
    const x = point.coordinates[1];
    const y = point.coordinates[0];

    if (x < this.bounding_box[0][0]) {
      return false;
    }

    if (x > this.bounding_box[1][0]) {
      return false;
    }

    if (y < this.bounding_box[0][1]) {
      return false;
    }

    if (y > this.bounding_box[1][1]) {
      return false;
    }

    return true;
  }

  /**
   *
   * @param point
   * @param vert
   * @returns {boolean}
   * @private
   */
  _isPointInPolygon(point) {
    const x = point.coordinates[1];
    const y = point.coordinates[0];

    let inside = false

    for (let i = 0, j = this.vert.length - 1; i < this.vert.length; j = i++) {
      const a = this.vert[i][0] > y;
      const b = this.vert[j][0] > y;

      if (a != b) {
        const a = this.vert[j][1] - this.vert[i][1];
        const b = y - this.vert[i][0];
        const c = this.vert[j][0] - this.vert[i][0];
        const d = this.vert[i][1];
        const r = a * b / c + d;

        if (x < r) {
          inside = !inside;
        }
      }
    }

    return inside
  }
}
