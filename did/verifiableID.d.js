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
 *    to brute force.
 *
 *  - Usually also depends on a secret only known to KimlikDAO protocol signer
 *    nodes. In such cases brute force is simply unfeasible.
 *
 *  - Despoite the id requiring heavy compute and a secret, it can still be
 *    verified by the DID owner that the ID is generated according to the
 *    prescribed generation protocol.
 *
 * @interface
 */
did.VerifiableID = function () { }

/**
 * The id assigned to a DID owner.
 *
 * @const {string}
 */
did.VerifiableID.prototype.id;

/**
 * A RSASSA-PKCS1-v1_5 signature of person info, used as the input to the VDF.
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
