'use strict';

require('chai').should();
const PointInPolygon = require('./../index');

describe('MultiPolygon', function () {
  it('should process MultiPolygon', function () {

    const geometry = {
      "coordinates": [
        [
          [
            [
              -0.043945,
              52.879882
            ],
            [
              0.764673,
              51.723626
            ],
            [
              0.719604,
              51.258477
            ],
            [
              -0.021973,
              51.006842
            ],
            [
              -0.961304,
              51.124213
            ],
            [
              -1.049194,
              51.706608
            ],
            [
              -0.631714,
              51.971346
            ],
            [
              -0.043945,
              52.879882
            ]
          ]
        ],
        [
          [
            [
              11.425781,
              37.71859
            ],
            [
              14.985352,
              36.527295
            ],
            [
              18.720703,
              40.212441
            ],
            [
              12.568359,
              44.370987
            ],
            [
              12.436523,
              45.243953
            ],
            [
              13.623047,
              45.675482
            ],
            [
              13.491211,
              46.468133
            ],
            [
              12.041016,
              47.070122
            ],
            [
              6.899414,
              45.828799
            ],
            [
              7.426758,
              43.961191
            ],
            [
              8.129883,
              38.959409
            ],
            [
              11.425781,
              37.71859
            ]
          ]
        ]
      ],
      "type": "MultiPolygon"
    };
    const point1 = {
      "type": "Point",
      "coordinates": [
        12.1728515625,
        42.35854391749705
      ]
    };
    const point2 = {
      "type": "Point",
      "coordinates": [
        0,
        51.536085601784755
      ]
    };
    const point3 = {
      "type": "Point",
      "coordinates": [
        3.076171875,
        48.04870994288686
      ]
    };


    const pinp = new PointInPolygon(geometry);

    (pinp.isPointInside(point1)).should.equals(true);
    (pinp.isPointInside(point2)).should.equals(true);
    (pinp.isPointInside(point3)).should.equals(false);
  });
});
