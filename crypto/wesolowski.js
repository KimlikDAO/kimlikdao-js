import { uint32ArrayeHexten } from "../util/çevir";
import { expTimesExp } from "./modular";
import { keccak256Uint32ToHex } from "./sha3";

/** @const {!bigint} */
const N = BigInt("0x"
  + "e0b7782dbd6c9fc269cc5259ca7be1b451c9fbbc20293434852f6f3e86034609"
  + "32b66001276a399f2e20dc942c627159b28652138463e1fc59446d8715ae651c"
  + "ff6823ba0a6202d12f34b4ca06d6ae6cecd7b9962df8380a5469b79145c8b433"
  + "d493d82aeb28a0305bf0c766377f005fd5de2d3594867116237c5c40fd542575");

/** @const {!Array<number>} */
const P = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
  127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
  179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
  233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
  283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
  353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
  419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
  467, 479, 487, 491, 499, 503, 509, 521, 523, 541
];

/**
 * Generates a challenge supposedly sent from the verifier to the prover.
 *
 * Thanks to the Fiat-Shamir heristic, the prover generates this from an
 * unpredictable function of the VDF output without any interaction.
 *
 * @param {!bigint} g
 * @param {!bigint} y
 * @return {!bigint}
 */
const generateChallenge = (g, y) => {
  // (1) Hash g and y
  /** @const {!Uint32Array} */
  const buff = new Uint32Array(33);
  uint32ArrayeHexten(buff.subarray(1), y.toString(16));
  uint32ArrayeHexten(buff, g.toString(16));
  /** @const {!bigint} */
  const h = BigInt("0x" + keccak256Uint32ToHex(buff));

  /**
   * Bit vector to keep the sieve results.
   *
   * `t[i] == 1` implies that `h + i` is composite.
   *
   * @const {!Uint8Array}
   */
  const t = new Uint8Array(2048);
  for (const p of P) {
    /** @const {number} */
    const r = Number(h % BigInt(p));
    for (let i = r ? p - r : 0; i < 2048; i += p)
      t[i] = 1;
  }
  /** @type {number} */
  let i = 0;
  while (t[i]) ++i;
  return h + BigInt(i);
}

/**
 * @param {!bigint} g
 * @param {number} t
 * @return {{
 *   y: !bigint,
 *   π: !bigint,
 *   l: !bigint
 * }}
 */
const evaluate = (g, t) => {
  let y = g;
  for (let i = 0; i < t; ++i)
    y = y * y % N;

  /** @const {!bigint} */
  const l = generateChallenge(g, y);

  return { y, π: 0n, l }
}

/**
 * Reconstructs y from the paramters:
 *
 * @param {number} logT the logarithm of the difficulty parameter t
 * @param {!bigint} g the input to the VDF
 * @param {!bigint} π the Wesolowski proof for the challenge l,
 * @param {!bigint} l the challenge generated from a secure hash of g, y.
 * @return {!bigint} y reconstructred
 */
const reconstructY = (logT, g, π, l) => {
  /** @type {!bigint} */
  let r = 2n;
  for (let i = 0; i < logT; ++i)
    r = (r * r) % l;
  return expTimesExp(π, l, g, r, N);
}

export {
  evaluate,
  generateChallenge,
  reconstructY
};
