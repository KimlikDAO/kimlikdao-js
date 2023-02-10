/**
 * @fileoverview TCKT akıllı sözleşmesinin js önyüzu.
 */
import evm from './evm';

/**
 * @const {string}
 * @noinline
 */
export const TCKT_ADDR = "0xcCc0a9b023177549fcf26c947edb5bfD9B230cCc";

/**
 * @const {string}
 */
const REVOKER_ASSIGNMENT = "0x4e686c76ade52af6305355f15cc098a1ca686d24a8c183f14896632bc8b27c5f";

/** @const {number} */
const MILLION = 1000_000;

/** @const {!bigint} */
const TRILLION = 10n ** 12n;

/**
 * Information pertaining to a token which we take as payment.
 *
 * We use these names so that GCC can easily prove that these names can be
 * mangled.
 *
 * @typedef {{
 *   adres: string,
 *   uzunAd: string,
 *   basamak: number,
 *   sürüm: number
 * }}
 */
const TokenInfo = {};

/** @const {!Object<string, !Array<TokenInfo>>} */
const TokenData = {
  "0x1": [
    null, /** @type {!TokenInfo} */({
      adres: "dAC17F958D2ee523a2206206994597C13D831ec7".toLowerCase(),
      uzunAd: "Tether USD",
      basamak: 6,
      sürüm: 0
    }), /** @type {!TokenInfo} */({
      adres: "A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase(),
      uzunAd: "USD Coin",
      basamak: 6,
      sürüm: 2
    }), /** @type {!TokenInfo} */({
      adres: "2C537E5624e4af88A7ae4060C022609376C8D0EB".toLowerCase(),
      uzunAd: "BiLira",
      basamak: 6,
      sürüm: 0
    }), /** @type {!TokenInfo} */({
      adres: "4Fabb145d64652a948d72533023f6E7A623C7C53".toLowerCase(),
      uzunAd: "Binance USD",
      basamak: 18,
      sürüm: 0
    })
  ],
  "0xa86a": [
    null, /** @type {!TokenInfo} */({
      adres: "9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7".toLowerCase(),
      uzunAd: "TetherToken",
      basamak: 6,
      sürüm: 1
    }), /** @type {!TokenInfo} */({
      adres: "B97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E".toLowerCase(),
      uzunAd: "USD Coin",
      basamak: 6,
      sürüm: 2
    }), /** @type {!TokenInfo} */({
      adres: "564A341Df6C126f90cf3ECB92120FD7190ACb401".toLowerCase(),
      uzunAd: "BiLira",
      basamak: 6,
      sürüm: 2
    }), /** @type {!TokenInfo} */({
      adres: "9C9e5fD8bbc25984B178FdCE6117Defa39d2db39".toLowerCase(),
      uzunAd: "BUSD Token",
      basamak: 18,
      sürüm: 1
    })
  ],
  "0x89": [
    null, /** @type {!TokenInfo} */({
      adres: "c2132D05D31c914a87C6611C10748AEb04B58e8F".toLowerCase(),
      uzunAd: "(PoS) Tether USD",
      basamak: 6,
      sürüm: 1
    }), /** @type {!TokenInfo} */({
      adres: "2791Bca1f2de4661ED88A30C99A7a9449Aa84174".toLowerCase(),
      uzunAd: "USD Coin (PoS)",
      basamak: 6,
      sürüm: 1
    }), /** @type {!TokenInfo} */({
      adres: "4Fb71290Ac171E1d144F7221D882BECAc7196EB5".toLowerCase(),
      uzunAd: "BiLira",
      basamak: 6,
      sürüm: 1
    }), /** @type {!TokenInfo} */({
      adres: "9C9e5fD8bbc25984B178FdCE6117Defa39d2db39".toLowerCase(),
      uzunAd: "BUSD Token",
      basamak: 18,
      sürüm: 1
    })
  ],
  "0xa4b1": [
    null, /** @type {!TokenInfo} */({
      adres: "Fd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9".toLowerCase(),
      uzunAd: "Tether USD",
      basamak: 6,
      sürüm: 1
    }), /** @type {!TokenInfo} */({
      adres: "FF970A61A04b1cA14834A43f5dE4533eBDDB5CC8".toLowerCase(),
      uzunAd: "USD Coin (Arb1)",
      basamak: 6,
      sürüm: 1
    }), null, null
  ],
  "0x38": [
    null, null, /** @type {!TokenInfo} */({
      adres: "8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d".toLowerCase(),
      uzunAd: "USD Coin",
      basamak: 18,
      sürüm: 0
    }), /** @type {!TokenInfo} */({
      adres: "C1fdbed7Dac39caE2CcC0748f7a80dC446F6a594".toLowerCase(),
      uzunAd: "BiLira",
      basamak: 6,
      sürüm: 0
    }), /** @type {!TokenInfo} */({
      adres: "e9e7CEA3DedcA5984780Bafc599bD69ADd087D56".toLowerCase(),
      uzunAd: "BUSD Token",
      basamak: 18,
      sürüm: 0
    }),
  ],
  "0x406": [
    null, null, null, null, null
  ],
  "0xfa": [
    null, null, /** @type {!TokenInfo} */({
      adres: "04068DA6C83AFCFA0e13ba15A6696662335D5B75".toLowerCase(),
      uzunAd: "USD Coin",
      basamak: 6,
      sürüm: 1
    }), null, null
  ],
};

