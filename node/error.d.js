/**
 * @fileoverview API veri şekli tanımları.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @enum {number}
 */
const ErrorCode = {
  DOCUMENT_EXPIRED: 0,
  INVALID_RECORD: 1,
  INCORRECT_INSTITUTION: 2,
  PERSON_NOT_ALIVE: 3,
  INVALID_CHALLENGE: 4,
  AUTHENTICATION_FAILURE: 5,
  INVALID_POW: 6,
  INCORRECT_FILE_FORMAT: 7,
  INVALID_TIMESTAMP: 8,
  INVALID_REQUEST: 9
};

/**
 * @interface
 *
 * @param {!ErrorCode} kod
 * @param {!Array<string>=} ek
 */
function HataBildirimi(kod, ek) {
  /** @const {!ErrorCode} */
  this.kod = kod;
  /** @const {Array<string>} */
  this.ek = ek;
}

/** @type {!ErrorCode} */
HataBildirimi.prototype.kod;

/** @type {Array<string>} */
HataBildirimi.prototype.ek;
