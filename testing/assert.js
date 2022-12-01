let TrueAsserts = 0;
let FalseAsserts = 0;

const updateCounters = (value) => value ? TrueAsserts += 1 : FalseAsserts += 1;

/**
 * @param {boolean} value
 * @return {boolean}
 */
const assert = (value) => {
  updateCounters(value);
  if (!value) {
    console.error("Hata");
  }
  return value;
}

/**
 * @template T
 * @param {T} given
 * @param {T} expected
 * @return {boolean}
 */
const assertEq = (given, expected) => {
  /** @const {boolean} */
  const value = given == expected;
  updateCounters(value);
  if (!value) {
    console.error(`Hata: beklenen ${expected}`);
    console.error(`       verilen ${given}`);
  }
  return value;
}

/**
 * @template T
 * @param {Array<T>} given
 * @param {Array<T>} expected
 * @return {boolean}
 */
const assertElemEq = (given, expected) => {
  /** @const {Set<T>} */
  const expectSet = new Set(expected);
  /** @const {boolean} */
  const value = given.length == expectSet.size && given.every((x) => expectSet.has(x));
  updateCounters(value);
  if (!value) {
    given.forEach((e) => {
      if (!expectSet.has(e)) console.log(`Hata: fazladan eleman ${e}`);
    });
  }
  return value;
}

const assertStats = () => {
  const color = FalseAsserts == 0 ? "\x1b[42m" : "\x1b[41m";
  console.log(`${color}${TrueAsserts} / ${TrueAsserts + FalseAsserts} assers true\x1b[0m`);
}

export {
  assert,
  assertEq,
  assertElemEq,
  assertStats,
};
