/**
 * @fileoverview Functions for working with `Unlockable`'s.
 *
 * @author KimlikDAO
 */

import { base64ten, hex, hexten, uint8ArrayeBase64ten } from "../util/çevir";

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
      return provider.request(/** @type {eth.Request} */({
        method: "personal_sign",
        params: [unlockable.userPrompt, address]
      }))
        .then((signature) => crypto.subtle.digest("SHA-256", hexten(signature.slice(2, -2))))
        .then((hash) => crypto.subtle.importKey("raw", hash, "AES-CTR", false, ["decrypt"]))
        .then((key) => {
          const counter = new Uint8Array(16);
          uint8ArrayeBase64ten(counter, unlockable.nonce);
          return crypto.subtle.decrypt({
            name: "AES-CTR",
            counter,
            length: 64
          }, key, base64ten(unlockable.ciphertext));
        })
        .then((decrypted) => new TextDecoder().decode(decrypted));
    }
  }
  return Promise.reject();
}

export { decryptUnlockable };
