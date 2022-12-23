/**
 * @fileoverview Info section manipulation tools.
 *
 * @author KimlikDAO
 */

import { sign } from "../crypto/secp256k1";
import { keccak256, keccak256Uint32 } from "../crypto/sha3";
import evm from "../ethereum/evm";
import { decryptUnlockable } from "../ethereum/unlockables";
import { hex, uint8ArrayeBase64ten } from "../util/çevir";

/**
 * Given an array of `EncryptedInfos` keys, determines a minimal set of
 * `EncryptedInfos` which, when unlocked, would cover all the desired
 * `InfoSection`'s.
 *
 * The selected unlockables are returned as an array of values from the
 * `unlockableKeys` array.
 *
 * @param {!Array<string>} encryptedInfosKeys
 * @param {!Array<string>} infoSectionKeys
 * @return {!Array<string>} unlockable keys which together have all the desired
 *                         `InfoSection`s.
 */
const selectEncryptedInfos = (encryptedInfosKeys, infoSectionKeys) => {
  // If there is a solution with 1 or 2 unlockables, we'll find the optimal
  // solution using exhaustive search, which takes O(n^2) time where
  // `n = |nft.unlockables|`. Otherwise, we'll resort to a greedy approach.
  /** @const {Set<string>} */
  const iss = new Set(infoSectionKeys);

  /**
   * @const {Array<{
   *   key: string,
   *   inc: !Set<string>,
   *   exc: !Set<string>,
   * }>}
   */
  const arr = [];
  {
    /** @type {number} */
    let bestI = -1;
    /** @type {number} */
    let bestExc = 1e9;
    for (const key of encryptedInfosKeys) {
      /** @const {!Array<string>} */
      const sections = key.split(",");
      /** @const {!Set<string>} */
      const inc = new Set(sections.filter((e) => iss.has(e)));
      /** @const {!Set<string>} */
      const exc = new Set(sections.filter((e) => !iss.has(e)));
      if (inc.size == iss.size && exc.size < bestExc) {
        bestI = arr.length;
        bestExc = exc.size;
      }
      arr.push({ key, inc, exc });
    }
    // There is a solution with 1 unlockable.
    if (bestI >= 0)
      return [arr[bestI].key];
  }

  /**
   * Calculates 100 * |A \cup B| + |A| + |B|.
   *
   * @param {Set<string>} A
   * @param {Set<string>} B
   * @return {number}
   */
  const score = (A, B) => {
    /** @type {number} */
    let count = 101 * (A.size + B.size);
    for (const b of B)
      count -= +A.has(b) * 100;
    return count;
  }

  /** @const {number} */
  const n = arr.length;
  /** @type {number} */
  let bestI = -1;
  /** @type {number} */
  let bestJ = -1;
  /** @type {number} */
  let bestExc = 1e9;
  for (let i = 0; i < n; ++i)
    for (let j = i + 1; j < n; ++j)
      if (infoSectionKeys.every((x) => arr[i].inc.has(x) || arr[j].inc.has(x))) {
        const exc = score(arr[i].exc, arr[j].exc);
        if (exc < bestExc) {
          bestI = i;
          bestJ = j;
          bestExc = exc;
        }
      }
  // There is a solution with 2 unlockables.
  if (bestI >= 0)
    return [arr[bestI].key, arr[bestJ].key];

  // Since there are no solutions with 1 or 2 unlockables, we'll resort to a
  // greedy algorithm.
  arr.sort((a, b) => (b.inc.size - b.exc.size) - (a.inc.size - a.exc.size));
  /** @const {!Array<string>} */
  const res = [];
  for (const entry of arr) {
    if (!iss.size) break;
    /** @type {boolean} */
    let helpful = false;
    for (const elm of entry.inc)
      helpful |= iss.delete(elm);
    if (helpful)
      res.push(entry.key);
  }
  return res;
}

/**
 * @param {!eth.ERC721Unlockable} nft
 * @param {!Array<string>} infoSections
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {Promise<!did.DecryptedInfos>}
 */
