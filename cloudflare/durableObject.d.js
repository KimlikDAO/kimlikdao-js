/**
 * @fileoverview Cloudflare Durable Object definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 *
 * @param {!cloudflare.DurableObject.State} state
 * @param {!cloudflare.Environment} env
 */
cloudflare.DurableObject = function (state, env) { }

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
 * @nosideeffects
 * @param {string} key
 * @return {!Promise<boolean>}
 */
cloudflare.DurableObject.Storage.prototype.delete = function (key) { };

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
 * @param {string} hexId
 * @return {!cloudflare.DurableObjectId}
 */
cloudflare.DurableObjectBinding.prototype.idFromString = function (hexId) { }

/**
 * @nosideeffects
 * @return {!cloudflare.DurableObjectId}
 */
cloudflare.DurableObjectBinding.prototype.newUniqueId = function () { }

/**
 * @typedef {{
 *   locationHint: string
 * }}
 */
cloudflare.StubOptions;

/**
 * @nosideeffects
 * @param {!cloudflare.DurableObjectId} durableObjectId
 * @param {!cloudflare.StubOptions=} options
 * @return {!cloudflare.DurableObjectStub}
 */
cloudflare.DurableObjectBinding.prototype.get = function (durableObjectId, options) { }

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
