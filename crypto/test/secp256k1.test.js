import { Point } from '@noble/secp256k1';
import { assert, describe, it } from 'vitest';
import { Affine, G } from '../secp256k1';

/**
 * @param {Point} p
 * @return {Affine}
 */
const pointToAffine = (p) => new Affine(p.x, p.y);

describe('Jacobian <> JacobianPoint equivalence', () => {
  it('should be pointwise equal', () => {
    assert.deepEqual(
      G.toAffine(),
      pointToAffine(Point.BASE)
    );
    assert.deepEqual(
      G.double().toAffine(),
      pointToAffine(Point.BASE.double())
    );
    assert.deepEqual(
      G.double().double().toAffine(),
      pointToAffine(Point.BASE.double().double())
    );

    for (let i = 1n; i < 10000n; ++i) {
      G.multiply(i).toAffine(),
      pointToAffine(Point.BASE.multiply(i))
    }
  })
});
