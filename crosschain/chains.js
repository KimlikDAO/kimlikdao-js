/** @enum {string} */
const ChainId = {
  x1: "0x1",
  x144: "0x144",
  x38: "0x38",
  x406: "0x406",
  x89: "0x89",
  xa4b1: "0xa4b1",
  xa86a: "0xa86a",
  xfa: "0xfa",
  MinaBerkeley: "m:berkeley",
  MinaMainnet: "m:mainnet",
};

/** @enum {string} */
const ChainGroup = {
  EVM: "0x",
  MINA: "m:"
};

/**
 * Avoid using `Object.values(ChainGroup)` to iterate and instead prefer
 * iterating over this array. This way the `ChainGroup` enum can be completely
 * optimized away.
 *
 * @const {!Array<ChainGroup>}
 */
const ChainGroups = [ChainGroup.EVM, ChainGroup.MINA];

export {
  ChainGroup,
  ChainGroups,
  ChainId
};
