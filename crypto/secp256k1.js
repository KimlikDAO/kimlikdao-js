/**
 * @fileoverview KimlikDAO secp256k1 implementation.
 * The secp256k1 is the curve
 *
 *   y^2 = x^3 + 7
 *
 * over F_P, where P = 2^256 - 2^32 - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1.
 *
 * @author KimlikDAO
 */

import { inverse } from "./modular"

/**
 * @const {!bigint}
 * @noinline
 */
const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");

/** @const {!bigint} */
const N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

/**
 * Unlike the % operation, modP always returns a positive number y such that
 *
 *   0 <= y < P  and  x = y (mod P).
 *
 * If positivity is not required, prefer the % operator.
 *
 * @param {!bigint} x
 * @returns {!bigint} y such that x = y (mod P) and 0 <= y < P.
 */
const modP = (x) => {
  let res = x % P;
  return res >= 0n ? res : res + P;
}

/**
 * @constructor
 * @struct
 * @param {!bigint} x
 * @param {!bigint} y
 * @param {!bigint} z
 */
function Point(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

/**
 * Normalize the Jacobian representation so that z = 1, that is, (x, y) is now
 * in the affine coordinates.
 */
Point.prototype.normalize = function () {
  /** @const {!bigint} */
  const iz = inverse(this.z, P)
  /** @const {!bigint} */
  const iz2 = (iz * iz) % P;
  /** @const {!bigint} */
  const iz3 = (iz2 * iz) % P;
  this.x = (this.x * iz2) % P;
  this.y = (this.y * iz3) % P;
  this.z = 1n;
}

/**
 * Multiplies the point by 2, in-place.
 *
 * @see https://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#doubling-dbl-2009-l
 */
Point.prototype.double = function () {
  const { x, y, z } = this;
  const a = (x * x) % P;
  const b = (y * y) % P;
  const c = (b * b) % P;
  const xb = x + b;
  const d = 2n * (xb * xb - a - c) % P;
  const e = 3n * a;
  const f = (e * e) % P;
  const X = modP(f - 2n * d);
  this.y = modP(e * (d - X) - 8n * c);
  this.z = (2n * y * z) % P;
  this.x = X;
}

/**
 * Increments the point by `other` Jacobian.
 *
 * @param {!Point} other
 */
Point.prototype.increment = function (other) {
  const { x: x1, y: y1, z: z1 } = this;
  const { x: x2, y: y2, z: z2 } = other;

  const z1z1 = (z1 * z1) % P;
  const z2z2 = (z2 * z2) % P;
  const u1 = (x1 * z2z2) % P;
  const u2 = (x2 * z1z1) % P;
  const s1 = (((y1 * z2) % P) * z2z2) % P;
  const s2 = (((y2 * z1) % P) * z1z1) % P;
  const h = (u2 - u1) % P;
  const r = (s2 - s1) % P;

  if (h === 0n) {
    this.double();
    return;
  }
  const h2 = (h * h) % P;
  const h3 = (h * h2) % P;
  const v = (u1 * h2) % P;
  const X = modP(r * r - h3 - 2n * v);
  this.y = modP(r * (v - X) - s1 * h3);
  this.z = modP(z1 * z2 * h);
  this.x = X;
}

/**
 * Creates a copy of the `Point`
 *
 * @return {!Point}
 */
Point.prototype.copy = function () {
  return new Point(this.x, this.y, this.z);
}

/**
 * Multiplies the point by the scalar `n` in-place.
 *
 * @param {!bigint} n
 */
Point.prototype.multiply = function (n) {
  let d = this.copy();
  this.x = this.y = this.z = 0n;
  while (n > 0n) {
    if (n & 1n) this.increment(d);
    this.double();
    n >>= 1n;
  }
}

/**
 * Base point for the Koblitz curve
 *
 *   y^2 = x^3 + 7
 *
 * over F_P.
 *
 * @const {!Point}
 * @noinline
 */
const G = new Point(
  BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"),
  BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"),
  1n
);

export {
  G,
  P,
  Point,
};
