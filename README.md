# Point in polygin

supports `Polygon` and `Multipolygon`.

```js
const PointInPolygon = require('@rainer/point-in-polygon');

//pre-process the polygon so it can be used frequently in the future
const polygon = new PointInPolygon({
  type: "Polygon",
  coordinates: [[
    [4.282264709472656, 50.846272321172954],
    [4.294281005859375, 50.807887348295125],
    [4.3650054931640625, 50.815697018296866],
    [4.4199371337890625, 50.839118194340664],
    [4.38629150390625, 50.87032815256481],
    [4.3670654296875, 50.89632049851189],
    [4.320373535156249, 50.89632049851189],
    [4.295310974121094, 50.89112318936364],
    [4.279518127441406, 50.86556131614074],
    [4.282264709472656, 50.846272321172954],
  ]],
});

//find out if the point is in polygon
const isInside = polygon.isPointInside({
  type: "Point",
  coordinates: [4.32, 50.8],
}); //true or false

```
