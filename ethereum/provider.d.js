/**
 * @fileoverview Externs for an ethereum provider.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 */
eth.Provider = function () { }

/**
 * @param {!eth.Request} params
 * @return {!Promise<string>|!Promise<!Array<string>>}
 **/
eth.Provider.prototype.request = function (params) { };

/**
 * @interface
 * @extends {eth.Provider}
 */
eth.UiProvider = function() {}

/**
 * @return {boolean}
 */
eth.UiProvider.prototype.isConnected = function () { };

/**
 * @param {string} eventName
 * @param {function(?)} handler
 */
eth.UiProvider.prototype.on = function (eventName, handler) { };

/**
 * @typedef {{
 *   message: string,
 *   code: number,
 *   data: *
 * }}
 */
eth.ProviderError;

/** @const {!eth.UiProvider} */
var ethereum;

/**
 * The container object that is passed to the provider.
 *
 * @interface
 * @struct
 */
eth.Request = function () { }

/** @type {string} */
eth.Request.prototype.method;

/** @type {Array<*>} */
eth.Request.prototype.params;

/**
 * The struct that is passed to the wallet to add an asset.
 * Currently most wallets support only ERC20 assets.
 *
 * @interface
 * @struct
 */
eth.WatchAsset = function () { }

/** @type {string} */
eth.WatchAsset.prototype.type;

/** @struct */
eth.WatchAsset.prototype.options;

/** @type {string} */
eth.WatchAsset.prototype.options.address;

/** @type {string} */
eth.WatchAsset.prototype.options.symbol;

/** @type {string} */
eth.WatchAsset.prototype.options.decimals;

/**
 * An encrypted data blob. Can be unencrypted with an `eth_decrypt` provider
 * call.
 *
 * @interface
 * @struct
 */
eth.EncryptedData = function () { }

/** @type {string} */
eth.EncryptedData.prototype.version;

/** @type {string} */
eth.EncryptedData.prototype.nonce;

/** @type {string} */
eth.EncryptedData.prototype.ephemPublicKey;

/** @type {string} */
eth.EncryptedData.prototype.ciphertext;