const decryptInfoSections = async (nft, infoSections, provider, address) => {
  /** @const {!Array<string>} */
  const encryptedInfosKeys = selectEncryptedInfos(
    Object.keys(nft.unlockables),
    infoSections
  );

  /** @const {!did.DecryptedInfos} */
  const decryptedInfos = {};

  for (let i = 0; i < encryptedInfosKeys.length; ++i) {
    if (i > 0)
      await new Promise((resolve) => setTimeout(() => resolve(), 100));
    /** @type {!did.EncryptedInfos} */
    const encryptedInfos = /** @type {!did.EncryptedInfos} */(
      nft.unlockables[encryptedInfosKeys[i]]);
    delete encryptedInfos.merkleRoot;
    /** @const {?string} */
    const decryptedText = await decryptUnlockable(encryptedInfos, provider, address);
    if (decryptedText)
      Object.assign(decryptedInfos,
        /** @type {!did.DecryptedInfos} */(JSON.parse(decryptedText)));
  }
  /** @const {!Set<string>} */
  const infoSectionSet = new Set(infoSections);
  for (const infoSection in decryptedInfos)
    if (!infoSectionSet.has(infoSection)) delete decryptedInfos[infoSection];
  return decryptedInfos;
}

/** @const {string} */
const KIMLIKDAO_HASH_PREFIX = "\x19KimlikDAO hash";

/**
 * @param {string} infoSectionName
 * @param {!did.InfoSection} infoSection
 * @return {string}
 */
const hash = (infoSectionName, infoSection) => {
  if (infoSectionName == "exposureReportID") {
    /** @const {!did.ExposureReportID} */
    const exposureReportID = /** @type {!did.ExposureReportID} */(infoSection);
    /** @const {!Uint8Array} */
    const buff = new Uint8Array(64);
    new TextEncoder().encodeInto(KIMLIKDAO_HASH_PREFIX, buff);
    uint8ArrayeBase64ten(buff.subarray(32), exposureReportID.id);
    return hex(keccak256Uint32(new Uint32Array(buff.buffer)));
  }
  /** @const {Set<string>} */
  const notHashed = new Set(["secp256k1", "bls12_381"]);
  return keccak256(
    KIMLIKDAO_HASH_PREFIX + JSON.stringify(infoSection,
      Object.keys(infoSection).filter((x) => !notHashed.has(x)).sort())
  );
}

/**
 * @param {string} infoSectionName
 * @param {!did.InfoSection} infoSection
 * @param {number} signatureTs
 * @param {!bigint} privateKey
 */
const signInfoSection = (infoSectionName, infoSection, signatureTs, privateKey) => {
  infoSection.signatureTs = signatureTs;
  /** @const {!bigint} */
  const d = BigInt("0x" + hash(infoSectionName, infoSection));
  let { r, s, yParity } = sign(d, privateKey);
  if (yParity) s += (1n << 255n);
  infoSection.secp256k1 = [evm.uint256(r) + evm.uint256(s)];
}

/**
 * @param {string} infoSectionName
 * @param {!did.InfoSection} infoSection
 * @return {!Array<string>}
 */
const recoverInfoSectionSigners = (infoSectionName, infoSection) => {
  /** @const {string} */
  const h = hash(infoSectionName, infoSection);
  return infoSection.secp256k1.map((signature) => evm.signerAddress(h, signature));
}

/**
 * Signs a give `did.DecryptedInfos` in-place.
 *
 * @param {!did.DecryptedInfos} decryptedInfos
 * @param {number} signatureTs
 * @param {!bigint} privateKey
 * @return {!did.DecryptedInfos}
 */
const signDecryptedInfos = (decryptedInfos, signatureTs, privateKey) => {
  for (const key in decryptedInfos)
    signInfoSection(key, decryptedInfos[key], signatureTs, privateKey);
  return decryptedInfos;
}

export {
  decryptInfoSections,
  hash,
  recoverInfoSectionSigners,
  selectEncryptedInfos,
  signDecryptedInfos,
  signInfoSection,
};
