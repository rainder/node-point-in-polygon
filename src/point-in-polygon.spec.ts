import { expect } from 'chai';
import { PointInPolygon } from './point-in-polygon';

describe('point-in-polygon', () => {
  const kualaLumpurGeometry = require('./stub/kuala-lumpur.timezone.stub.json').geometry;
  const londonGeometry = require('./stub/london.stub.json');
  const londonWithAHoleGeometry = require('./stub/london-with-a-hole.stub.json');

  it('should return true when point in polygon', async () => {
    const pip = new PointInPolygon(londonGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [-0.15, 51.5],
    })).to.equals(true);
  });

  it('should return false when point is outside of the polygon', async () => {
    const pip = new PointInPolygon(londonGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [10, 20],
    })).to.equals(false);
  });

  it('should return false when point is inside the hole of the polygon', async () => {
    const pip = new PointInPolygon(londonWithAHoleGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [-0.15, 51.5],
    })).to.equals(false);
  });

  it('should return true when point is outside the hole of the polygon', async () => {
    const pip = new PointInPolygon(londonWithAHoleGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [0.05218505859375, 51.50190410761811],
    })).to.equals(true);
  });

  it('should return true when point is in multi-polygon', async () => {
    const pip = new PointInPolygon(kualaLumpurGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [103.69308471679688, 2.539756245417003],
    })).to.equals(true);
  });

  it('should return false when point is outside multi-polygon', async () => {
    const pip = new PointInPolygon(kualaLumpurGeometry);

    expect(pip.isPointInside({
      type: 'Point',
      coordinates: [104.00619506835936, 2.589145208949906],
    })).to.equals(false);
  });

  const memoryUsageTracker = () => {
    let previous = process.memoryUsage();

    return (note?: string) => {
      const current = process.memoryUsage();
      const output = Object.entries(current).map(([name, value]) => {
        return [name, value - (previous as any)[name]];
      })
        .map(([name, value]) => `${ name }:${ value }`)
        .join(' ');
      previous = current;

      console.log(output, note);
    };
  };

  it('should memory', async () => {
    const mem = memoryUsageTracker();

    mem('init');
    const pip1 = new PointInPolygon(kualaLumpurGeometry);
    mem('pip');
    const pip2 = new PointInPolygon(kualaLumpurGeometry);
    mem('pip2');
    const pip3 = new PointInPolygon(kualaLumpurGeometry);
    mem('pip3');
  });
});
