/**
 * @fileoverview An encrypted piece of data, which typically is stored inside an
 * NFT.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 * @struct
 * @extends {eth.EncryptedData}
 */
eth.Unlockable = function () { }

/** @type {string|!Object<string, Array<string>>} */
eth.Unlockable.prototype.userPrompt;
