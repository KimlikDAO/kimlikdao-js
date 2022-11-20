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

describe('Jacobian <> JacobianPoint equivalence', () => {
  it('should be pointwise equal', () => {
    assert.deepEqual(
      G,
      derogate(NoblePoint.BASE)
    );
  })
});

describe('Double tests', () => {
  it('should be pointwise equal', () => {
    const nG = G.copy();
    nG.double();
    nG.normalize();

    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double())
    );

    nG.double();
    nG.normalize();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double().double())
    );

    nG.double();
    nG.normalize();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.double().double().double())
    );
  })
});

describe('Add tests', () => {
  it('should be pointwise equal', () => {
    const nG = G.copy();
    nG.increment(G);
    nG.normalize();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.add(NoblePoint.BASE))
    );

    nG.increment(G);
    nG.normalize();
    assert.deepEqual(
      nG,
      derogate(NoblePoint.BASE.add(NoblePoint.BASE).add(NoblePoint.BASE))
    );
  })
});
