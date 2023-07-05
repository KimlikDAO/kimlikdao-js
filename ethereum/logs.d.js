/**
 * @fileoverview Etherem logs definitions.
 *
 * @author KimlikDAO
 * @externs
 */

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
