/**
 * @fileoverview Externs for Cloudflare Servie Workers environment.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @param {string} eventName
 * @param {function(Object)} listener
 */
function addEventListener(eventName, listener) { };

const caches = {};

caches.default = {};

/**
 * @nosideeffects
 * @param {string} key
 * @return {Promise<Response>}
 */
caches.default.match = function (key) { };

/**
 * @param {string} key
 * @param {Response} value
 */
caches.default.put = function (key, value) { };
