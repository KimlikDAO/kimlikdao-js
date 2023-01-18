/**
 * @fileoverview HumanID implementation.
 *
 * @author KimlikDAO
 */

import { inverse } from "../crypto/modular";
import { G, N, Point } from "../crypto/secp256k1";
import { keccak256, keccak256Uint32 } from "../crypto/sha3";
import { evaluate } from "../crypto/wesolowski";
import evm from "../ethereum/evm";
import { base64, hex, hexten, sayıdanBase64e } from "../util/çevir";

/** @const {number} */
const KIMLIKDAO_VERIFIABLE_ID_ITERATIONS = 5_000_000;

/**
 * @param {string} digest 256-bit hex encoded bytes.
 * @param {string} privKey 256-bit hex encoded bytes.
 * @return {{
 *   r: !bigint,
 *   s: !bigint,
 *   yParity: boolean
 * }}
 */
const sign = (digest, privKey) => {
  /** @const {!Uint32Array} */
  const buff = new Uint32Array(hexten(digest + privKey).buffer);
  /** @const {!bigint} */
  const d = BigInt("0x" + digest);
  /** @const {!bigint} */
  const pk = BigInt("0x" + privKey)

  for (; ; ++buff[0]) {
    /** @const {!bigint} */
    const k = BigInt("0x" + hex(new Uint8Array(keccak256Uint32(buff).buffer, 0, 32)));
    if (k <= 0 || N <= k) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @type {!Point} */
    const K = G.copy().multiply(k).project();
    /** @const {!bigint} */
    const r = K.x;
    if (r >= N) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @type {!bigint} */
    let s = (inverse(k, N) * ((d + r * pk) % N)) % N;
    if (s == 0n) continue; // probability ~2^{-256}
    /** @type {boolean} */
    let yParity = !!(K.y & 1n);
    if (s > (N >> 1n)) {
      s = N - s;
      yParity = !yParity;
    }
    return { r, s, yParity }
  }
}

/**
 * @param {string} personKey
 * @param {string} secret a 256 bit hex encoded bytes.
 * @return {!did.VerifiableID}
 */
const generate = (personKey, secret) => {
  let { r, s, yParity } = sign(keccak256(personKey), secret)
  const { y, π, l } = evaluate(r, KIMLIKDAO_VERIFIABLE_ID_ITERATIONS);

  if (yParity) s += (1n << 255n);

  /** @const {!Uint32Array} */
  const yArr = keccak256Uint32(new Uint32Array(hexten(y.toString(16)).buffer));
  return /** @type {!did.VerifiableID} */({
    id: base64(new Uint8Array(yArr.buffer, 0, 32)),
    g: evm.uint256(r) + evm.uint256(s),
    wesolowskiP: sayıdanBase64e(π),
    wesolowskiL: sayıdanBase64e(l),
  });
}

export { generate };
