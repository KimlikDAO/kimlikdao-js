/**
 * @fileoverview TCKT'nin blokzincir dışı saklanan verisini yönetme birimi.
 *
 * @author KimlikDAO
 */

import { TCKT_ADDR } from "../ethereum/TCKT";
import dom from "../util/dom";
import { hex } from "../util/çevir";
import { SectionGroup } from "./decryptedSections";

/**
 * @const {string}
 * @noinline
 */
const KIMLIKDAO_URL = "https://kimlikdao.org";

/** @const {string} */
const İmzaİsteğiTR = `TCKT Erişim İsteği:
-------------------------------------------------
(TR)Bu mesajı imzaladığınızda, bağlı uygulama TCKT’nizin

  {}

bölümlerine erişebilecek. Bu mesajı sadece bu bilgileri paylaşmak istiyorsanız imzalayın.\n\n\n`
/** @const {string} */
const İmzaİsteğiEN = `TCKT Access Request:
-------------------------------------------------
(EN)When you sign this message, the connected app will have access to

  {}

sections of your TCKT. Only sign this message if you would like to share this information.\n\n\n`

/**
 * @param {!Array<string>} bölümler
 * @param {string=} girişTr
 * @param {string=} girişEn
 * @return {!SectionGroup}
 */
const bölüm = (bölümler, ağ, girişTr, girişEn) => /** @type {!SectionGroup} */({
  sectionNames: bölümler,
  userPrompt: (dom.TR ? İmzaİsteğiTR + İmzaİsteğiEN : İmzaİsteğiEN + İmzaİsteğiTR)
    .replace(/{}/g, bölümler.join(",\n  "))
    .replace("(TR)", girişTr || "")
    .replace("(EN)", girişEn || "")
    + "Nonce: " + hex(/** @type {!Uint8Array} */(crypto.getRandomValues(new Uint8Array(8))))
    + "\nChainId: " + ağ
    + "\nNFT: " + TCKT_ADDR
});

/**
 * @param {string} ağ
 * @return {{
 *   metadata: !eth.ERC721Metadata,
 *   bölümler: !Array<SectionGroup>
 * }}
 */
const metadataVeBölümler = (ağ) => ({
  metadata: /** @type {!eth.ERC721Metadata} */({
    name: "TCKT",
    description: "KimlikDAO Kimlik Tokeni",
    image: KIMLIKDAO_URL + "/TCKT.svg",
    external_url: KIMLIKDAO_URL,
    animation_url: KIMLIKDAO_URL + "/TCKT.mp4",
  }),
  bölümler: [
    bölüm(["personInfo", "contactInfo", "addressInfo", "kütükBilgileri"], ağ),
    bölüm(["contactInfo", "humanID"], ağ),
    bölüm(["humanID"], ağ),
    bölüm(["exposureReport"], ağ,
      "https://kimlikdao.org adresinde olduğunuzdan emin olun! Bu adreste değilseniz bu metni imzalamayın.\n\n",
      "Ensure that you're on https://kimlikdao.org. If not, don't sign this message!\n\n"
    )
  ]
});

export { metadataVeBölümler };
