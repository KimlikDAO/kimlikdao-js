/**
 * @fileoverview TCKT akıllı sözleşmesinin js önyüzu.
 */
import evm from './evm';
import { keccak256Uint32 } from './sha3';

/**
 * @const {string}
 * @noinline
 */
export const TCKT_ADDR = "0xcCc0F938A2C94b0fFBa49F257902Be7F56E62cCc";

/** @const {number} */
const MILLION = 1000_000;

/** @const {!bigint} */
const TRILLION = 1_000_000n * 1_000_000n;

/** @const {Object<string,Array<Array<string>>>} */
const TokenData = {
  "0x1": [
    [""],
    ["dAC17F958D2ee523a2206206994597C13D831ec7", "Tether USD", 6, 0],
    ["A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USD Coin", 6, 2],
    ["2C537E5624e4af88A7ae4060C022609376C8D0EB", "BiLira", 6, 0],
  ],
  "0xa86a": [
    [""],
    ["9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", "TetherToken", 6, 1],
    ["B97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", "USD Coin", 6, 2],
    ["564A341Df6C126f90cf3ECB92120FD7190ACb401", "BiLira", 6, 2],
  ],
  "0x89": [
    [""],
    ["c2132D05D31c914a87C6611C10748AEb04B58e8F", "(PoS) Tether USD", 6, 0],
    ["2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "USD Coin (PoS)", 6, 1],
    ["4Fb71290Ac171E1d144F7221D882BECAc7196EB5", "BiLira", 6, 0],
  ],
  "0xa4b1": [
    [""],
    ["Fd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", "Tether USD", 6, 1],
    ["FF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "USD Coin (Arb1)", 6, 1],
    [""]
  ],
  "0xfa": [
    [""],
    [""],
    ["04068DA6C83AFCFA0e13ba15A6696662335D5B75", "USD Coin", 6, 1],
    [""],
  ]
};

/**
 * @param {string} chainId
 * @param {string} address
 * @param {string} value value in native tokens, encoded as a hex string.
 * @param {string} calldata hex encoded calldata.
 * @return {Promise<*>}
 */
const sendTransaction = (chainId, address, value, calldata) => {
  const tx = /** @type {Transaction} */({
    to: TCKT_ADDR,
    from: address,
    value: "0x" + value,
    data: calldata,
    chainId: chainId,
  });
  return ethereum.request(/** @type {RequestParams} */({
    method: "eth_sendTransaction",
    params: [tx]
  }))
}

const addToWallet = () =>
  ethereum.request(/** @type {RequestParams} */({
    method: 'wallet_watchAsset',
    params: /** @type {WatchAssetParams} */({
      type: 'ERC721',
      options: {
        address: TCKT_ADDR,
        symbol: 'TCKT',
        decimals: "0",
      }
    }),
  }))

/**
 * @param {number} order The variable order of the mapping.
 * @param {string} address The key for an address keyed mapping.
 */
const getFromMapping = (order, address) => {
  const buff = new Uint8Array(64);
  buff[63] = order;
  for (let i = 1; i <= 20; ++i)
    buff[i + 11] = parseInt(address.substring(2 * i, 2 * i + 2), 16);
  return ethereum.request(/** @const {RequestParams} */({
    method: "eth_getStorageAt",
    params: [TCKT_ADDR, "0x" + keccak256Uint32(new Uint32Array(buff.buffer)), "latest"]
  }));
}

/**
 * @param {string} address
 * @return {Promise<string>}
 */
const handleOf = (address) => getFromMapping(0, address);

/**
 * @param {string} address
 * @return {Promise<number>}
 */
const revokesRemaining = (address) => getFromMapping(2, address)
  .then((revokes) => parseInt(revokes.slice(-4), 16));

/**
 * @param {string} chainId
 * @param {string} address
 * @param {number} deltaWeight
 * @return {Promise<*>}
 */
const reduceRevokeThreshold = (chainId, address, deltaWeight) =>
  sendTransaction(chainId, address, "0", "0xab505b1c" + evm.uint256(deltaWeight));

/**
 * @param {string} chainId
 * @param {string} address
 * @param {number} deltaWeight revoker weight.
 * @param {string} revokerAddress revoker address.
 * @return {Promise<*>}
 */
const addRevoker = (chainId, address, deltaWeight, revokerAddress) =>
  sendTransaction(chainId, address, "0",
    "0xf02b3297" + evm.uint96(deltaWeight) + revokerAddress.slice(2).toLowerCase());

const revoke = (chainId, address) =>
  sendTransaction(chainId, address, "0", "0xb6549f75");

/**
 * @param {string} chainId
 * @param {string} address
 * @param {string} cid
 * @param {number} revokeThreshold
 * @param {Object<string, number>} revokers
 * @return {Promise<*>}
 */
const createWithRevokers = (chainId, address, cid, revokeThreshold, revokers) =>
  priceIn(chainId, 0).then(([high, low]) => {
    const price = (TRILLION * BigInt(revokeThreshold == 0 ? high : low)).toString(16);
    return revokeThreshold == 0
      ? sendTransaction(chainId, address, price, "0x780900dc" + cid)
      : sendTransaction(chainId, address, price, "0xd3cfebc1" + cid +
        serializeRevokers(revokeThreshold, revokers));
  });

/**
 * @param {number} revokeThreshold The threshold for vote weight after which
 *                                 the TCKT is revoked.
 * @param {Object<string, number>} revokers (Address, weight) pairs for the
 *                                          revokers.
 */
const serializeRevokers = (revokeThreshold, revokers) => {
  /** @type {string} */
  let ser = "";
  /** @type {number} */
  let count = 0;
  for (let address in revokers) {
    if (address === "length") continue;
    count += 1;
    ser += evm.uint96(revokers[address]) + address.slice(2).toLowerCase();
  }
  ser += evm.uint256(0).repeat(5 - count);
  return evm.uint64(revokeThreshold) + ser.slice(16);
}

/**
 * @param {string} cid
 * @param {number} revokeThreshold
 * @param {Object<string, number>} revokers
 * @return {Promise<*>}
 */
const createWithRevokersWithTokenPermit =
  (chainId, address, cid, revokeThreshold, revokers, signature) => revokeThreshold == 0
    ? sendTransaction(chainId, address, "0", "0xb744aef4" + cid + signature)
    : sendTransaction(chainId, address, "0", "0xa6c98d44" + cid +
      serializeRevokers(revokeThreshold, revokers) + signature);

/**
 * @param {number} token
 * @return {Promise<!Array<number>>} price of TCKT in the given currency
 */
const priceIn = (chainId, token) => {
  const chain = chainId;
  const fiyat = {
    "0x1": [600, 1 * MILLION, 1 * MILLION, 19 * MILLION],
    "0xa86a": [40000, 1 * MILLION, 1 * MILLION, 19 * MILLION],
    "0x89": [1010000, 1 * MILLION, 1 * MILLION, 19 * MILLION],
    "0xa4b1": [600, 1 * MILLION, 1 * MILLION, 19 * MILLION],
    "0xfa": [3000000, 1 * MILLION, 1 * MILLION, 19 * MILLION]
  }
  return Promise.resolve([
    fiyat[chain][token] * 1.5, fiyat[chain][token]
  ]);
}

/**
 * @return {Promise<number>}
 */
const estimateNetworkFee = (chainId) => {
  const hack = {
    "0x1": 600,
    "0xa86a": 800,
    "0x89": 400,
    "0xa4b1": 200,
    "0xfa": 200
  }
  return Promise.resolve(hack[chainId]);
}

/**
 * @return {number}
 */
const getDeadline = () => {
  return Math.trunc(Date.now() / 1000) + 20 * 60;
}

/**
 * @param {string} chainId       chainId for the chain we want the permit for
 * @param {string} address       Permit should be issues to this address.
 * @param {number} token         dApp internal currency code, currently in
 *                               [1..3].
 * @param {boolean} withRevokers Whether the user has set up valid revokers to
 *                               qualify for a discount.
 * @return {Promise<string>}     Calldata serialized permission.
 */
const getPermitFor = (chainId, address, token, withRevokers) =>
  priceIn(chainId, token).then((price) => {
    const deadline = evm.uint96(getDeadline());
    const tokenData = TokenData[chainId][token];
    const typedSignData = JSON.stringify({
      "types": {
        "EIP712Domain": [
          { "name": "name", "type": "string" },
          { "name": "version", "type": "string" },
          { "name": "chainId", "type": "uint256" },
          { "name": "verifyingContract", "type": "address" },
        ],
        "Permit": [
          { "name": "owner", "type": "address" },
          { "name": "spender", "type": "address" },
          { "name": "value", "type": "uint256" },
          { "name": "nonce", "type": "uint256" },
          { "name": "deadline", "type": "uint256" }
        ]
      },
      "domain": {
        "name": tokenData[1],
        "version": "" + tokenData[3],
        "chainId": chainId,
        "verifyingContract": "0x" + tokenData[0]
      },
      "primaryType": "Permit",
      "message": {
        "owner": address,
        "spender": TCKT_ADDR,
        "value": "0x" + price[+withRevokers].toString(16),
        "nonce": 0,
        "deadline": "0x" + deadline
      }
    });
    return ethereum.request(/** @type {RequestParams} */({
      method: "eth_signTypedData_v4",
      params: [address, typedSignData]
    })).then((signature) => {
      /** @const {boolean} */
      const highBit = signature.slice(-2) == "1c";
      signature = signature.slice(2, -2);
      if (highBit) {
        /** @const {string} */
        const t = (parseInt(signature[64], 16) + 8).toString(16);
        signature = signature.slice(0, 64) + t + signature.slice(65, 128);
      }
      return deadline + tokenData[0].toLowerCase() + signature;
    });
  });

/**
 * @param {string} chainId
 * @param {number} token
 * @return {boolean}
 */
const isTokenAvailable = (chainId, token) =>
  TokenData[chainId][token][0] !== "";

export default {
  addRevoker,
  addToWallet,
  createWithRevokers,
  createWithRevokersWithTokenPermit,
  estimateNetworkFee,
  getPermitFor,
  handleOf,
  isTokenAvailable,
  priceIn,
  reduceRevokeThreshold,
  revoke,
  revokesRemaining,
};
