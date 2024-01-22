import { ChainId } from "../crosschain/chainId";
import { address, callMethod, isNonzero } from "./provider";

/** @const {!Array<string>} */
const TCKT_ADDRS = [
  "0xcCc0a9b023177549fcf26c947edb5bfD9B230cCc", // All EVM chains except zkSync Era.
  "0xcCc053d81e3B85Eac133a5333be4D7cBDd120cCc", // zkSync Era
];

/**
 * @param {ChainId} chainId
 * @return {string} TCKT contract address
 */
const getAddress = (chainId) => TCKT_ADDRS[+(chainId == ChainId.x144)];

/**
 * @param {!eth.Provider} provider
 * @param {ChainId} chainId
 * @param {string} addr
 * @return {!Promise<string>}
 */
const handleOf = (provider, chainId, addr) =>
  callMethod(provider, getAddress(chainId), "0xc50a1514" + address(addr));

/**
 * @param {!eth.Provider} provider
 * @param {ChainId} chainId
 * @param {string} addr
 * @return {!Promise<boolean>}
 */
const hasDID = (provider, chainId, addr) => handleOf(provider, chainId, addr).then(isNonzero);

export default {
  getAddress,
  handleOf,
  hasDID,
};
