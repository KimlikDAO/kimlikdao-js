/**
 * @fileoverview Errors returned from a KimlikDAO protocol node.
 *
 * @author KimlikDAO
 */

/**
 * @param {number} httpStatus
 * @param {!ErrorCode} errorCode
 * @return {!Response}
 */
const err = (httpStatus, errorCode) => new Response(
  JSON.stringify(/** @type {!HataBildirimi} */({ kod: errorCode })),
  { status: httpStatus }
);

/**
 * @param {number} httpStatus
 * @param {!ErrorCode} errorCode
 * @param {!Array<string>} messages
 * @return {!Response}
 */
const errWithMessage = (httpStatus, errorCode, messages) => new Response(
  JSON.stringify(/** @type {!HataBildirimi} */({
    kod: errorCode,
    ek: messages
  })),
  { status: httpStatus }
);

/**
 * @param {!ErrorCode} kod
 * @param {!Array<string>=} ek
 * @return {Promise<*>}
 */
const reject = (kod, ek) =>
  Promise.reject(/** @type {!HataBildirimi} */({ kod, ek }));

/**
 * @param {!HataBildirimi} hata
 * @return {!Response}
 */
const errorResponse = (hata) => new Response(
  JSON.stringify(hata), { status: 400 }
);

export {
  err,
  errorResponse,
  errWithMessage,
  reject
};
