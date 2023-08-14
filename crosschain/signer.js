/**
 * @interface
 * @struct
 */
function Signer() { }

/**
 * @param {string} message
 * @param {string} address
 * @return {!Promise<string>}
 */
Signer.prototype.signMessage = (message, address) => { }

export { Signer };