/**
 * Asks the connected wallet to track the TCKT contract (as an NFT).
 *
 * Sends a `wallet_watchAsset` request to the connected wallet. Currently, no
 * wallet supports adding an NFT this way, so we disable this.
 */
const addToWallet = () =>
  ethereum.request(/** @type {!eth.Request} */({
    method: 'wallet_watchAsset',
    params: /** @type {!eth.WatchAsset} */({
      type: 'ERC721',
      options: {
        address: TCKT_ADDR,
        symbol: 'TCKT',
        decimals: "0",
      }
    }),
  }))

/**
 * @param {string} from
 * @param {string} to
 * @param {string} value value in native token, encoded as a hex string.
 * @param {string} calldata hex encoded calldata.
 * @return {!Promise<*>}
 */
const sendTransactionTo = (from, to, value, calldata) =>
  ethereum.request(/** @type {!eth.Request} */({
    method: "eth_sendTransaction",
    params: [/** @type {!eth.Transaction} */({
      from,
      to,
      value: "0x" + value,
      data: calldata
    })]
  }))

/**
 * @param {string} address
 * @param {string} value value in native tokens, encoded as a hex string.
 * @param {string} calldata hex encoded calldata.
 * @return {!Promise<*>}
 */
const sendTransaction = (address, value, calldata) =>
  sendTransactionTo(address, TCKT_ADDR, value, calldata);

/**
 * @param {string} contract Contract adddress given with the 0x prefix
 * @param {string} calldata Calldata transmitted to the contract verbatim.
 * @return {!Promise<string>}
 */
const callMethod = (contract, calldata) =>
  ethereum.request(/** @type {!eth.Request} */({
    method: "eth_call",
    params: [/** @type {!eth.Transaction} */({
      to: contract,
      data: calldata
    }), "latest"]
  }))

/** @const {!Object<string, string>} */
const NonceCache = {};

/**
 * @param {string} chainId
 * @param {string} address Owner address including the 0x.
 * @param {number} token
 * @return {!Promise<string>} The nonce for (chain, token, address).
 */
const getNonce = (chainId, address, token) => {
  const cached = NonceCache[chainId + address + token];
  return cached
    ? Promise.resolve(cached) : callMethod(
      "0x" + TokenData[chainId][token].adres, "0x7ecebe00" + evm.address(address)
    ).then((nonce) => {
      NonceCache[chainId + address + token] = nonce;
      return nonce;
    })
}

/**
 * TODO(KimlikDAO-bot): Update to the new method signature
 *
 * @param {string} address
 * @return {!Promise<string>}
 */
const handleOf = (address) =>
  callMethod(TCKT_ADDR, "0xc50a1514" + evm.address(address));

/**
 * @return {!Promise<number>}
 */
const revokesRemaining = () => callMethod(TCKT_ADDR, "0x165c44f3")
  .then((revokes) => parseInt(revokes.slice(-6), 16));

/**
 * @param {string} address
 * @param {number} deltaWeight
 * @return {!Promise<*>}
 */
