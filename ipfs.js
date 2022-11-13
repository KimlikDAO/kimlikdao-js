import { base58 } from './util/çevir';

/**
 * @const {string}
 * @noinline
 */
const IPFS_URL = "https://ipfs.kimlikdao.org/";

/**
 * @param {!Uint8Array} data heş
 * @return {Promise<ArrayBuffer>}
 */
const hash = (data) => {
  let encoded = new Uint8Array(8 + 2680 + 3);
  encoded.set([10, 128, 21, 8, 2, 18, 248, 20], 0)
  encoded.set(data, 8);
  encoded.set([24, 248, 20], 8 + 2680);
  return crypto.subtle.digest('SHA-256', encoded);
}

/**
 * @param {!Uint8Array} hash
 * @return {string} CID
 */
const CID = (hash) => {
  let bytes = new Uint8Array(34);
  bytes.set([18, 32], 0)
  bytes.set(hash, 2);
  return base58(bytes);
}

/**
 * @param {!Uint8Array} cidByte
 * @return {Promise<string>}
 */
const cidBytetanOku = (cidByte) => {
  const yerelCID = CID(cidByte);
  return fetch(IPFS_URL + "ipfs/" + yerelCID)
    .then((res) => res.arrayBuffer())
    .then((buf) => hash(new Uint8Array(buf))
      .then((gelenByte) => CID(new Uint8Array(gelenByte)) === yerelCID
        ? new TextDecoder().decode(buf)
        : Promise.reject("IPFS hash'i tutmadı"))
    );
}

/**
 * @param {string} veri IPFS'e yazılacak veri.
 * @return {Promise<!Uint8Array>} onaylanmış IPFS cidByte.
 */
const yaz = (veri) => {
  console.log(veri);
  /** @type {!Uint8Array} */
  const encoded = new TextEncoder().encode(veri);
  console.log(encoded.length);
  const formData = new FormData()
  formData.set("blob", new Blob([encoded]));
  const gelenSöz = fetch(IPFS_URL + "api/v0/add", {
    method: "POST",
    body: formData
  }).then((res) => res.json()).then((res) => res["Hash"])

  return Promise.all([gelenSöz, hash(encoded).then((h) => new Uint8Array(h))])
    .then(([gelen, yerel]) => {
      if (CID(yerel) != gelen) {
        console.log(CID(yerel));
        console.log(gelen);
        Promise.reject("IPFS'ten farklı sonuç döndü.");
      }
      return yerel;
    })
}

export default {
  CID,
  cidBytetanOku,
  hash,
  yaz,
};
