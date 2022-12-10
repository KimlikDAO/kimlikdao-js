/**
 * @fileoverview Info section manipulation tools.
 *
 * @author KimlikDAO
 */

import { keccak256, keccak256Uint32, keccak256Uint8 } from "../crypto/sha3";
import { decryptUnlockable } from "../ethereum/unlockables";
import { base64, base64ten, hex } from "../util/çevir";

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
 * @param {!Object<string, !did.EncryptedInfos>} encryptedInfosMap
 * @param {!Array<string>} infoSections
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {Promise<{
 *   decryptedInfos: !did.DecryptedInfos,
 *   merkleProof: !did.MerkleProof
 * }>}
 */
const decryptInfosWithMerkleProof = async (encryptedInfosMap, infoSections, provider, address) => {
  /** @const {!Array<string>} */
  const encryptedInfosKeys = selectEncryptedInfos(
    Object.keys(encryptedInfosMap),
    infoSections
  );

  /** @const {!TextEncoder} */
  const encoder = new TextEncoder();
  /** @const {!did.DecryptedInfos} */
  const decryptedInfos = {};
  /** @const {!did.MerkleProof} */
  const merkleProof = {};
  for (let i = 0; i < encryptedInfosKeys.length; ++i) {
    const key = encryptedInfosKeys[i];
    if (i > 0)
      await new Promise((resolve) => setTimeout(() => resolve(), 100));
    /** @type {!did.EncryptedInfos} */
    const encryptedInfos = encryptedInfosMap[key];
    delete encryptedInfos.merkleRoot;
    /** @const {?string} */
    const decryptedText = await decryptUnlockable(encryptedInfos, provider, address);
    if (!decryptedText) continue;
    /** @const {!did.DecryptedInfos} */
    const decrypted = /** @type {!did.DecryptedInfos} */(JSON.parse(decryptedText));
    Object.assign(decryptedInfos, decrypted);

    /** @const {!Array<string>} */
    const keys = Object.keys(decrypted).sort();
    /** @const {!Uint8Array} */
    const buff = new Uint8Array(keys.length << 5);
    for (let i = 0; i < keys.length; ++i) {
      const infoSection = decrypted[keys[i]];
      buff.set(keccak256Uint8(encoder.encode(
        JSON.stringify(infoSection, Object.keys(infoSection).sort()))), i << 5);
    }
    merkleProof[key] = base64(buff);
  }
  /** @const {!Set<string>} */
  const infoSectionSet = new Set(infoSections);
  for (const infoSection in decryptedInfos)
    if (!infoSectionSet.has(infoSection)) delete decryptedInfos[infoSection];
  return { decryptedInfos, merkleProof };
}

/**
 * @param {!did.MerkleProof} merkleProof
 * @param {!Object<string, !did.EncryptedInfos>} encryptedInfosMap
 * @param {!did.DecryptedInfos} decryptedInfos
 * @return {boolean}
 */
const verifyMerkleProof = (merkleProof, encryptedInfosMap, decryptedInfos) => {
  /** @const {!Set<string>} */
  const hashes = new Set();

  for (const key in merkleProof) {
    /** @const {!Uint8Array} */
    const proof = base64ten(merkleProof[key]);

    if (proof.length > 32 * key.split(",").length)
      return false;

    /** @const {string} */
    const hash = base64(keccak256Uint32(new Uint32Array(proof.buffer)));

    if (encryptedInfosMap[key].merkleRoot != hash)
      return false;

    for (let i = 0; i < proof.length; i += 32)
      hashes.add(hex(proof.subarray(i, i + 32)));
  }

  for (const key in decryptedInfos)
    if (!hashes.has(completeHash(decryptedInfos[key])))
      return false;
  return true;
}

/**
 * Hashes an `InfoSection` including the signature timestamp and keys.
 *
 * @param {!did.InfoSection} infoSection
 * @return {string} hex encoded hash of the `InfoSection`.
 */
const completeHash = (infoSection) => keccak256(
  JSON.stringify(infoSection, Object.keys(infoSection).sort())
);

export {
  completeHash,
  decryptInfosWithMerkleProof,
  selectEncryptedInfos,
  verifyMerkleProof,
};
