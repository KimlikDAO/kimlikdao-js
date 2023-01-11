/**
 * @fileoverview API veri şekli tanımları.
 *
 * @author KimlikDAO
 * @externs
 */

/** @const */
const node = {};

/**
 * @interface
 *
 * @param {number} kod
 * @param {!Array<string>=} ek
 */
node.HataBildirimi = function(kod, ek) {
  /** @const {number} */
  this.kod = kod;
  /** @const {Array<string>} */
  this.ek = ek;
}

/** @type {number} */
node.HataBildirimi.prototype.kod;

/** @type {Array<string>} */
node.HataBildirimi.prototype.ek;
