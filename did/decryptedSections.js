import { decrypt } from "../ethereum/unlockable";
import { hash, recoverSectionSigners, signSection } from "./section";

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
  /** @const {!Set<string>} */
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
   * @param {!Set<string>} A
   * @param {!Set<string>} B
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
      helpful ||= sks.delete(elm);
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
const fromUnlockableNFT = async (nft, sectionNames, provider, address) => {
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
    const decryptedText = await decrypt(encryptedSections, provider, address);
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

/**
 * Signs a given `did.DecryptedSections` in-place.
 *
 * @param {!did.DecryptedSections} decryptedSections
 * @param {string} commitment
 * @param {string} commitmentAnon
 * @param {number} signatureTs
 * @param {!bigint} privateKey
 * @return {!did.DecryptedSections}
 */
const sign = (decryptedSections, commitment, commitmentAnon, signatureTs, privateKey) => {
  for (const key in decryptedSections)
    signSection(key, decryptedSections[key],
      key == "humanID" ? commitmentAnon : commitment,
      signatureTs, privateKey
    );
  return decryptedSections;
}

/**
 * Given a `did.DecryptedSections` outputs a map from section name to list of
 * signers.
 *
 * @param {!did.DecryptedSections} decryptedSections containing commitmentR
 *                                                   values.
 * @param {string} ownerAddress starting with 0x.
 * @return {!did.SignersPerSection} signers per section.
 */
const recoverSigners = (decryptedSections, ownerAddress) => {
  /** @const {!did.SignersPerSection} */
  const signerPerSection = {};
  for (const key in decryptedSections)
    signerPerSection[key] = recoverSectionSigners(key, decryptedSections[key], ownerAddress);
  return signerPerSection;
}

/**
 * @param {!Array<!did.DecryptedSections>} decryptedSectionsList
 * @param {string} commitmentR
 * @param {string} commitmentAnonR
 * @param {number} signerCountNeeded
 * @return {!did.DecryptedSections}
 */
const combineMultiple = (
  decryptedSectionsList,
  commitmentR,
  commitmentAnonR,
  signerCountNeeded
) => {
  /** @const {!did.DecryptedSections} */
  const combined = {};
  if (decryptedSectionsList.length < signerCountNeeded)
    return combined;

  /** @const {!Set<string>} */
  const sectionNames = new Set();

  for (const decryptedSections of decryptedSectionsList)
    for (const key in decryptedSections)
      sectionNames.add(key);

  for (const key of sectionNames) {
    /** @const {!Object<string, !Array<!did.Section>>} */
    const hashToSections = {};
    for (const decryptedSections of decryptedSectionsList)
      if (key in decryptedSections
        && decryptedSections[key].secp256k1
        && decryptedSections[key].secp256k1.length) {
        const h = hash(key, decryptedSections[key]);
        (hashToSections[h] ||= []).push(decryptedSections[key]);
      }
    /**
     * Find the most frequent hash group.
     *
     * @type {!Array<!did.Section>}
     */
    let mostFreq = []
    for (const h in hashToSections)
      if (hashToSections[h].length > mostFreq.length)
        mostFreq = hashToSections[h];
    if (mostFreq.length >= signerCountNeeded) {
      combined[key] = mostFreq[0];
      combined[key].commitmentR = key == "humanID"
        ? commitmentAnonR : commitmentR;
      delete combined[key].commitment;
      for (let i = 1; i < mostFreq.length; ++i)
        combined[key].secp256k1.push(
          .../** @type {!Array<string>} */(mostFreq[i].secp256k1));
    }
  }
  return combined;
}

export {
  combineMultiple,
  fromUnlockableNFT,
  recoverSigners,
  selectEncryptedSections,
  sign,
};
