/**
 * @fileoverview `did.Section` implementation and manipulation function.
 *
 * @author KimlikDAO
 */

import { sign } from "../crypto/secp256k1";
import { keccak256, keccak256Uint32 } from "../crypto/sha3";
import evm from "../ethereum/evm";
import { hex, hexten, uint8ArrayeBase64ten } from "../util/çevir";

/** @const {string} */
const KIMLIKDAO_HASH_PREFIX = "\x19KimlikDAO hash\n";

/**
 * @param {string} sectionName
 * @param {!did.Section} section
 * @return {string}
 */
const hash = (sectionName, section) => {
  if (sectionName == "exposureReport") {
    /** @const {!did.ExposureReport} */
    const exposureReport = /** @type {!did.ExposureReport} */(section);
    /** @const {!Uint8Array} */
    const buff = new Uint8Array(64);
    new TextEncoder().encodeInto(KIMLIKDAO_HASH_PREFIX, buff);
    /** @const {!Uint8Array} */
    const ts = hexten(exposureReport.signatureTs.toString(16));
    buff.set(ts, 32 - ts.length);
    uint8ArrayeBase64ten(buff.subarray(32), exposureReport.id);
    return hex(new Uint8Array(
      keccak256Uint32(new Uint32Array(buff.buffer)).buffer, 0, 32));
  }
  /** @const {Set<string>} */
  const notHashed = new Set(["secp256k1", "bls12_381"]);
  return keccak256(
    KIMLIKDAO_HASH_PREFIX + JSON.stringify(section,
      Object.keys(section).filter((x) => !notHashed.has(x)).sort())
  );
}

/**
 * Returns the list of unique signers of an `did.Section`.
 *
 * Note these signers still need to be validated against the `TCKTSigners`
 * contract.
 *
 * @param {string} sectionName
 * @param {!did.Section} section
 * @return {!Array<string>}
 */
const recoverSectionSigners = (sectionName, section) => {
  /** @const {string} */
  const h = hash(sectionName, section);
  /** @const {!Array<string>} */
  const signers = section.secp256k1.map((signature) =>
    evm.signerAddress(h, signature));
  return [...new Set(signers)];
}

/**
 * @param {string} sectionName
 * @param {!did.Section} section
 * @param {string} commitment
 * @param {number} signatureTs
 * @param {!bigint} privateKey
 */
const signSection = (sectionName, section, commitment, signatureTs, privateKey) => {
  section.commitment = commitment;
  section.signatureTs = signatureTs;
  /** @const {!bigint} */
  const d = BigInt("0x" + hash(sectionName, section));
  let { r, s, yParity } = sign(d, privateKey);
  if (yParity) s += (1n << 255n);
  section.secp256k1 = [evm.uint256(r) + evm.uint256(s)];
}

export {
  hash,
  recoverSectionSigners,
  signSection,
};
