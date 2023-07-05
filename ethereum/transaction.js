/**
 * @param {string} txHash
 * @param {function()} then
 */
const whenMined = (txHash, then) => {
  const interval = setInterval(() =>
    ethereum.request(/** @type {!eth.Request} */({
      method: "eth_getTransactionReceipt",
      params: [txHash]
    }))
      .then((receipt) => {
        if (receipt) {
          clearInterval(interval);
          then();
        }
      }),
    1000);
}

export { whenMined };
