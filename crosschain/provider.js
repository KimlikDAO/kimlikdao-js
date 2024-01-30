import { ChainId } from "./chains";
import { Signer } from "./signer";

/**
 * @interface
 * @struct
 * @extends {Signer}
 */
function Provider() { }

/**
 * @return {boolean}
 */
Provider.prototype.initIfAvailable = function () { }

/**
 * @return {string}
 */
Provider.prototype.downloadURL = function () { }

/**
 * @param {ChainId} chain
 * @param {function(ChainId)} chainChanged
 * @param {function(!Array<string>)} addressChanged
 * @param {boolean=} onlyIfApproved
 * @return {!Promise<void>}
 */
Provider.prototype.connect = function (chain, chainChanged, addressChanged, onlyIfApproved) { }

/**
 * Disconnect the provider connection, detaching all listeners.
 */
Provider.prototype.disconnect = function () { }

/**
 * @param {string} chain
 * @return {!Promise<void>}
 */
Provider.prototype.switchChain = function (chain) { }

/**
 * @type {?}
 */
Provider.prototype.provider;

export { Provider };
