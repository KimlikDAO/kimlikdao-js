/**
 * @fileoverview Externs for an ethereum provider.
 *
 * @author KimlikDAO
 * @externs
 */

/** @const */
var ethereum = {};

/**
 * @param {ethereum.Request} params
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
ethereum.Request = function () { }

/** @type {string} */
ethereum.Request.prototype.method;

/** @type {Array<*>} */
ethereum.Request.prototype.params;

/**
 * The struct that is passed to the wallet to add an asset.
 * Currently most wallets support only ERC20 assets.
 *
 * @interface
 * @struct
 */
ethereum.WatchAsset = function () { }

/** @type {string} */
ethereum.WatchAsset.prototype.type;

/** @type {Object<string, string>} */
ethereum.WatchAsset.prototype.options;

/** @type {string} */
ethereum.WatchAsset.prototype.options.address;

/** @type {string} */
ethereum.WatchAsset.prototype.options.symbol;

/** @type {string} */
ethereum.WatchAsset.prototype.options.decimals;

/**
 * An encrypted data blob. Can be unencrypted with an `eth_decrypt` provider
 * call.
 *
 * @record
 * @struct
 */
ethereum.EncryptedData = function () { }

/** @type {string} */
ethereum.EncryptedData.prototype.version;

/** @type {string} */
ethereum.EncryptedData.prototype.nonce;

/** @type {string} */
ethereum.EncryptedData.prototype.ephemPublicKey;

/** @type {string} */
ethereum.EncryptedData.prototype.ciphertext;
