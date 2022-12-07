/**
 * @fileoverview Info section manipulation tools.
 *
 * @author KimlikDAO
 */

import { decryptUnlockable } from "../ethereum/unlockables";

/**
 * Given an array of `InfoSection`s, determines a minimal set of unlockables
 * which, when unlocked, would cover all the desired `InfoSection`'s.
 *
 * @param {!eth.ERC721Unlockable} nft
 * @param {!Array<string>} infoSections
 * @return {!Array<!eth.Unlockable>}
 */
const selectUnlockables = (nft, infoSections) => {
  if (nft.unlockable)
    return [nft.unlockable];
  if (!nft.unlockables)
    return [];
  if (nft.unlockables.length <= 1)
    return Object.values(nft.unlockables);

  // If there is a solution with 1 or 2 unlockables, we'll find the optimal
  // solution using exhaustive search, which takes O(n^2) time where
  // `n = |nft.unlockables|`. Otherwise, we'll resort to a greedy approach.
  /** @const {Set<string>} */
  const iss = new Set(infoSections);

  /**
   * @const {Array<{
   *   inc: !Set<string>,
   *   exc: !Set<string>,
   *   unlockable: !eth.Unlockable
   * }>}
   */
  const arr = [];
  {
    /** @type {number} */
    let bestI = -1;
    /** @type {number} */
    let bestExc = 1e9;
    for (const key in nft.unlockables) {
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
      arr.push({
        inc,
        exc,
        unlockable: nft.unlockables[key]
      });
    }
    // There is a solution with 1 unlockable.
    if (bestI >= 0)
      return [arr[bestI].unlockable];
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
      if (infoSections.every((x) => arr[i].inc.has(x) || arr[j].inc.has(x))) {
        const exc = score(arr[i].exc, arr[j].exc);
        if (exc < bestExc) {
          bestI = i;
          bestJ = j;
          bestExc = exc;
        }
      }
  // There is a solution with 2 unlockables.
  if (bestI >= 0)
    return [arr[bestI].unlockable, arr[bestJ].unlockable];

  // Since there are no solutions with 1 or 2 unlockables, we'll resort to a
  // greedy algorithm.
  arr.sort((a, b) => (b.inc.size - b.exc.size) - (a.inc.size - a.exc.size));
  /** @const {!Array<!eth.Unlockable>} */
  const res = [];
  for (const entry of arr) {
    if (!iss.size) break;
    /** @type {boolean} */
    let helpful = false;
    for (const elm of entry.inc)
      helpful |= iss.delete(elm);
    if (helpful)
      res.push(entry.unlockable);
  }
  return res;
}

/**
 * @param {!eth.ERC721Unlockable} unlockableNft
 * @param {!Array<string>} infoSections
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {Promise<did.DecryptedInfos>}
 */
const decryptInfoSections = async (unlockableNft, infoSections, provider, address) => {
  /** @const {!Array<!eth.Unlockable>} */
  const unlockables = selectUnlockables(unlockableNft, infoSections);

  /** @type {!did.DecryptedInfos} */
  let decryptedInfos = {};

  for (let i = 0; i < unlockables.length; ++i) {
    if (i > 0)
      await new Promise((resolve) => setTimeout(() => resolve(), 100));
    /** @type {!did.EncryptedInfos} */
    const encryptedInfos = /** @type {!did.EncryptedInfos} */(unlockables[i]);
    delete encryptedInfos.merkleRoot;
    /** @const {?string} */
    const decryptedText = await decryptUnlockable(encryptedInfos, provider, address);
    if (decryptedText)
      Object.assign(decryptedInfos,
        /** @type {!did.DecryptedInfos} */(JSON.parse(decryptedText)));
  }
  /** @const {Set<string>} */
  const infoSectionSet = new Set(infoSections);
  for (const infoSection in decryptedInfos)
    if (!infoSectionSet.has(infoSection)) delete decryptedInfos[infoSection];
  return decryptedInfos;
}

/**
 * @param {!eth.ERC721Unlockable} unlockableNft
 * @param {!Array<string>} infoSections
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {Promise<{
 *   decryptedInfos: did.DecryptedInfos,
 *   merkleProof: !Object<string, string>
 * }>}
 */
const decryptInfoSectionWithProof = async (unlockableNft, infoSections, provider, address) => {
  return Promise.reject();
}

/**
 * @param {!did.InfoSection} infoSection
 * @return {string}
 */
const completeHash = (infoSection) => "0";

export {
  completeHash,
  decryptInfoSections,
  decryptInfoSectionWithProof,
  selectUnlockables
};
