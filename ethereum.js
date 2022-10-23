/**
 * @fileoverview Externs for an ethereum provider.
 * @author KimlikDAO
 * @externs
 */

const ethereum = {};

/**
 * @param {RequestParams} params
 * @return {Promise<string>|Promise<!Array<string>>}
 **/
ethereum.request = function (params) { };

/**
 * @return {boolean}
 */
ethereum.isConnected = function () { };

/**
 * @param {string} eventName
 */
ethereum.on = function (eventName, handler) { };


/**
 * The container object that is passed to the provider.
 *
 * @interface 
 * @struct
 */
function RequestParams() { }

/** @type {string} */
RequestParams.prototype.method;

/** @type {Array<*>} */
RequestParams.prototype.params;


/**
 * Represents an ethereum transaction, to be sent to a provider.
 * 
 * @interface
 * @struct
 */
function Transaction() { }

/** @type {string} */
Transaction.prototype.to;

/** @type {string} */
Transaction.prototype.from;

/** @type {string} */
Transaction.prototype.value;

/** @type {string} */
Transaction.prototype.data;

/** @type {string} */
Transaction.prototype.chainId;


/**
 * The struct that is passed to the wallet to add an asset.
 * Currently most wallet support only ERC20 assets.
 *
 * @interface
 * @struct
 */
function WatchAssetParams() { }

/** @type {string} */
WatchAssetParams.prototype.type;

/** @type {Object<string, string>} */
WatchAssetParams.prototype.options;

/** @type {string} */
WatchAssetParams.prototype.options.address;

/** @type {string} */
WatchAssetParams.prototype.options.symbol;

/** @type {string} */
WatchAssetParams.prototype.options.decimals;


/**
 * An encrypted data blob. Can we unencrypted with an `eth_decrypt` provider
 * call.
 *
 * @interface
 * @struct
 */
function EthEncryptedData() { }

/** @type {string} */
EthEncryptedData.prototype.version;

/** @type {string} */
EthEncryptedData.prototype.nonce;

/** @type {string} */
EthEncryptedData.prototype.ephemPublicKey;

/** @type {string} */
EthEncryptedData.prototype.ciphertext;
