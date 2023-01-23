/**
 * @fileoverview A preliminary VerifiableID implementation.
 *
 * @author KimlikDAO
 */

import { keccak256Uint32ToHex } from "../crypto/sha3";
import { evaluate, generateChallenge, reconstructY } from "../crypto/wesolowski";
import {
  base64, base64ten, base64tenSayıya, sayıdanBase64e,
  uint32ArrayeHexten
} from "../util/çevir";

/** @const {number} */
const KIMLIKDAO_VERIFIABLE_ID_LOG_ITERATIONS = 20;

/** @const {number} */
const KIMLIKDAO_VERIFIABLE_ID_ITERATIONS = 1 << 20;

/**
 * @param {string} personKey An arbitrary string about a person.
 * @param {string} privateKey A base64 encoded RSA private key.
 * @return {!Promise<!did.VerifiableID>}
 */
const generate = (personKey, privateKey) => {
  return crypto.subtle.importKey("pkcs8", base64ten(privateKey),
    /** @type {!webCrypto.RsaHashedImportParams} */({
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    }), false, ["sign"])
    .then((/** @type {!webCrypto.CryptoKey} */ signKey) => crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5", signKey, new TextEncoder().encode(personKey)))
    .then((/** @type {!ArrayBuffer} */ signature) => {
      /** @const {!bigint} */
      const g = BigInt("0x" + keccak256Uint32ToHex(new Uint32Array(signature)));
      const { y, π, l } = evaluate(g, KIMLIKDAO_VERIFIABLE_ID_ITERATIONS);
      /** @const {!Uint32Array} */
      const yArr = new Uint32Array(32);
      uint32ArrayeHexten(yArr, y.toString(16).padStart(256, "0"));
      return /** @type {!did.VerifiableID} */({
        id: keccak256Uint32ToHex(yArr),
        x: base64(new Uint8Array(signature)),
        wesolowskiP: sayıdanBase64e(π),
        wesolowskiL: sayıdanBase64e(l),
      });
    });
}

/**
 * @param {!did.VerifiableID} verifiableID
 * @param {string} personKey
 * @param {string} publicKey
 * @return {!Promise<boolean>}
 */
const verify = (verifiableID, personKey, publicKey) => {
  /** @const {!Uint32Array} */
  const xArray = new Uint32Array(base64ten(verifiableID.x).buffer);
  /** @const {!bigint} */
  const g = BigInt("0x" + keccak256Uint32ToHex(xArray));
  /** @const {!bigint} */
  const π = base64tenSayıya(verifiableID.wesolowskiP);
  /** @const {!bigint} */
  const l = base64tenSayıya(verifiableID.wesolowskiL);
  /** @const {!bigint} */
  const y = reconstructY(
    KIMLIKDAO_VERIFIABLE_ID_LOG_ITERATIONS, g, π, l);
  /** @const {!Uint32Array} */
  const yArr = new Uint32Array(32);
  uint32ArrayeHexten(yArr, y.toString(16).padStart(256, "0"));
  if (keccak256Uint32ToHex(yArr) != verifiableID.id) return Promise.resolve(false);
  if (generateChallenge(g, y) != l) return Promise.resolve(false);
  return crypto.subtle.importKey("spki", base64ten(publicKey),
    /** @type {!webCrypto.RsaHashedImportParams} */({
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    }), false, ["verify"])
    .then((/** @type {!webCrypto.CryptoKey} */ verifyKey) => crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5", verifyKey, xArray, new TextEncoder().encode(personKey)
    ))
}

export { generate, verify };
