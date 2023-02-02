/**
 * @fileoverview Functions for working with `Unlockable`'s.
 *
 * @author KimlikDAO
 */

import { base64, base64ten, hex, hexten } from "../util/çevir";

/**
 * @param {!eth.Unlockable} unlockable
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {!Promise<string>}
 */
const decrypt = (unlockable, provider, address) => {
  switch (unlockable.version) {
    case "x25519-xsalsa20-poly1305": {
      /** @const {!TextEncoder} */
      const encoder = new TextEncoder();
      delete unlockable.userPrompt;
      /** @const {string} */
      const hexEncoded = "0x" +
        hex(encoder.encode(JSON.stringify(unlockable)));
      return provider.request(/** @type {!eth.Request} */({
        method: "eth_decrypt",
        params: [hexEncoded, address]
      }))
        .then((decrypted) => decrypted.slice(43, decrypted.indexOf("\0")));
    }
    case "promptsign-sha256-aes-ctr": {
      return provider.request(/** @type {!eth.Request} */({
        method: "personal_sign",
        params: [unlockable.userPrompt, address]
      }))
        .then((signature) => crypto.subtle.digest("SHA-256", hexten(signature.slice(2, -2))))
        .then((hash) => crypto.subtle.importKey("raw", hash, "AES-CTR", false, ["decrypt"]))
        .then((key) => crypto.subtle.decrypt({
          name: "AES-CTR",
          counter: base64ten(unlockable.nonce),
          length: 64
        },
          key,
          base64ten(unlockable.ciphertext)
        ))
        .then((decrypted) => new TextDecoder().decode(decrypted));
    }
  }
  return Promise.reject();
}

/**
 * @param {string} text
 * @param {string} userPrompt
 * @param {string} version
 * @param {!eth.Provider} provider
 * @param {string} address
 * @return {!Promise<!eth.Unlockable>}
 */
const encrypt = (text, userPrompt, version, provider, address) => {
  switch (version) {
    case "promptsign-sha256-aes-ctr": {
      /** @const {!Uint8Array} */
      const counter = /** @type {!Uint8Array} */(
        crypto.getRandomValues(new Uint8Array(16)));
      return provider.request(/** @type {!eth.Request} */({
        method: "personal_sign",
        params: [userPrompt, address]
      }))
        .then((signature) => crypto.subtle.digest("SHA-256", hexten(signature.slice(2, -2))))
        .then((hash) => crypto.subtle.importKey("raw", hash, "AES-CTR", false, ["encrypt"]))
        .then((key) => crypto.subtle.encrypt({
          name: "AES-CTR",
          counter,
          length: 64
        },
          key,
          new TextEncoder().encode(text)
        ))
        .then((/** @type {!ArrayBuffer} */ encrypted) => /** @type {!eth.Unlockable} */({
          version: "promptsign-sha256-aes-ctr",
          nonce: base64(counter),
          ciphertext: base64(new Uint8Array(encrypted)),
          userPrompt
        }));
    }
  }
  return Promise.reject();
}

export { decrypt, encrypt };
