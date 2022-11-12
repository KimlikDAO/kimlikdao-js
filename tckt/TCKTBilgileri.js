/**
 * @fileoverview TCKT'nin içerdiği bilgilerin şekil tanımları.
 *
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

/** @type {string|undefined} */
InfoSection.prototype.secp256k1;

/**
 * Contains the fundamental identification data of a person such as
 * name, date of birth, national id etc.
 *
 * @record
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
 * @record
 * @extends {InfoSection}
 */
function ContactInfo() { }

/** @type {string} */
ContactInfo.prototype.email;

/** @type {string} */
ContactInfo.prototype.phone;

/**
 * @interface
 * @extends {InfoSection}
 */
function AddressInfo() { }

/**
 * @type {string}
 */
AddressInfo.prototype.country;

/**
 * @interface
 * @extends {AddressInfo}
 * @extends {nvi.AdresBilgileri}
 */
function TürkiyeAdresi() { }

/**
 * Kişinin kütük bilgilerini içerir bilgi kartı.
 *
 * @interface
 * @extends {InfoSection}
 * @extends {nvi.KutukBilgileri}
 */
function KütükBilgileri() { }

/**
 * @interface
 * @extends {InfoSection}
 */
function HumanID() { }

/** @type {string} */
HumanID.prototype.generic;

/**
 * @interface
 * @extends {InfoSection}
 */
function SoyZinciri() { }

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
SoyZinciri.prototype.anneSymmetricKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
SoyZinciri.prototype.annePrivateKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
SoyZinciri.prototype.babaSymmetricKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
SoyZinciri.prototype.babaPrivateKey;

/**
 * @interface
 */

/**
 * @typedef {!Object<string, InfoSection>}
 */
var AçıkTCKT;
