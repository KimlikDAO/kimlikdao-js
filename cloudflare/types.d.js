/**
 * @fileoverview Cloudflare workers environment types and definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @const
 */
const cloudflare = {};

/**
 * @constructor
 * @extends {Request}
 */
cloudflare.Request = function () { }

/**
 * @const {{
 *   clientAcceptEncoding: ?string
 * }}
 */
cloudflare.Request.prototype.cf;

/**
 * The Cloudflare Response object contains this convenience method.
 *
 * @nosideeffects
 * @param {!Object|!Array|number} jsonObj
 * @param {!Object=} options
 * @return {!Response}
 */
Response.json = function (jsonObj, options) { }

/**
 * This method is only available in web workers so we define it here.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData/values
 *
 * @nosideeffects
 * @return {!Iterator<!Blob>}
 */
FormData.prototype.values = function () { }

/**
 * @interface
 */
cloudflare.KeyValue = function () { }

/**
 * @nosideeffects
 * @param {string} key
 * @param {string} type
 * @return {!Promise<ArrayBuffer>}
 */
cloudflare.KeyValue.prototype.get = function (key, type) { }

/**
 * @nosideeffects
 * @param {string} key
 * @param {string|!ArrayBuffer} value
 * @return {!Promise<void>}
 */
cloudflare.KeyValue.prototype.put = function (key, value) { }

/**
 * @const
 */
const caches = {};

/** @const {!Cache} */
caches.default;
