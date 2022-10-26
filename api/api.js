/**
 * @fileoverview API veri şekli tanımları.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 * @struct
 */
function HataBildirimi(kod, ek) {
    this.kod = kod;
    this.ek = ek;
}

/** @type {number} */
HataBildirimi.prototype.kod;

/** @type {Array<string>} */
HataBildirimi.prototype.ek;