const reduceRevokeThreshold = (address, deltaWeight) =>
  sendTransaction(address, "0", "0xab505b1c" + evm.uint256(deltaWeight));

/**
 * @param {string} address
 * @param {number} deltaWeight revoker weight.
 * @param {string} revokerAddress revoker address.
 * @return {!Promise<*>}
 */
const addRevoker = (address, deltaWeight, revokerAddress) =>
  sendTransaction(address, "0", "0xf02b3297" +
    evm.uint96(deltaWeight) + revokerAddress.slice(2).toLowerCase());

/**
 * @param {string} address
 * @return {!Promise<*>}
 */
const revoke = (address) =>
  sendTransaction(address, "0", "0xb6549f75");

/**
 * @param {string} address
 * @param {string} friend
 * @return {!Promise<*>}
 */
const revokeFriend = (address, friend) =>
  sendTransaction(address, "0", "0x3a2c82c7" + evm.address(friend));

/**
 * Returns the list of addresses that can be revoked by `revoker`.
 *
 * @param {string} revoker
 * @return {!Promise<*>}
 */
const getRevokeeAddresses = (revoker) =>
  ethereum.request(/** @type {!eth.Request} */({
    method: "eth_getLogs",
    params: [/** @type {!eth.GetLogs} */({
      address: TCKT_ADDR,
      fromBlock: "0x12A3AE7",
      toBlock: "0x12A3AE7",
      topics: [
        REVOKER_ASSIGNMENT,
        [],
        "0x000000000000000000000000c152e02e54cbeacb51785c174994c2084bd9ef51", // FIXME: revoker
      ]
    })]
  }))

/**
 * @param {string} chainId
 * @param {string} address
 * @param {string} cid
 * @param {number} revokeThreshold
 * @param {!Object<string, number>} revokers
 * @return {!Promise<*>}
 */
const createWithRevokers = (chainId, address, cid, revokeThreshold, revokers) =>
  priceIn(chainId, 0).then(([high, low]) => {
    const price = (TRILLION * BigInt(revokeThreshold == 0 ? high : low)).toString(16);
    return revokeThreshold == 0
      ? sendTransaction(address, price, "0x780900dc" + cid)
      : sendTransaction(address, price, "0xd3cfebc1" + cid +
        serializeRevokers(revokeThreshold, revokers));
  });

/**
 * @param {number} revokeThreshold The threshold for vote weight after which
 *                                 the TCKT is revoked.
 * @param {!Object<string, number>} revokers (Address, weight) pairs for the
 *                                           revokers.
 * @return {string} serialized revoker list.
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
 * @param {string} address
 * @param {string} cid
 * @param {number} revokeThreshold
 * @param {!Object<string, number>} revokers
 * @param {string} signature as a length 64 hex string.
 * @return {!Promise<*>}
 */
const createWithRevokersWithTokenPermit = (address, cid, revokeThreshold, revokers, signature) =>
  revokeThreshold == 0
    ? sendTransaction(address, "0", "0xe0adf95b" + cid + signature)
    : sendTransaction(address, "0", "0x0633ddcb" + cid +
      serializeRevokers(revokeThreshold, revokers) + signature);

/**
 * @param {string} chainId
 * @param {string} address
 * @param {string} cid
 * @param {number} revokeThreshold
 * @param {!Object<string, number>} revokers
 * @param {number} token
 * @return {!Promise<*>}
 */
const createWithRevokersWithTokenPayment = (chainId, address, cid, revokeThreshold, revokers, token) => {
  const tokenSerialized = evm.uint96(0) + TokenData[chainId][token].adres;
  return revokeThreshold == 0
    ? sendTransaction(address, "0", "0xdaca45f7" + cid + tokenSerialized)
    : sendTransaction(address, "0", "0x3e36b2f7" + cid +
      serializeRevokers(revokeThreshold, revokers) + tokenSerialized);
}

/**
 * @param {string} chainId
 * @param {number} token
 * @return {!Promise<!Array<number>>} price of TCKT in the given currency
 */
