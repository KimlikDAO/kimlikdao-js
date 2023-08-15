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
eth.UiProvider = function () { }

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
 * @return {!eth.UiProvider}
 */
eth.UiProvider.prototype.removeAllListeners = function () { };

/**
 * @typedef {{
 *   message: string,
 *   code: number,
 *   data: *
 * }}
 */
eth.ProviderError;

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
 * @interface
 * @struct
 */
eth.SwitchChainParam = function () { }

/** @const {string} */
eth.SwitchChainParam.prototype.chainId;

/**
 * @interface
 * @struct
 */
eth.AddChainParam = function () { }

/** @const {string} */
eth.AddChainParam.prototype.chainId;

/** @const {string} */
eth.AddChainParam.prototype.chainName;

/**
 * @const {{
 *   name: string,
 *   symbol: string,
 *   decimals: number
 * }}
 */
eth.AddChainParam.prototype.nativeCurrency;

/** @const {!Array<string>} */
eth.AddChainParam.prototype.rpcUrls;

/** @const {!Array<string>} */
eth.AddChainParam.prototype.blockExplorerUrls;

/**
 * The struct that is passed to the wallet to add an asset.
 * Currently most wallets support only ERC20 assets.
 *
 * @interface
 * @struct
 */
eth.WatchAssetParam = function () { }

/** @type {string} */
eth.WatchAssetParam.prototype.type;

/** @struct */
eth.WatchAssetParam.prototype.options;

/** @type {string} */
eth.WatchAssetParam.prototype.options.address;

/** @type {string} */
eth.WatchAssetParam.prototype.options.symbol;

/** @type {string} */
eth.WatchAssetParam.prototype.options.decimals;
