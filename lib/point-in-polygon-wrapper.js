'use strict';

const assert = require('assert');
const PointInPolygon = require('./point-in-polygon');

module.exports = class PointInPolygonWrapper {
  constructor(geometry) {
    assert(typeof geometry === 'object', 'argument must be an object');
    assert('type' in geometry, 'object must have type property');
    assert('coordinates' in geometry, 'object must have coordinates property');
    assert(['MultiPolygon', 'Polygon'].includes(geometry.type), 'type must be `Polygon` or `MultiPolygon`');

    if (geometry.type === 'MultiPolygon') {
      this.polygons = this.splitMultipolygon(geometry)
        .map((item) => new PointInPolygon(item));
    } else {
      this.polygons = [new PointInPolygon(geometry)];
    }

  }

  /**
   *
   * @param geometry
   */
  splitMultipolygon(geometry) {
    return geometry.coordinates.map((coordinates) => ({
      type: 'Polygon',
      coordinates: coordinates,
    }));
  }

  /**
   *
   * @param point
   * @returns {boolean}
   */
  isPointInside(point) {
    return !!this.polygons.find((item) => item.isPointInside(point));
  }
}
