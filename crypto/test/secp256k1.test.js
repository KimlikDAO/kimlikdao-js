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
  })
});

describe('Double tests', () => {
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
  })
});

describe('Add tests', () => {
  it('should be pointwise equal', () => {
    assert.deepEqual(
      G.add(G).toAffine(),
      pointToAffine(Point.BASE.add(Point.BASE))
    );

    assert.deepEqual(
      G.add(G).add(G).toAffine(),
      pointToAffine(Point.BASE.add(Point.BASE).add(Point.BASE))
    );

    let acc1 = new Affine(0n, 0n).toJacobian();
    let acc2 = Point.ZERO;
    for (let i = 0; i < 10000; ++i) {
      acc1 = acc1.add(G);
      acc2 = acc2.add(Point.BASE);
    }
    assert.deepEqual(acc1.toAffine(), pointToAffine(acc2));
  })
});

describe('Multiply tests', () => {
  it('should be pointwise equal', () => {
    for (let i = 100000000n; i < 100000100n; ++i) {
      assert.deepEqual(
        G.multiply(i).toAffine(),
        pointToAffine(Point.BASE.multiply(i))
      )
    }
  })
});
