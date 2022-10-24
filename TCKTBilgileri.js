/**
 * @fileoverview TCKT'nin içerdiği bilgilerin şekil tanımları.
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 * @struct
 */
function InfoSection() { }

/** @type {number} */
InfoSection.prototype.signatureTs;

/** @type {string} */
InfoSection.prototype.ed25519;

/** @type {string} */
InfoSection.prototype.secp256k1;

/**
 * Contains the fundamental identification data of a person such as
 * name, date of birth, national id etc.
 *
 * @interface
 * @extends {InfoSection}
 */
function PersonInfo() { };

/** @type {string} */
PersonInfo.prototype.first;

/** @type {string} */
PersonInfo.prototype.last;

/** @type {string} */
PersonInfo.prototype.localIdNumber;

/** @type {string} */
PersonInfo.prototype.dateOfBirth;

/** @type {string} */
PersonInfo.prototype.cityOfBirth;

/** @type {string} */
PersonInfo.prototype.gender;

/** @type {Object} */
PersonInfo.prototype.humanID;

/**
 * "HumanID('revoke')" for the person, which is used when this ID need to be
 * revoked.
 *
 * @type {string}
 */
PersonInfo.prototype.humanID.revoke;

/**
 * An info section containing verified contact info for a person / entity.
 *
 * @interface
 * @extends {InfoSection}
 */
function ContactInfo() { }

/** @type {string} */
ContactInfo.prototype.email;

/** @type {string} */
ContactInfo.prototype.phone;

/**
 * Kişinin kütük bilgilerini içerir bilgi kartı.
 *
 * @interface
 * @extends {InfoSection}
 */
function KütükBilgileri() { }

/** @type {string} */
KütükBilgileri.prototype.annead;

/** @type {string} */
KütükBilgileri.prototype.babaad;

/** @type {string} */
KütükBilgileri.prototype.mhali;

/** @type {string} */
KütükBilgileri.prototype.il;

/** @type {string} */
KütükBilgileri.prototype.ilçe;

/** @type {string} */
KütükBilgileri.prototype.mahalle;

/** @type {number} */
KütükBilgileri.prototype.cilt;

/** @type {number} */
KütükBilgileri.prototype.hane;

/** @type {number} */
KütükBilgileri.prototype.BSN;

/** @type {string} */
KütükBilgileri.prototype.tescil;

/** @type {string} */
KütükBilgileri.prototype.din;

/**
 * @interface
 * @extends {InfoSection}
 */
function HumanID() { }

/** @type {string} */
HumanID.prototype.generic;

/**
 * @typedef {Object<string, InfoSection>}
 */
var AçıkTCKT;
