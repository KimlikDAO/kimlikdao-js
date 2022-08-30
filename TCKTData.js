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
 */
function Unlockable() { }

/** @type {Object<string,Array<string>>} */
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

/** @type {Unlockable} */
TCKTData.prototype.unlockable;

/** @interface */
function EthEncryptedData() { }

/** @type {string} */
EthEncryptedData.prototype.version;

/** @type {string} */
EthEncryptedData.prototype.nonce;

/** @type {string} */
EthEncryptedData.prototype.ephemPublicKey;

/** @type {string} */
EthEncryptedData.prototype.ciphertext;

/**
 * @interface
 */
function TCKTTemelBilgileri() { };

/** @interface */
TCKTTemelBilgileri.prototype.kişi;

/** @type {string} */
TCKTTemelBilgileri.prototype.kişi.ad;

/** @type {string} */
TCKTTemelBilgileri.prototype.kişi.soyad;

/** @type {number} */
TCKTTemelBilgileri.prototype.kişi.TCKN;

/** @type {string} */
TCKTTemelBilgileri.prototype.kişi.dt;

/** @type {string} */
TCKTTemelBilgileri.prototype.kişi.dyeri;

/** @type {string} */
TCKTTemelBilgileri.prototype.kişi.c;

/** @interface */
TCKTTemelBilgileri.prototype.aile;

/** @type {string} */
TCKTTemelBilgileri.prototype.aile.annead;

/** @type {string} */
TCKTTemelBilgileri.prototype.aile.babaad;

/** @type {number} */
TCKTTemelBilgileri.prototype.aile.BSN;

/** @type {number} */
TCKTTemelBilgileri.prototype.aile.cilt;

/** @type {number} */
TCKTTemelBilgileri.prototype.aile.hane;

/** @type {string} */
TCKTTemelBilgileri.prototype.aile.mhali;

/** @type {string} */
TCKTTemelBilgileri.prototype.aile.din;

/** @interface */
TCKTTemelBilgileri.prototype.kütük;

/** @type {string} */
TCKTTemelBilgileri.prototype.kütük.il;

/** @type {string} */
TCKTTemelBilgileri.prototype.kütük.ilçe;

/** @type {string} */
TCKTTemelBilgileri.prototype.kütük.mahalle;

/** @type {string} */
TCKTTemelBilgileri.prototype.kütük.tescil;

/** @type {string} */
TCKTTemelBilgileri.prototype.taahhüt;

/** @type {string} */
TCKTTemelBilgileri.prototype.rasgele;
