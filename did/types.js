/**
 * @fileoverview KimlikDAO decentralied ID definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/** @const */
const did = {};

/**
 * @interface
 * @struct
 */
did.InfoSection = function () { }

/** @type {number} */
did.InfoSection.prototype.signatureTs;

/** @type {string} */
did.InfoSection.prototype.bls12_381;

/** @type {string|undefined} */
did.InfoSection.prototype.secp256k1;

/**
 * Contains the fundamental identification data of a person such as
 * name, date of birth, national id etc.
 *
 * @interface
 * @extends {did.InfoSection}
 */
did.PersonInfo = function () { };

/** @type {string} */
did.PersonInfo.prototype.first;

/** @type {string} */
did.PersonInfo.prototype.last;

/** @type {string} */
did.PersonInfo.prototype.localIdNumber;

/** @type {string} */
did.PersonInfo.prototype.dateOfBirth;

/** @type {string} */
did.PersonInfo.prototype.cityOfBirth;

/** @type {string} */
did.PersonInfo.prototype.gender;

/** @type {Object} */
did.PersonInfo.prototype.humanID;

/**
 * "HumanID('revoke')" for the person, which is used when this ID need to be
 * revoked.
 *
 * @type {string}
 */
did.PersonInfo.prototype.humanID.revoke;

/**
 * An info section containing verified contact info for a person / entity.
 *
 * @record
 * @extends {did.InfoSection}
 */
did.ContactInfo = function () { }

/** @type {string} */
did.ContactInfo.prototype.email;

/** @type {string} */
did.ContactInfo.prototype.phone;

/**
 * @interface
 * @extends {did.InfoSection}
 */
did.AddressInfo = function () { }

/**
 * @type {string}
 */
did.AddressInfo.prototype.country;

/**
 * @interface
 * @extends {did.InfoSection}
 */
did.HumanID = function () { }

/** @type {string} */
did.HumanID.prototype.generic;

/**
 * @typedef {!Object<string, !did.InfoSection>}
 */
did.DecryptedDID;
