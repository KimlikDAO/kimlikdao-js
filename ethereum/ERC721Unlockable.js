/**
 * @fileoverview An extension to ERC721Metadata, which allows for encrypted
 * data stored inside the NFT.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 * @struct
 */
function ERC721Metadata() { }

/** @type {string} */
ERC721Metadata.prototype.name;

/** @type {string} */
ERC721Metadata.prototype.description;

/** @type {string} */
ERC721Metadata.prototype.image;

/** @type {string} */
ERC721Metadata.prototype.external_url;

/** @type {string} */
ERC721Metadata.prototype.animation_url;

/** @type {string} */
ERC721Metadata.prototype.background_color;

/** @type {string} */
ERC721Metadata.prototype.youtube_url;

/**
 * @interface
 * @struct
 * @extends {eth.EncryptedData}
 */
function Unlockable() { }

/** @type {Object<string, Array<string>>} */
Unlockable.prototype.userPrompt;

/**
 * @interface
 * @extends {ERC721Metadata}
 * @struct
 */
function ERC721Unlockable() { }

/** @type {Unlockable} */
ERC721Unlockable.prototype.unlockable;

/** @type {Object<string, !Unlockable>} */
ERC721Unlockable.prototype.unlockables;

/**
 * @interface
 * @struct
 * @extends {Unlockable}
 */
function SharedUnlockable() { }

/** @type {boolean} */
SharedUnlockable.prototype.isShared;

/** @type {string} */
SharedUnlockable.prototype.sharedCiphertext;
