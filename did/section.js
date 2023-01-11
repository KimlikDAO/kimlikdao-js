/**
 * @fileoverview `did.Section` implementation and manipulation function.
 *
 * @author KimlikDAO
 */

import { sign } from "../crypto/secp256k1";
import { keccak256, keccak256Uint32 } from "../crypto/sha3";
import evm from "../ethereum/evm";
import { decryptUnlockable } from "../ethereum/unlockables";
import { hex, hexten, uint8ArrayeBase64ten } from "../util/çevir";

/**
 * Given an array of `did.EncryptedSections` keys, determines a minimal set of
 * `did.EncryptedSections` keys which, when unlocked, would cover all the
 * desired `did.Section`'s.
 *
 * The selected unlockables are returned as an array of values from the
 * `encryptedSectionKeys` array.
 *
 * @param {!Array<string>} encryptedSectionsKeys
 * @param {!Array<string>} sectionKeys
 * @return {!Array<string>} unlockable keys which together have all the desired
 *                         `did.Section`s.
 */
const selectEncryptedSections = (encryptedSectionsKeys, sectionKeys) => {
  // If there is a solution with 1 or 2 unlockables, we'll find the optimal
  // solution using exhaustive search, which takes O(n^2) time where
  // `n = |nft.unlockables|`. Otherwise, we'll resort to a greedy approach.
  /** @const {Set<string>} */
  const sks = new Set(sectionKeys);

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
    for (const key of encryptedSectionsKeys) {
      /** @const {!Array<string>} */
      const sections = key.split(",");
      /** @const {!Set<string>} */
      const inc = new Set(sections.filter((e) => sks.has(e)));
      /** @const {!Set<string>} */
      const exc = new Set(sections.filter((e) => !sks.has(e)));
      if (inc.size == sks.size && exc.size < bestExc) {
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
      if (sectionKeys.every((x) => arr[i].inc.has(x) || arr[j].inc.has(x))) {
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
    if (!sks.size) break;
    /** @type {boolean} */
    let helpful = false;
    for (const elm of entry.inc)
      helpful |= sks.delete(elm);
    if (helpful)
      res.push(entry.key);
  }
  return res;
}

/**
 * @param {!eth.ERC721Unlockable} nft
 * @param {!Array<string>} sectionNames
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {!Promise<!did.DecryptedSections>}
 */
const decryptSections = async (nft, sectionNames, provider, address) => {
  /** @const {!Array<string>} */
  const encryptedSectionsKeys = selectEncryptedSections(
    Object.keys(nft.unlockables),
    sectionNames
  );

  /** @const {!did.DecryptedSections} */
  const decryptedSections = {};

  for (let i = 0; i < encryptedSectionsKeys.length; ++i) {
    if (i > 0)
      await new Promise((resolve) => setTimeout(() => resolve(), 100));
    /** @type {!did.EncryptedSections} */
    const encryptedSections = /** @type {!did.EncryptedSections} */(
      nft.unlockables[encryptedSectionsKeys[i]]);
    delete encryptedSections.merkleRoot;
    /** @const {?string} */
    const decryptedText = await decryptUnlockable(encryptedSections, provider, address);
    if (decryptedText)
      Object.assign(decryptedSections,
        /** @type {!did.DecryptedSections} */(JSON.parse(decryptedText)));
  }
  /** @const {!Set<string>} */
  const sectionNamesSet = new Set(sectionNames);
  for (const section in decryptedSections)
    if (!sectionNamesSet.has(section)) delete decryptedSections[section];
  return decryptedSections;
}

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

/**
 * Signs a given `did.DecryptedSections` in-place.
 *
 * @param {!did.DecryptedSections} decryptedSections
 * @param {string} commitment
 * @param {number} signatureTs
 * @param {!bigint} privateKey
 * @return {!did.DecryptedSections}
 */
const signDecryptedSections = (decryptedSections, commitment, signatureTs, privateKey) => {
  for (const key in decryptedSections)
    signSection(key, decryptedSections[key], commitment, signatureTs, privateKey);
  return decryptedSections;
}

export {
  decryptSections,
  hash,
  recoverSectionSigners,
  selectEncryptedSections,
  signDecryptedSections,
  signSection,
};
