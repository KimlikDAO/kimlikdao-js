import { existsSync, readFileSync } from "fs";
import { Parser } from "htmlparser2";
import { createRequire } from "module";
import { renderParagraph } from "./latex.js";

const require = createRequire(process.cwd() + "/");

/**
 * @enum {number}
 */
const HataKodu = {
  UNSUPPORTED_INLINE: 1,
  NESTED_REPLACE: 2,
  INCORRECT_PHANTOM: 3
}

/**
 * @typedef {{
 *   dil: string,
 *   dev: boolean,
 *   kök: string,
 * }}
 */
const Seçimler = {};

/** @const {!Object<string, boolean>} */
const KapalıTagler = {
  circle: true,
  ellipse: true,
  feblend: true,
  feBlend: true,
  feFlood: true,
  fegaussianblur: true,
  feGaussianBlur: true,
  image: true,
  path: true,
  rect: true,
  stop: true,
  use: true,
  polygon: true,
};

/**
 * @param {string} ad
 * @param {!Object<string, string>} nitelikler
 * @param {boolean} kapalı
 * @return {string}
 */
const tagYaz = (ad, nitelikler, kapalı) => {
  /** @type {string} */
  let html = "<" + ad;
  for (const /** string */ nitelik in nitelikler)
    html += nitelikler[nitelik]
      ? ` ${nitelik}="${nitelikler[nitelik]}"`
      : " " + nitelik;
  return html + (kapalı ? "/>" : ">");
}

