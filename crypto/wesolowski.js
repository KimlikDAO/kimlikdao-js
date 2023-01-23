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
 * Thanks to the Fiat-Shamir heuristic, the prover generates this from an
 * unpredictable function of the VDF output without any interaction.
 *
 * @param {!bigint} g
 * @param {!bigint} y
 * @return {!bigint}
 */
const generateChallenge = (g, y) => {
  // (1) Hash g and y to obtain an odd h.
  /** @const {!Uint32Array} */
  const buff = new Uint32Array(40);
  uint32ArrayeHexten(buff, y.toString(16).padStart(256, "0"));
  uint32ArrayeHexten(buff.subarray(32), g.toString(16).padStart(64, "0"));
  /** @const {!bigint} */
  const h = BigInt("0x" + keccak256Uint32ToHex(buff)) | 1n;

  // (2) Find a non-smooth number in the vicinity of h deterministically.
  // We do 500 rounds of sieve followed by a Miller-Rabin test with a small
  // number of test primes.
  /**
   * Bit vector to keep the sieve results.
   *
   * `t[i] > 0` implies that `h + i` is composite.
   * 
   * Further, i odd => 2^{t[i]} | h + i, namely for odd residues, we keep
   * power of 2s of h + i, to be used in the Miller-Rabin test.
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
  /**
   * (1) Calculate y = g^{2^t} (mod N)
   *
   * @type {!bigint}
   */
  let y = g;
  for (let i = 0; i < t; ++i)
    y = y * y % N;

  /**
   * (2) Generate the challenge y = generateChallenge(g, y).
   *
   * @const {!bigint}
   */
  const l = generateChallenge(g, y);

  /**
   * (2) Construct the proof π = g^{⌊2^t / l⌋}
   *
   * @type {!bigint}
   */
  let π = 1n;
  for (let i = 0, r = 2n; i < t; ++i, r <<= 1n) {
    π = π * π % N;
    if (r >= l) {
      π = π * g % N;
      r -= l;
    }
  }
  return { y, π, l }
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
