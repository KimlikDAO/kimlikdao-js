import { expTimesExp } from "./modular";

/** @const {!bigint} */
const N = BigInt("0x"
  + "E66615571EE49BBE095C57B25C7E2610C875EB3C0124ECB5F9B14A82D9177833"
  + "12FBD4EFE90B1D4DF4987810CAF5578151AEB795C2770E31F3D50428A0C16A0A"
  + "3185FC7222373078F417D77BEFBAE999C0FE0D44D10A073054BB5582C4D6779A"
  + "A006C5EC2866E0F023339D3420E92C33C5BE0B7D15D96C5E9B1AF3ED1335552E");

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
  /**
   * Bit vector to keep the sieve results.
   *
   * `t[i] == 1` implies that `h + i` is composite.
   *
   * @const {!Uint8Array}
   */
  const t = new Uint8Array(2048);
  /** @const {!bigint} */
  const h = 1337n;
  for (const p of P) {
    /** @const {number} */
    const r = Number(h % BigInt(p));
    for (let i = r ? p - r : 0; i < 2048; i += p)
      t[i] = 1;
  }
  return 0n;
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
 * Reconstructs y from the
 *   logarithm of the difficulty parameter t,
 *   VDF input g,
 *   proof π and,
 *   challenge l.
 *
 * @param {number} logT
 * @param {!bigint} g
 * @param {!bigint} π
 * @param {!bigint} l
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