/**
 * @param {string} birimAdı
 * @param {!Seçimler} seçimler
 * @param {!Object<string, string>}  anaNitelikler
 * @return {{
*   html: string,
*   cssler: !Array<string>
* }}
*/
const birimOku = (birimAdı, seçimler, anaNitelikler) => {
  seçimler.kök ||= "";
  /** @const {boolean} */
  const EN = seçimler.dil == "en";
  /** @const {!Array<string>} */
  const cssler = [];
  /** @type {string} */
  let html = "";
  /** @const {!Array<boolean>} */
  const phantom = [];
  /** @type {number} */
  let derinlik = 0;
  /** @type {number} */
  let değiştirDerinliği = 0;
  /** @type {string} */
  let sırada;
  /** @type {boolean} */
  let latexVar = false;
  /** @type {number} */
  let latexDerinliği = 0;

  /** @const {!Object<string, string>} */
  const değerler = Object.assign({}, seçimler);
  for (const nitelik in anaNitelikler)
    if (nitelik.startsWith("data-")) {
      değerler[nitelik.slice(5)] = anaNitelikler[nitelik];
      delete anaNitelikler[nitelik];
    }

  if (birimAdı.endsWith(".cjs")) {
    const üreticiBirim = require("./" + seçimler.kök + birimAdı, "utf8");
    return {
      html: üreticiBirim.üret(değerler),
      cssler: [],
    };
  }
  /** @const {!Parser} */
  const parser = new Parser({
    onopentag(ad, nitelikler, kapalı) {
      kapalı ||= KapalıTagler[ad];
      derinlik += 1;

      if ("data-dev-remove" in nitelikler) {
        delete nitelikler["data-dev-remove"];
        if (seçimler.dev) return;
      }
      if ("data-remove" in nitelikler) {
        delete nitelikler["data-remove"];
        if (!seçimler.dev) return;
      }
      if ("data-remove-if" in nitelikler) {
        const remove = değerler[nitelikler["data-remove-if"]]
        delete nitelikler["data-remove-if"];
        if (remove) return;
      }

      if (değiştirDerinliği > 0) return;

      for (const /** string */ nitelik in nitelikler) {
        if (nitelik.startsWith("data-remove-")) {
          if (!seçimler.dev)
            delete nitelikler[nitelik.slice("data-remove-".length)];
          delete nitelikler[nitelik];
        } else if (nitelik.startsWith("data-en-")) {
          if (EN) nitelikler[nitelik.slice("data-en-".length)] = nitelikler[nitelik];
          delete nitelikler[nitelik];
        } else if (nitelik.startsWith("data-set-")) {
          /** @const {string} */
          const value = değerler[nitelikler[nitelik]];
          if (value) nitelikler[nitelik.slice("data-set-".length)] = value;
          delete nitelikler[nitelik];
        }
      }

      // TODO(KimlikDAO-bot): Birimin içini parse edip birime yolla.
      if (ad.startsWith("birim:")) {
        const {
          html: /** @const {string} */ birimHtml,
          cssler: /** @const {!Array<string>} */ birimCssler
        } = birimOku(`birim/${ad.slice(6)}/birim.html`, seçimler, nitelikler);
        html += birimHtml;
        cssler.push(...birimCssler);
        return;
      }

      if (ad.startsWith("altbirim:")) {
        /** @const {string} */
        const sayfaAdı = birimAdı.slice(0, birimAdı.indexOf("/"));
        const {
          html: /** @const {string} */ birimHtml,
          cssler: /** @const {!Array<string>} */ birimCssler
        } = birimOku(`${sayfaAdı}/${ad.slice(9)}/birim.html`, seçimler, nitelikler);
        html += birimHtml;
        cssler.push(...birimCssler);
        return;
      }

      if ("data-inline" in nitelikler) {
        if (ad != "img") {
          console.error("Şimdilik sadece img inline edilebilir!");
          process.exit(HataKodu.UNSUPPORTED_INLINE);
        }
        /** @type {string} */
        let inlineAdı = (nitelikler["data-inline"] || nitelikler.src).slice(1);
        if (!seçimler.dev && inlineAdı.endsWith(".svg"))
          inlineAdı = `build/${inlineAdı}.inl`;
        delete nitelikler["data-inline"];
        delete nitelikler["src"];
        const {
          html: birimHtml,
          cssler: _,
        } = birimOku(inlineAdı, seçimler, nitelikler);
        html += birimHtml;
        return;
      }

      /** @type {string} */
      let değiştirMetni = "";
      if ("data-en" in nitelikler) {
        if (değiştirDerinliği) {
          console.error("İç içe dile göre değiştirme mümkün değil");
          process.exit(HataKodu.NESTED_REPLACE);
        }
        if (EN) {
          değiştirDerinliği = derinlik;
          değiştirMetni = nitelikler["data-en"];
        }
        delete nitelikler["data-en"];
      }

      if ("data-generate" in nitelikler) {
        if (değiştirDerinliği) {
          console.error("İç içe değiştirme mümkün değil");
          process.exit(HataKodu.NESTED_REPLACE);
        }
        /** @const {boolean} */
        const phantom = "data-phantom" in nitelikler;
        /** @const {string} */
        const üreticiAdı =
          `${birimAdı.slice(0, birimAdı.lastIndexOf("/"))}/${nitelikler["data-generate"]}.cjs`;
        delete nitelikler["data-generate"];
        const {
          html: üretilenHtml,
          _
        } = birimOku(üreticiAdı, değerler, nitelikler);
        if (phantom) nitelikler["data-phantom"] = "";

        if (üretilenHtml) {
          değiştirDerinliği = derinlik;
          değiştirMetni = üretilenHtml;
        }
      }

      if ("data-latex" in nitelikler) {
        latexVar = true;
        latexDerinliği = derinlik;
        delete nitelikler["data-latex"];
      }

      if ("data-phantom" in nitelikler) {
        if (ad != "span" && ad != "g" && ad != "div") {
          console.error("Span div, veya g olmayan phantom!");
          process.exit(HataKodu.INCORRECT_PHANTOM);
        }
        phantom[derinlik] = true;
      } else {
        if (derinlik == 1)
          Object.assign(nitelikler, anaNitelikler);
        html += tagYaz(ad, nitelikler, kapalı);
      }

      html += değiştirMetni;
    },

    ontext(metin) {
      if (değiştirDerinliği <= 0) {
        if (sırada) {
          html += latexDerinliği > 0
            ? renderParagraph(metin)
            : sırada;
          sırada = null;
        } else
          html += latexDerinliği > 0
            ? renderParagraph(metin)
            : metin;
      }
    },

    oncomment(yorum) {
      yorum = yorum.trim();
      if (EN && yorum.startsWith("en:"))
        sırada = yorum.slice(3);
    },

    onclosetag(ad, hayali) {
      hayali ||= KapalıTagler[ad];
      sırada = null;
      if (derinlik == değiştirDerinliği)
        değiştirDerinliği = 0;
      if (derinlik == latexDerinliği)
        latexDerinliği = 0;
      if (değiştirDerinliği == 0 && !phantom[derinlik] && !hayali)
        html += `</${ad}>`;

      phantom[derinlik] = false;
      derinlik -= 1;
    },

    onprocessinginstruction(ad, veri) {
      if (ad.toLowerCase() == "!doctype")
        html += `<${veri}>`;
    }
  }, {
    recongnizeSelfClosing: true,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
  });

  if (existsSync(seçimler.kök + birimAdı.slice(0, -4) + "css"))
    cssler.push(birimAdı.slice(0, -4) + "css");
  parser.end(readFileSync(seçimler.kök + birimAdı, "utf8"));
  if (latexVar)
    cssler.push("/lib/util/latex.css");

  return {
    html,
    cssler
  }
}

/**
 * @param {string} sayfaAdı
 * @param {!Seçimler} seçimler
 * @return {string}
 */
const sayfaOku = (sayfaAdı, seçimler) => {
  const { html, cssler } = birimOku(sayfaAdı, seçimler, {});
  if (seçimler.dev) {
    /** @const {string} */
    const linkler = cssler.slice(1)
      .map((css) => `  <link href="${css}" rel="stylesheet" type="text/css" />\n`)
      .join('');
    return html.replace("</head>", linkler + "</head>");
  }
  return html;
}

export {
  HataKodu,
  birimOku,
  sayfaOku,
  tagYaz
};
