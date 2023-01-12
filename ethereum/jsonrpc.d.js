/**
 * @fileoverview Etherem jsonrpc object definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/** @const */
var eth;

/**
 * Represents an ethereum transaction, to be sent to a provider.
 *
 * @interface
 * @struct
 */
eth.Transaction = function () { }

/** @type {string} */
eth.Transaction.prototype.to;

/** @type {string} */
eth.Transaction.prototype.from;

/** @type {string} */
eth.Transaction.prototype.value;

/** @type {string} */
eth.Transaction.prototype.data;

/** @type {string} */
eth.Transaction.prototype.chainId;

/**
 * Represents a `eth_getLogs` request parameters.
 *
 * @interface
 * @struct
 */
eth.GetLogs = function () { }

/** @type {string} */
eth.GetLogs.prototype.fromBlock;

/** @type {string} */
eth.GetLogs.prototype.toBlock;

/** @type {string} */
eth.GetLogs.prototype.address;

/** @type {Array<string>} */
eth.GetLogs.prototype.topics;
