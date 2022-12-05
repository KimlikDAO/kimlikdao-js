/**
 * @fileoverview Functions for working with `Unlockable`'s.
 *
 * @author KimlikDAO
 */

import { hex } from "../util/çevir";

/**
 * @param {!eth.Unlockable} unlockable
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {Promise<string>}
 */
const decryptUnlockable = (unlockable, provider, address) => {
  /** @const {TextEncoder} */
  const asciiEncoder = new TextEncoder();
  switch (unlockable.version) {
    case "x25519-xsalsa20-poly1305": {
      delete unlockable.userPrompt;
      /** @const {string} */
      const hexEncoded = "0x" +
        hex(asciiEncoder.encode(JSON.stringify(unlockable)));
      return provider.request(/** @type {eth.Request} */({
        method: "eth_decrypt",
        params: [hexEncoded, address]
      }))
        .then((decrypted) => decrypted.slice(43, decrypted.indexOf("\0")));
    }
    case "promptsign-sha256-aes-ctr": {

    }
  }
  return Promise.reject();
}

export { decryptUnlockable };
