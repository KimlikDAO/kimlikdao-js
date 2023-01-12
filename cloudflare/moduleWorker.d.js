/**
 * @fileoverview Externs for Cloudflare Module Workers.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 */
cloudflare.Context = function () { };

/**
 * @param {Promise<*>} promise
 */
cloudflare.Context.prototype.waitUntil = function (promise) { };

/**
 * @interface
 */
cloudflare.Environment = function () { };
