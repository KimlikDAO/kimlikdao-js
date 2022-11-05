/**
 * @fileoverview KimlikDAO secp256k1 implementation.
 *
 * @author KimlikDAO
 */

/**
 * @const {!bigint}
 * @noinline
 */
const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");

/** @const {!bigint} */
const N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

/**
 * @constructor
 * @struct
 * @param {!bigint} x
 * @param {!bigint} y
 * @param {!bigint} z
 */
function Jacobian(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

/**
 * @return {!Affine}
 */
Jacobian.prototype.toAffine = function () {
  /** @const {!bigint} */
  const iz = inverse(this.z)
  /** @const {!bigint} */
  const iz2 = (iz * iz) % P;
  /** @const {!bigint} */
  const iz3 = (iz2 * iz) % P;
  return new Affine((this.x * iz2) % P, (this.y * iz3) % P);
}

/**
 * @constructor
 * @struct
 * @param {!bigint} x
 * @param {!bigint} y
 */
function Affine(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * @return {!Jacobian}
 */
Affine.prototype.toJacobian = function () {
  return new Jacobian(this.x, this.y, 1n);
}

/**
 * Base point for the Koblitz curve
 *
 *   y^2 = x^3 + 7
 *
 * over F_P in Jacobian coordinates.
 *
 * @const {!Jacobian}
 * @noinline
 */
const G = new Affine(
  BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"),
  BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8")
).toJacobian();

/**
 * Modular inversion over F_P via the Euclidian algorithm.
 *
 * Requires that b < P and P is a prime.
 *
 * @param {!bigint} b
 * @return {!bigint} x such that Ax + Py = 1 and 0 < x < P.
 */
const inverse = (b) => {
  /** @type {!bigint} */
  let a = P;
  /** @type {!bigint} */
  let c = 0n;
  /** @type {!bigint} */
  let d = 1n;
  /** @type {!bigint} */
  let t;
  /** @type {!bigint} */
  let q;
  while (b !== 0n) {
    q = a / b;
    t = d;  d = c - q * d;  c = t;
    t = b;  b = a - q * b;  a = t;
  }
  if (c < 0) c += P;
  return c;
}

export {
  inverse,
  P
};
