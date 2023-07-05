import { inverse } from "../crypto/modular";
import { G, N, Point } from "../crypto/secp256k1";
import { keccak256Uint32, keccak256Uint32ToHex } from "../crypto/sha3";
import evm from "../ethereum/evm";
import { hex, hexten } from "../util/çevir";

/**
 * @param {!bigint} privKey
 * @return {string}
 */
const addr = (privKey) => {
  const { x, y } = G.copy().multiply(privKey).project();
  /** @const {!Uint8Array} */
  const buff = hexten(evm.uint256(x) + evm.uint256(y));
  return "0x" + hex(new Uint8Array(
    keccak256Uint32(new Uint32Array(buff.buffer)).buffer, 12, 20));
}

/**
 * Deterministically sign a given `digest` with the `privKey`.
 *
 * Note that derivation of the `K` point is deterministic but non-standard, so
 * the created signature will not match that of the common ethereum wallets.
 *
 * TODO(KimlikDAO-bot): Implement standard deterministic signatures.
 *
 * @param {!bigint} digest
 * @param {!bigint} privKey
 * @return {{
 *   r: !bigint,
 *   s: !bigint,
 *   yParity: boolean
 * }}
 */
const sign = (digest, privKey) => {
  /** @type {!Uint32Array} */
  let buff = new Uint32Array(
    hexten(evm.uint256(digest) + evm.uint256(privKey)).buffer);

  for (; ; ++buff[0]) {
    /** @const {!bigint} */
    const k = BigInt("0x" + keccak256Uint32ToHex(buff));
    if (k <= 0 || N <= k) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @type {!Point} */
    const K = G.copy().multiply(k).project();
    /** @const {!bigint} */
    const r = K.x;
    if (r >= N) continue; // probability ~2^{-128}, i.e., a near impossibility.
    /** @type {!bigint} */
    let s = (inverse(k, N) * ((digest + r * privKey) % N)) % N;
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
 * @param {{
 *   r: !bigint,
 *   s: !bigint,
 *   yParity: boolean
 * }} sig
 * @return {string}
 */
const toWideSignature = (sig) =>
  evm.uint256(sig.r) + evm.uint256(sig.s) + (27 + +sig.yParity).toString(16);

/**
* @param {{
*   r: !bigint,
*   s: !bigint,
*   yParity: boolean
* }} sig
* @return {string}
*/
const toCompactSignature = (sig) => evm.uint256(sig.r) +
  evm.uint256(sig.yParity ? sig.s + (1n << 255n) : sig.s);

/**
 * @param {!bigint} digest as bigint
 * @param {!bigint} privKey as bigint
 * @return {string}
 */
const signWide = (digest, privKey) => toWideSignature(sign(digest, privKey));

/**
 * @param {!bigint} digest as bigint
 * @param {!bigint} privKey as bigint
 * @return {string}
 */
const signCompact = (digest, privKey) => toCompactSignature(sign(digest, privKey));

/**
 * @constructor
 * @implements {eth.Provider}
 *
 * @param {!bigint} privKey
 */
function FakeProvider(privKey) {
  /** @const {!bigint} */
  this.privKey = privKey;
}

/**
 * @override
 *
 * @param {!eth.Request} req
 * @return {!Promise<string>|!Promise<!Array<string>>}
 */
FakeProvider.prototype.request = function (req) {
  switch (req.method) {
    case "personal_sign":
      if (/** @type {string} */(req.params[1]).toLowerCase()
        != addr(this.privKey))
        return Promise.reject(/** @type {!eth.ProviderError} */({
          code: -32602,
          message: "from should be same as current address"
        }));
      /** @const {!TextDecoder} */
      const decoder = new TextDecoder();
      /** @const {string} */
      const message = decoder.decode(hexten(/** @type {string} */(req.params[0]).slice(2)));
      /** @const {!bigint} */
      const digest = BigInt("0x" + evm.personalDigest(message));
      return Promise.resolve("0x" + signWide(digest, this.privKey));
  }
  return Promise.reject();
}

/**
 * @return {string}
 */
FakeProvider.prototype.getAddress = function () {
  return addr(this.privKey);
}

export default {
  addr,
  sign,
  signCompact,
  signWide,
};

export { FakeProvider };
