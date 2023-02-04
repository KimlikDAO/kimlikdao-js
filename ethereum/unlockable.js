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
        .then((signature) => crypto.subtle.digest("SHA-256", hexten(signature.slice(2))))
        .then((hash) => crypto.subtle.importKey("raw", hash, "AES-CTR", false, ["decrypt"]))
        .then((key) => crypto.subtle.decrypt({
          name: "AES-CTR",
          counter: base64ten(unlockable.nonce),
          length: 64
        },
          key,
          base64ten(unlockable.ciphertext)
        ))
        .then((decrypted) => {
          const decoded = new TextDecoder().decode(decrypted);
          return decoded.slice(0, decoded.indexOf("\0"));
        });
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
      /**
       * @param {string} signature
       * @return {!Promise<!eth.Unlockable>}
       */
      const encryptWithSignature = (signature) =>
        crypto.subtle.digest("SHA-256", hexten(signature.slice(2)))
          .then((hash) => crypto.subtle.importKey("raw", hash, "AES-CTR", false, ["encrypt"]))
          .then((key) => crypto.subtle.encrypt({
            name: "AES-CTR",
            counter,
            length: 64
          },
            key,
            padded
          ))
          .then((/** @type {!ArrayBuffer} */ encrypted) => /** @type {!eth.Unlockable} */({
            version: "promptsign-sha256-aes-ctr",
            nonce: base64(counter),
            ciphertext: base64(new Uint8Array(encrypted)),
            userPrompt
          }));

      /** @const {!TextEncoder} */
      const encoder = new TextEncoder();
      /** @const {!Uint8Array} */
      const encoded = encoder.encode(text);
      /** @const {!Uint8Array} */
      const padded = new Uint8Array(encoded.length + 256 - (encoded.length & 255));
      padded.set(encoded);
      /** @const {!Uint8Array} */
      const counter = /** @type {!Uint8Array} */(crypto.getRandomValues(new Uint8Array(16)));

      /** @return {!Promise<string>} */
      const requestSignature = () => provider.request(/** @type {!eth.Request} */({
        method: "personal_sign",
        params: [userPrompt, address]
      }));

      return requestSignature()
        .then(encryptWithSignature)
        .catch((error) => /** @type {!eth.ProviderError} */(error).code == 4001
          ? requestSignature().then((signature) => new Promise(
            (resolve) => setTimeout(() => resolve(encryptWithSignature(signature)), 200)))
          : Promise.reject(error)
        );
    }
  }
  return Promise.reject();
}

export { decrypt, encrypt };
