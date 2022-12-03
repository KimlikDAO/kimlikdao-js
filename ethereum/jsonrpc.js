/**
 * @fileoverview Etherem json-rpc parameter definitions
 *
 * @author KimlikDAO
 * @externs
 */

/** @const */
var ethereum = {};

/**
 * Represents an ethereum transaction, to be sent to a provider.
 *
 * @interface
 * @struct
 */
ethereum.Transaction = function () { }

/** @type {string} */
ethereum.Transaction.prototype.to;

/** @type {string} */
ethereum.Transaction.prototype.from;

/** @type {string} */
ethereum.Transaction.prototype.value;

/** @type {string} */
ethereum.Transaction.prototype.data;

/** @type {string} */
ethereum.Transaction.prototype.chainId;

/**
 * Represents a `eth_getLogs` request parameters.
 *
 * @interface
 * @struct
 */
ethereum.GetLogs = function () { }

/** @type {string} */
ethereum.GetLogs.prototype.fromBlock;

/** @type {string} */
ethereum.GetLogs.prototype.toBlock;

/** @type {string} */
ethereum.GetLogs.prototype.address;

/** @type {Array<string>} */
ethereum.GetLogs.prototype.topics;
