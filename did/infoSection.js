/**
 * @fileoverview Info section manipulation tools.
 *
 * @author KimlikDAO
 */

/**
 * Given an array of `InfoSection`s, determines a minimal set of unlockables
 * which, when unlocked, would cover all the desired `InfoSection`'s.
 *
 * @param {!ERC721Unlockable} nft
 * @param {!Array<string>} infoSections
 * @return {!Array<!Unlockable>}
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
   *   unlockable: !Unlockable
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
  /** @const {!Array<!Unlockable>} */
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

export { selectUnlockables };
