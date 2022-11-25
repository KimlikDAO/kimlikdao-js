/**
 * @fileoverview KimlikDAO secp256k1 implementation.
 *
 * The secp256k1 is the curve
 *
 *   y^2 = x^3 + 7
 *
 * over F_P, where P = 2^256 - 2^32 - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1.
 *
 * @author KimlikDAO
 */

import { hex } from "../util/çevir";
import { inverse } from "./modular";

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
 * We work with a lifting of the secp256k1 curve defined as
 *
 *   y^2 = x^3 + 7z^6
 *
 * over (F_P)^3. The projection onto the z = 1 plane gives the regular
 * sepck256k1.
 *
 * @constructor
 * @struct
 * @param {!bigint} x
 * @param {!bigint} y
 * @param {!bigint} z
 */
function Point(x, y, z) {
  /** @type {!bigint} */
  this.x = x;
  /** @type {!bigint} */
  this.y = y;
  /** @type {!bigint} */
  this.z = z;
}

/**
 * @const {!Point}
 * @noinline
 */
const G = new Point(
  BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"),
  BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8"),
  1n
);

/**
 * The point at infinity. This point is on
 *
 *   y^2 = x^3 + 7z^6
 *
 * but has not projection onto the z = 1 plane, as expected.
 *
 * @const {!Point}
 */
const O = new Point(0n, 0n, 0n);

/**
 * Project onto the z = 1 plane. Leaves `O`, the point at infinity intact.
 *
 * @return {!Point}
 */
Point.prototype.project = function () {
  if (this.z != 0n) {
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
  return this;
}

/**
 * Multiplies the point by 2, in-place.
 *
 * @see https://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#doubling-dbl-2009-l
 * @return {!Point}
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
  return this;
}

/**
 * Increments the point by `other`.
 *
 * @param {!Point} other
 * @return {!Point}
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
    if (r === 0n) {
      if (z2 == 0n) { }
      else if (z1 == 0n) { this.x = x2; this.y = y2; this.z = z2; }
      else this.double();
    } else
      this.x = this.y = this.z = 0n;
    return this;
  }
  const h2 = (h * h) % P;
  const h3 = (h * h2) % P;
  const v = (u1 * h2) % P;
  const X = modP(r * r - h3 - 2n * v);
  this.y = modP(r * (v - X) - s1 * h3);
  this.z = modP(z1 * z2 * h);
  this.x = X;
  return this;
}

/**
 * Creates a copy of the `Point`.
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
 * @return {!Point}
 */
Point.prototype.multiply = function (n) {
  let d = this.copy();
  this.x = this.y = this.z = 0n;
  while (n > 0n) {
    if (n & 1n) this.increment(d);
    d.double();
    n >>= 1n;
  }
  return this;
}

const equal = (p, q) => {
  q.project();
  p.project();
  return p.x == q.x && p.y == q.y;
}

/**
 * @param {!bigint} digest as bigint
 * @param {!bigint} privKey as bigint
 * @return {string} string of length 128 in the EIP-2098 compact format.
 * @see https://eips.ethereum.org/EIPS/eip-2098
 */
const sign = (digest, privKey) => {
  for (; ;) {
    /** @const {!bigint} */
    const k = BigInt("0x" + hex(crypto.getRandomValues(new Uint8Array(32))));
    if (k <= 0 || N <= k) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @const {!Point} */
    const K = G.copy().multiply(k);
    /** @const {!bigint} */
    const r = K.x;
    if (r >= N) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @const {!bigint} */
    const ik = inverse(k, N);
    let s = (ik * ((digest + r * privKey) % N)) % N;
    if (s == 0n) continue; // probability ~2^{-256}
    /** @type {boolean} */
    let yParity = (K.y & 1n) == 1n;
    if (2n * s >= N) {
      s = N - s;
      yParity = !yParity;
    }
    if (yParity) s += 1n << 255n;
    return r.toString(16).padStart(64, "0") + s.toString(16).padStart(64, "0");
  }
}

export {
  equal,
  G,
  N,
  O,
  P,
  Point,
  sign,
};
