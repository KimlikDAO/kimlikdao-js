/**
 * @fileoverview An encrypted piece of data, which typically is stored inside an
 * NFT.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @const
 */
const crosschain = {};

/**
 * @interface
 * @struct
 *
 * The unlockable is modeled after the eth.EncryptedData, though the wireformat
 * is the same on all blockchains.
 * @extends {eth.EncryptedData}
 */
crosschain.Unlockable = function () { }

/** @type {string} */
crosschain.Unlockable.prototype.userPrompt;
