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
 * @typedef {{
 *   sections: !Array<string>,
 *   userPrompt: !Object<string, !Array<string>>,
 *   signPrompt: string
 * }}
 */
var InfoGroup;

/**
 * Verilen AçıkTCKT'yi `bölümler`'e ayırıp her bölümü ayrı bir unlockable
 * içinde şifreler ve bir `eth.ERC721Unlockable` oluşturur.
 *
 * @param {string} açıkAnahtar
 * @param {!did.DecryptedDID} açıkTckt
 * @param {!Array<!InfoGroup>} kümeler
 * @return {!eth.ERC721Unlockable}
 */
const hazırla = (açıkAnahtar, açıkTckt, kümeler) => {
  const encoder = new TextEncoder();

  /**
   * @param {!Array<string>} bölümAdları
   * @return {!eth.EncryptedData}
   */
  const unlockableHazırla = (bölümAdları) => {
    /** @const {!did.DecryptedDID} */
    const bölümler = {};
    for (const bölüm of bölümAdları)
      if (bölüm in açıkTckt) bölümler[bölüm] = açıkTckt[bölüm];
    /** @const {!Uint8Array} */
    const encoded = encoder.encode(JSON.stringify(bölümler, null, 2));
    const boy = encoded.length + 43;
    const dolgulu = new Uint8Array(boy + 128 - (boy & 127));
    encoder.encodeInto(TCKT_ADDR, dolgulu)
    dolgulu[42] = 10;
    dolgulu.set(encoded, 43);
    return kutula(açıkAnahtar, dolgulu);
  }

  /** @const {!Object<string, !eth.Unlockable>} */
  const unlockables = {};
  for (const küme of kümeler)
    unlockables[küme.sections.join(",")] = /** @type {!eth.Unlockable} */({
      userPrompt: küme.userPrompt,
      ...unlockableHazırla(küme.sections)
    })

  return /** @type {!eth.ERC721Unlockable} */({
    name: "TCKT",
    description: "KimlikDAO Kimlik Tokeni",
    image: KIMLIKDAO_URL + "/TCKT.svg",
    external_url: KIMLIKDAO_URL,
    animation_url: KIMLIKDAO_URL + "/TCKT.mp4",
    unlockables,
  });
}

export { hazırla };
