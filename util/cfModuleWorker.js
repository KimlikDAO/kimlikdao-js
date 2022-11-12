/**
 * @fileoverview Externs for Cloudflare Module Workers environment.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @constructor
 * @extends {Request}
 */
function CFWorkersRequest() { }

/** @type {Object} */
CFWorkersRequest.prototype.cf;

/** @type {?string} */
CFWorkersRequest.prototype.cf.clientAcceptEncoding

/**
 * @interface
 */
function KeyValue() { }

/**
 * @nosideeffects
 * @param {string} key
 * @param {string} type
 * @return {Promise<ArrayBuffer>}
 */
KeyValue.prototype.get = function (key, type) { };

/**
 * @interface
 */
function RequestContext() { }

/**
 * @param {Promise<*>} promise
 */
RequestContext.prototype.waitUntil = function (promise) { };

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
