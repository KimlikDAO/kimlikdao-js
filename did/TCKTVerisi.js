/**
 * @fileoverview TCKT'nin blokzincir dışı saklanan verisini yönetme birimi.
 *
 * @author KimlikDAO
 */
import { TCKT_ADDR } from '../ethereum/TCKT';

/**
 * @const {string}
 * @noinline
 */
const KIMLIKDAO_URL = "https://kimlikdao.org";

const İmzaİsteğiTR = `TCKT Erişim İsteği:
-------------------------------------------------
Bu mesajı imzaladığınızda, bağlı uygulama TCKT’nizin

{}

bölümlerine erişebilecek. Bu mesajı sadece bu bilgileri paylaşmak istiyorsanız imzalayın.
`
const İmzaİsteğiEN = `TCKT Access Request:
-------------------------------------------------
When you sign this message, the connected app will have access to

{}

sections of your TCKT. Only sign this message if you would like to share this information.`

/**
 * @typedef {{
 *   sections: !Array<string>,
 *   userPrompt: !Object<string, !Array<string>>,
 *   signPrompt: string
 * }}
 */
var InfoGroup;

[{
  sections: ["personInfo", "contactInfo", "addressInfo", "kütükBilgileri"],
  userPrompt: {
    "en-US": ["{1} wants to view your TCKT.", "Provide", "Reject"],
    "tr-TR": ["{1} TCKT’nize erişmek istiyor. İzin veriyor musunuz?", "Evet", "Hayır"]
  },
  signPrompt: "",
}, {
  sections: ["contactInfo", "humanID"],
  userPrompt: {
    "en-US": ["{1} wants to view your KimlikDAO HumanID, email and phone number.", "Provide", "Reject"],
    "tr-TR": ["{1} KimlikDAO HumanID, email ve telefon numaranıza erişmek istiyor. İzin veriyor musunuz?", "Evet", "Hayır"]
  },
  signPrompt: "",
}, {
  sections: ["humanID"],
  userPrompt: {
    "en-US": ["{1} wants to view your KimlikDAO HumanID.", "Provide", "Reject"],
    "tr-TR": ["{1} KimlikDAO HumanID’nize erişmek istiyor. İzin veriyor musunuz?", "Evet", "Hayır"]
  },
  signPrompt: ""
}, {
  sections: ["exposureReportID"],
}
]

/**
 * Verilen AçıkTCKT'yi `bölümler`'e ayırıp her bölümü ayrı bir unlockable
 * içinde şifreler ve bir `eth.ERC721Unlockable` oluşturur.
 *
 * @param {!did.DecryptedSections} açıkTckt
 * @param {!eth.Provider} provider
 * @param {!Array<!InfoGroup>} kümeler
 * @return {!eth.ERC721Unlockable}
 */
const hazırla = (açıkTckt, kümeler) => {
  const encoder = new TextEncoder();

  /**
   * @param {!Array<string>} bölümAdları
   * @return {!eth.EncryptedData}
   */
  const unlockableHazırla = (bölümAdları) => {
    /** @const {!did.DecryptedSections} */
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
    return {};
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
