/**
 * @fileoverview Externs for Cloudflare Servie Workers environment.
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
 * @nosideeffects
 * @param {string} key
 * @param {string|ArrayBuffer} value
 * @return {Promise<*>}
 */
KeyValue.prototype.put = function (key, value) { };

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
