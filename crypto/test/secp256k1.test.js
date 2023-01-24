import { Point as NoblePoint } from '@noble/secp256k1';
import { assert, describe, it } from 'vitest';
import { Point, G } from '../secp256k1';

/**
 * Remove the nobility of the point :/
 *
 * @param {NoblePoint} p
 * @return {Point}
 */
const derogate = (p) => new Point(p.x, p.y, 1n);

describe('Point <> JacobianPoint equivalence', () => {
  it('should be pointwise equal', () => {
    assert.deepEqual(
      G,
      derogate(NoblePoint.BASE)
    );
  })
});

describe('Double tests', () => {
  it('should be pointwise equal', () => {
    const nG = G.copy().double().project();

    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double())
    );

    nG.double().project();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double().double())
    );

    nG.double().project();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double().double().double())
    );
  })
});

describe('Add tests', () => {
  it('should be pointwise equal', () => {
    const nG = G.copy().increment(G).project();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.add(NoblePoint.BASE))
    );

    nG.increment(G).project();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.add(NoblePoint.BASE).add(NoblePoint.BASE))
    );
  })
});
