/** @const {string} */
const TCKT_ADDR = "0xcCc0a9b023177549fcf26c947edb5bfD9B230cCc";

/**
 * @param {!eth.Provider} provider
 * @param {string} contract Contract adddress given with the 0x prefix
 * @param {string} calldata Calldata transmitted to the contract verbatim.
 * @return {!Promise<string>}
 */
const callMethod = (provider, contract, calldata) =>
  provider.request(/** @type {!eth.Request} */({
    method: "eth_call",
    params: [/** @type {!eth.Transaction} */({
      to: contract,
      data: calldata
    }), "latest"]
  }))

/**
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {!Promise<string>}
 */
const handleOf = (provider, address) =>
  callMethod(provider, TCKT_ADDR, "0xc50a1514" + "0".repeat(24) + address.slice(2).toLowerCase());

/**
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {!Promise<boolean>}
 */
const hasDID = (provider, address) =>
  handleOf(provider, address).then((hexCid) => hexCid.replaceAll("0", "") != "x");

export { TCKT_ADDR };

export default {
  handleOf,
  hasDID,
};
