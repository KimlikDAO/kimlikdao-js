import { verify } from "./verifiableID";

/**
 * Verifies the `did.VerifiableID`'s and removes the ones that fail to verify.
 * Further, strips the proofs from those that were succesfully verified.
 *
 * @param {!did.DecryptedSections} decryptedSections
 * @param {!Object<string, string>} verifyKeys
 * @return {!Promise<!did.DecryptedSections>}
 */
const verifyProofs = (decryptedSections, verifyKeys) => {
  /** @const {string} */
  const localIdNumber = /** @type {!did.PersonInfo} */(
    decryptedSections["personInfo"]).localIdNumber;

  /**
   * @param {string} name
   * @return {!Promise<void>}
   */
  const verifySingle = (name) => {
    /** @const {did.VerifiableID} */
    const verifiableID = /** @type {did.VerifiableID} */(decryptedSections[name]);
    return verifiableID
      ? verify(verifiableID, localIdNumber, verifyKeys[name])
        .then((isValid) => {
          if (isValid) {
            delete verifiableID.wesolowskiL;
            delete verifiableID.wesolowskiP;
            delete verifiableID.x;
          } else
            delete decryptedSections[name];
        })
      : Promise.resolve();
  }
  return Promise.all([verifySingle("exposureReport"), verifySingle("humanID")])
    .then(() => decryptedSections);
}

export { verifyProofs };
