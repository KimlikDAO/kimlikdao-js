/**
 * @fileoverview
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @const
 */
const jsonrpc = {};

/**
 * @typedef {{
 *   jsonrpc: string,
 *   method: string,
 *   params: Array<*>,
 *   id: (number|string)
 * }}
 */
jsonrpc.Request;

/**
 * @typedef {{
 *   jsonrpc: string,
 *   result: *,
 *   error: *,
 *   id: (number|string)
 * }}
 */
jsonrpc.Response;

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
