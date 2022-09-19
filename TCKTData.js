/**
 * @fileoverview TCKTData externi; TCKT'nin zincir dışı saklanan verisinin
 * şeklini tanımlar. Not: zincir dışı saklanan veri IPFS hash'leri sayesinde
 * blokzincirin garantisindedir.
 *
 * `ERC721Metadata` verisinin genişletilmiş halidir.
 *
 * @externs
 */

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
 * @struct
 */
function TCKTData() { }

/** @type {string} */
TCKTData.prototype.name;

/** @type {string} */
TCKTData.prototype.description;

/** @type {string} */
TCKTData.prototype.image;

/** @type {string} */
TCKTData.prototype.external_url;

/** @type {string} */
TCKTData.prototype.animation_url;

/** @type {Object<string, Unlockable>} */
TCKTData.prototype.unlockables;

/**
 * @interface
 * @type {Object<string, Object>}
 */
function AçıkTCKT() { };

/** @interface */
function KişiBilgileri() { };

/** @type {string} */
KişiBilgileri.prototype.ad;

/** @type {string} */
KişiBilgileri.prototype.soyad;

/** @type {number} */
KişiBilgileri.prototype.TCKN;

/** @type {string} */
KişiBilgileri.prototype.dt;

/** @type {string} */
KişiBilgileri.prototype.dyeri;

/** @type {string} */
KişiBilgileri.prototype.c;

/** @interface */
function AileBilgileri() { }

/** @type {string} */
AileBilgileri.prototype.annead;

/** @type {string} */
AileBilgileri.prototype.babaad;

/** @type {number} */
AileBilgileri.prototype.BSN;

/** @type {number} */
AileBilgileri.prototype.cilt;

/** @type {number} */
AileBilgileri.prototype.hane;

/** @type {string} */
AileBilgileri.prototype.mhali;

/** @type {string} */
AileBilgileri.prototype.din;

/** @interface */
function KütükBilgileri() { };

/** @type {string} */
KütükBilgileri.prototype.il;

/** @type {string} */
KütükBilgileri.prototype.ilçe;

/** @type {string} */
KütükBilgileri.prototype.mahalle;

/** @type {string} */
KütükBilgileri.prototype.tescil;

/** @type {string} */
KütükBilgileri.prototype.taahhüt;