const priceIn = (chainId, token) => {
  if (chainId == "0x38" && token == 0)
    return Promise.resolve([5000, 3400]);
  const fiyat = {
    "0x1": [600, 1 * MILLION, 1 * MILLION, 19 * MILLION, 1 * MILLION],
    "0xa86a": [50_000, 1 * MILLION, 1 * MILLION, 19 * MILLION, 1 * MILLION],
    "0x89": [800_000, 1 * MILLION, 1 * MILLION, 19 * MILLION, 1 * MILLION],
    "0xa4b1": [600, 1 * MILLION, 1 * MILLION, 19 * MILLION, 0],
    "0x38": [3400, 1 * MILLION, 1 * MILLION, 19 * MILLION, 1 * MILLION],
    "0xfa": [2_300_000, 1 * MILLION, 1 * MILLION, 19 * MILLION, 0],
  }
  return Promise.resolve([
    fiyat[chainId][token] * 1.5, fiyat[chainId][token]
  ]);
}

/**
 * @param {string} chainId
 * @return {!Promise<number>}
 */
const estimateNetworkFee = (chainId) => {
  const placeholder = {
    "0x1": 600,
    "0xa86a": 800,
    "0x89": 400,
    "0xa4b1": 200,
    "0x38": 400,
    "0x406": 100,
    "0xfa": 200,
  }
  return Promise.resolve(placeholder[chainId]);
}

/**
 * Returns now + 20 mins as a timestamp in seconds.
 *
 * @return {number}
 */
const getDeadline = () => 20 * 60 + (Date.now() / 1000 | 0);

/**
 * @param {string} chainId
 * @param {string} address     Address of the message sender (asset owner also).
 * @param {number} token       A ERC20 token address to get the approval from.
 * @return {!Promise<*>}
 */
const getApprovalFor = (chainId, address, token) => sendTransactionTo(
  address,
  "0x" + TokenData[chainId][token].adres,
  "0", "0x095ea7b3" + evm.address(TCKT_ADDR) + evm.Uint256Max);

/**
 * @param {string} chainId       chainId for the chain we want the permit for
 * @param {string} owner         Owner of the asset.
 * @param {number} token         dApp internal currency code, currently in
 *                               [1..3].
 * @param {boolean} withRevokers Whether the user has set up valid revokers to
 *                               qualify for a discount.
 * @return {!Promise<string>}    Calldata serialized permission.
 */
const getPermitFor = (chainId, owner, token, withRevokers) =>
  Promise.all([priceIn(chainId, token), getNonce(chainId, owner, token)])
    .then(([/** !Array<number> */ price, /** string */ nonce]) => {
      /** @const {string} */
      const deadline = evm.uint96(getDeadline());
      /** @const {!TokenInfo} */
      const tokenData = TokenData[chainId][token];
      /** @const {string} */
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
          "name": tokenData.uzunAd,
          "version": "" + tokenData.sürüm,
          "chainId": chainId,
          "verifyingContract": "0x" + tokenData.adres
        },
        "primaryType": "Permit",
        "message": {
          "owner": owner,
          "spender": TCKT_ADDR,
          "value": "0x" + price[+withRevokers].toString(16),
          "nonce": nonce,
          "deadline": "0x" + deadline
        }
      });
      return ethereum.request(/** @type {!eth.Request} */({
        method: "eth_signTypedData_v4",
        params: [owner, typedSignData]
      })).then((/** @type {string} */ signature) =>
        deadline + tokenData.adres + evm.compactSignature(signature)
      );
    });

/**
 * @param {string} chainId
 * @param {number} token
 * @return {boolean}
 */
const isTokenAvailable = (chainId, token) => !!TokenData[chainId][token];

/**
 * @param {string} chainId
 * @param {number} token internal token id; see `TokenData`.
 * @return {boolean}
 */
const isTokenERC20Permit = (chainId, token) =>
  !!(TokenData[chainId][token] && TokenData[chainId][token].sürüm)

export default {
  addRevoker,
  addToWallet,
  createWithRevokers,
  createWithRevokersWithTokenPayment,
  createWithRevokersWithTokenPermit,
  estimateNetworkFee,
  getApprovalFor,
  getNonce,
  getPermitFor,
  getRevokeeAddresses,
  handleOf,
  isTokenAvailable,
  isTokenERC20Permit,
  priceIn,
  reduceRevokeThreshold,
  revoke,
  revokeFriend,
  revokesRemaining,
};
