/**
 * @fileoverview ExposureReport implementation.
 * Calculates ExposureReport from a localIDNumber via a VDF.
 *
 * @author KimlikDAO
 */

import { keccak256 } from "/lib/crypto/sha3";

/**
 * TODO(KimlikDAO-bot): This is a placeholder implementation. Implement a
 * suitable VDF.
 *
 * @param {string} localIdNumber
 * @return {!ExposureReport}
 */
const generate = (localIdNumber) => {
  return {
    id: keccak256(localIdNumber),
    proof: ""
  }
}

export { generate };
