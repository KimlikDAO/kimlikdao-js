/**
 * @fileoverview An extension to ERC721Metadata, which allows for encrypted
 * data stored inside the NFT.
 *
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
 */
function Unlockable() { }

/** @type {Object<string, Array<string>>} */
Unlockable.prototype.user_prompt;

/** @type {string} */
Unlockable.prototype.algorithm;

/** @type {string} */
Unlockable.prototype.nonce;

/** @type {string} */
Unlockable.prototype.ephem_pub_key;

/** @type {string} */
Unlockable.prototype.ciphertext;

/**
 * @interface
 * @extends {ERC721Metadata}
 * @struct
 */
function ERC721Unlockable() { }

/** @type {Unlockable} */
ERC721Unlockable.prototype.unlockable;

/** @type {Object<string, Unlockable>} */
ERC721Unlockable.prototype.unlockables;
