/**
 * @fileoverview TCKT'nin blokzincir dışı saklanan verisini yönetme birimi.
 *
 * @author KimlikDAO
 */
import { kutula } from '../crypto/ed25519';
import { TCKT_ADDR } from '../ethereum/TCKT';

/**
 * @const {string}
 * @noinline
 */
const KIMLIKDAO_URL = "https://kimlikdao.org";

/**
 * Verilen AçıkTCKT'yi `bölümler`'e ayırıp her bölümü ayrı bir unlockable
 * içinde şifreler ve bir `ERC721Unlockable` oluşturur.
 *
 * Şimdilik sadece 2 bölüm destekliyoruz.
 *
 * @param {string} açıkAnahtar
 * @param {!did.DecryptedDID} açıkTckt
 * @param {!Array<!Array<string>>} bölümler
 * @return {!ERC721Unlockable}
 */
const hazırla = (açıkAnahtar, açıkTckt, bölümler) => {
  const encoder = new TextEncoder();
  const kimlik = new Uint8Array(1024);
  const humanId = new Uint8Array(256);
  encoder.encodeInto(TCKT_ADDR, kimlik);
  kimlik[42] = 10;
  humanId.set(kimlik.subarray(0, 43))

  /**
   * @param {Uint8Array} buffer
   * @param {!Array<string>} bölümAdı
   * @return {!ethereum.EncryptedData}
   */
  const unlockableHazırla = (buffer, bölümAdı) => {
    const sakla = new Set(bölümAdı);
    const bölümler = Object.fromEntries(
      Object.entries(açıkTckt).filter((girdi) => sakla.has(/** @type {string} */(girdi[0]))));
    encoder.encodeInto(JSON.stringify(bölümler, null, 2), buffer.subarray(43));
    return kutula(açıkAnahtar, buffer);
  }

  return /** @type {!ERC721Unlockable} */({
    name: "TCKT",
    description: "KimlikDAO Kimlik Tokeni",
    image: KIMLIKDAO_URL + "/TCKT.svg",
    external_url: KIMLIKDAO_URL,
    animation_url: KIMLIKDAO_URL + "/TCKT.mp4",
    unlockables: {
      [bölümler[0].join(",")]: {
        userPrompt: {
          "en-US": ["{1} wants to view your TCKT.", "Provide", "Reject"],
          "tr-TR": ["{1} TCKT’nize erişmek istiyor. İzin veriyor musunuz?", "Evet", "Hayır"]
        },
        ...unlockableHazırla(kimlik, bölümler[0])
      },
      [bölümler[1].join(",")]: {
        userPrompt: {
          "en-US": ["{1} wants to view your KimlikDAO HumanID.", "Provide", "Reject"],
          "tr-TR": ["{1} KimlikDAO HumanID’nize erişmek istiyor. İzin veriyor musunuz?", "Evet", "Hayır"]
        },
        ...unlockableHazırla(humanId, bölümler[1])
      }
    }
  })
}

export { hazırla };
