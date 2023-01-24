/**
 * @fileoverview KimlikDAO decentralized identifier definitions.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * A collection of `did.Sections` keyed by a string name.
 *
 * @dict
 * @typedef {!Object<string, !did.Section>}
 */
did.DecryptedSections;

/**
 * An object mapping section names to a list of signer addresses.
 *
 * @typedef {!Object<string, !Array<string>>}
 */
did.SignersPerSection;

/**
 * A collection of `did.Section`s indexed by string keys which have been
 * encrypted as an `Unlockable`. In addition to the `Unlockable` fields,
 * contains the merkle root of the `did.Section`s therein.
 *
 * @struct
 * @interface
 * @extends {eth.Unlockable}
 */
did.EncryptedSections = function () { }

/** @type {string} */
did.EncryptedSections.prototype.merkleRoot;

/**
 * Merkle proof is an object mapping a `EncryptedSections` key to a base64
 * encoded level hash.
 *
 * @typedef {!Object<string, string>}
 */
did.MerkleProof;
