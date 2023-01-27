/**
 * @fileoverview Cloudflare Durable Object definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 */
cloudflare.DurableObject = function () { }

/**
 * A state of the DurableObject.
 *
 * @interface
 */
cloudflare.DurableObject.State = function () { }

/** @const {!cloudflare.DurableObject.Storage} */
cloudflare.DurableObject.State.prototype.storage;

/** @const {!cloudflare.DurableObjectId} */
cloudflare.DurableObject.State.prototype.id;

/**
 * Transactional storage of the durable object.
 *
 * @interface
 * @see https://developers.cloudflare.com/workers/runtime-apis/durable-objects/#transactional-storage-api
 */
cloudflare.DurableObject.Storage = function () { }

/**
 * @nosideeffects
 * @param {string|!Array<string>} key
 * @return {!Promise<*>}
 */
cloudflare.DurableObject.Storage.prototype.get = function (key) { };

/**
 * @nosideeffects
 * @param {string} key
 * @param {*} value
 * @return {!Promise<void>}
 */
cloudflare.DurableObject.Storage.prototype.put = function (key, value) { };

/**
 * @interface
 *
 * @param {!Request} req
 * @return {!Promise<!Response>}
 */
cloudflare.DurableObject.prototype.fetch = function (req) { }

/**
 * @interface
 */
cloudflare.DurableObjectId = function () { }

/**
 * @nosideeffects
 * @return {string}
 */
cloudflare.DurableObjectId.prototype.toString = function () { }

/**
 * @interface
 */
cloudflare.DurableObjectBinding = function () { }

/**
 * @nosideeffects
 * @param {string} name
 * @return {!cloudflare.DurableObjectId}
 */
cloudflare.DurableObjectBinding.prototype.idFromName = function (name) { }

/**
 * @nosideeffects
 * @param {!cloudflare.DurableObjectId} durableObjectId
 * @return {!cloudflare.DurableObjectStub}
 */
cloudflare.DurableObjectBinding.prototype.get = function (durableObjectId) { }

/**
 * @interface
 */
cloudflare.DurableObjectStub = function () { }

/**
 * A durable object stub has the same fetch interface as the web api fetch.
 *
 * @param {!RequestInfo} input
 * @param {!RequestInit=} init
 * @return {!Promise<!Response>}
 * @see https://fetch.spec.whatwg.org/#fetch-method
 * @see https://developers.cloudflare.com/workers/runtime-apis/fetch/
 */
cloudflare.DurableObjectStub.prototype.fetch = function (input, init) { }