import { address, callMethod, isNonzero } from "/lib/ethereum/provider";

/** @const {string} */
const TCKT_ADDR = "0xcCc0a9b023177549fcf26c947edb5bfD9B230cCc";

/**
 * @param {!eth.Provider} provider
 * @param {string} addr
 * @return {!Promise<string>}
 */
const handleOf = (provider, addr) =>
  callMethod(provider, TCKT_ADDR, "0xc50a1514" + address(addr));

/**
 * @param {!eth.Provider} provider
 * @param {string} addr
 * @return {!Promise<boolean>}
 */
const hasDID = (provider, addr) => handleOf(provider, addr).then(isNonzero);

export { TCKT_ADDR };

export default {
  handleOf,
  hasDID,
};
