/**
 * @fileoverview HumanID implementation.
 *
 * @author KimlikDAO
 */

import { keccak256 } from "/lib/crypto/sha3";

/**
 * TODO(KimlikDAO-bot): This is a placeholder implementation. Implement a
 * suitable VDF.
 *
 * @param {string} localIdNumber
 * @param {string} humanIdSecret
 * @return {!did.HumanID}
 */
const generateHumanID = (localIdNumber, humanIdSecret) => {
  return /** @type {!did.HumanID} */({
    generic: keccak256(localIdNumber + humanIdSecret),
    proof: ""
  });
}

export { generateHumanID };
