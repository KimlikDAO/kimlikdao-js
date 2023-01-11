/** @const {!Array<string>} */
const Uint8denHexe = [];
for (let /** number */ n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, "0");
  Uint8denHexe.push(hexOctet);
}

/**
 * @param {!Uint8Array} buff hex'e çevrilecek Uint8Array.
 * @return {string} hex temsil eden dizi.
 */
const hex = (buff) => {
  /** @const {!Array<string>} */
  const octets = new Array(buff.length);
  for (let /** number */ i = 0; i < buff.length; ++i)
    octets[i] = Uint8denHexe[buff[i]];
  return octets.join("");
}

/**
 * @param {string} str olarak kodlanmış veri.
 * @return {!Uint8Array} byte dizisi
 */
const hexten = (str) => {
  if (str.length & 1) str += "0";
  /** @const {!Uint8Array} */
  const buff = new Uint8Array(str.length / 2);
  for (let i = 0; i < buff.length; ++i)
    buff[i] = parseInt(str.slice(2 * i, 2 * i + 2), 16);
  return buff;
}

/**
 * @param {!Uint8Array} buff
 * @param {string} str
 */
const uint8ArrayeHexten = (buff, str) => {
  if (str.length & 1) str += "0";
  for (let i = 0; i < buff.length; ++i)
    buff[i] = parseInt(str.slice(2 * i, 2 * i + 2), 16);
}

/**
 * @param {!Uint8Array} bytes base64'e dönüştürülecek buffer.
 * @return {string} base64 temsil eden dizi.
 */
const base64 = (bytes) => {
  /** @type {string} */
  let binary = "";
  /** @const {number} */
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * @param {string} b64 base64 olarak yazılı veri.
 * @return {!Uint8Array}
 */
const base64ten = (b64) => {
  /** @const {string} */
  const decoded = atob(b64);
  /** @const {!Uint8Array} */
  const buffer = new Uint8Array(decoded.length);
  /** @const {number} */
  const len = decoded.length;
  for (let i = 0; i < len; ++i)
    buffer[i] = decoded.charCodeAt(i);
  return buffer;
};

/**
 * @param {!Uint8Array|!Array<number>} buffer
 * @param {string} b64
 */
const uint8ArrayeBase64ten = (buffer, b64) => {
  /** @const {string} */
  const decoded = atob(b64);
  /** @const {number} */
  const len = decoded.length;
  for (let i = 0; i < len; ++i)
    buffer[i] = decoded.charCodeAt(i);
}

export {
  base64,
  base64ten,
  hex,
  hexten,
  uint8ArrayeBase64ten,
  uint8ArrayeHexten,
  Uint8denHexe,
};
