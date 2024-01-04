import { writeFileSync } from "fs";
import { minify } from "html-minifier";
import htmlMinifierConfig from "./htmlMinifierConfig.js";
import { sayfaOku } from "./okuyucu.js";

/** @const {!Array<string>} */
const args = process.argv;

if (args[3] != "--nominify") {
  /** @const {string} */
  const out = minify(sayfaOku(args[2], { dil: args[3] }, {}), htmlMinifierConfig);

  /** @const {!Array<string>} */
  const parts = args[2].split('.');
  writeFileSync(`build/${parts[0].slice(0, -6)}-${args[3]}.${parts[1]}`, out);
} else {
  /** @const {string} */
  const out = sayfaOku(args[2], { dil: "en" }, {});
  writeFileSync("build/" + args[2], out);
}
