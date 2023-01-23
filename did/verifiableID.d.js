/**
 * @fileoverview
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * A 256 bit ID generated for a person that has unique privacy properties:
 *
 *  - Generated from a persons unique properties such as
 *    `did.personInfo.localIdNumber`.
 *
 *  - Can only by generatd by heavy computation, so there is no easy way
 *    to brute force them even for the signer nodes.
 *
 *  - Depends on a secret only known to KimlikDAO protocol signer nodes. The
 *    secret is shared only after a valid registration in a `IDIDSigners`
 *    contract and a challenge/response proof of EVM address ownership.
 *
 *  - Despite the id requiring heavy compute and a secret, it can still be
 *    verified by the DID owner that the ID was generated according to the
 *    prescribed generation protocol. This is achieved by a VDF verification
 *    and an RSA signature verification.
 *
 * @interface
 */
did.VerifiableID = function () { }

/**
 * A length 64 hex string representing an id assigned to a DID owner.
 *
 * @const {string}
 */
did.VerifiableID.prototype.id;

/**
 * The base64 encoded RSASSA-PKCS1-v1_5 signature of the persons info.
 *
 * The `x` value is then fed into the VDF to obtain the `id`.
 *
 * @type {string}
 */
did.VerifiableID.prototype.x;

/**
 * Wesolowski proof π parameter as a base64 encoded number.
 *
 * It satisfies
 *
 *   hash(π^l g^r) = id.
 *
 * where id is VerifiableID.id.
 *
 * @type {string}
 */
did.VerifiableID.prototype.wesolowskiP;

/**
 * Wesolowski proof l parameter as a base64 encoded number.
 *
 * @type {string}
 */
did.VerifiableID.prototype.wesolowskiL;
