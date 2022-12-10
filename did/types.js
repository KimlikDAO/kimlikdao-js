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

/**
 * When a DID holder gets their wallet private keys exposed, they can either
 * revoke the DID themselves, or use social revoking.
 *
 * If they are unable to do either (because they lost their private keys and
 * did not set up social revoke), they need to get a new DID and file an
 * exposure report at https://kimlikdao.org/report using the new DID.
 *
 * The report is filed in a completely decentralized fashion by sending an
 * appropriate transaction containing the signed `exposureReportID`, which
 * every KimlikDAO DID comes with. If desired, this can be done by interacting
 * with the contract directly and the above interface is merely a convenience.
 *
 * The `exposureReportID` is obtained from the `localIdNumber` via a verifiable
 * delay function, therefore for maximum privacy, one may choose to discard an
 * EVM address used for an `exposureReport`.
 *
 * @type {string}
 */
did.PersonInfo.prototype.exposureReportID;

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
 * A collection of `InfoSections` keyed by a string name.
 *
 * @typedef {!Object<string, !did.InfoSection>}
 */
did.DecryptedInfos;

/**
 * A collection of `InfoSection`s indexed by string keys which have been
 * encrypted as an `Unlockable`. In addition to the `Unlockable` fields,
 * contains the merkle root of the `InfoSection`s therein.
 *
 * @struct
 * @interface
 * @extends {eth.Unlockable}
 */
did.EncryptedInfos = function () { }

/** @type {string} */
did.EncryptedInfos.prototype.merkleRoot;

/**
 * Merkle proof is an object mapping a `EncryptedInfos` key to a base64 encoded
 * level hash.
 *
 * @typedef {!Object<string, string>}
 */
did.MerkleProof;
