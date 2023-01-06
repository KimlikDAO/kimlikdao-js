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
 * @param {string} exposureReportSecret
 * @return {!did.ExposureReportID}
 */
const generate = (localIdNumber, exposureReportSecret) => {
  return /** @type {!did.ExposureReportID} */({
    id: keccak256(localIdNumber + exposureReportSecret),
    proof: ""
  });
}

export { generate };
