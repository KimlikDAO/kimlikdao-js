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

/**
 * @interface
 */
cloudflare.ModuleWorker = function () { };

/**
 * @param {!cloudflare.Request} req
 * @param {!cloudflare.Environment=} env
 * @param {!cloudflare.Context=} ctx
 * @return {!Promise<!Response>|!Response}
 */
cloudflare.ModuleWorker.prototype.fetch = function (req, env, ctx) { }
