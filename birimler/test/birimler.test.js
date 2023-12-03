import { assert, describe, it } from "vitest";
import { birimOku, sayfaOku, tagYaz } from "../okuyucu";

describe("tagYaz tests", () => {
  it("should serialize empty tag", () => {
    assert.equal(
      tagYaz("tag", {}, false),
      "<tag>"
    );
  })

  it("should serialize self-closing tags", () => {
    assert.equal(tagYaz("tag2", {}, true), "<tag2/>");
  })

  it("should serialize a tag with attributse", () => {
    assert.equal(
      tagYaz("tag", { a: 2, b: 3, d: 4, e: false }, false),
      '<tag a="2" b="3" d="4" e>'
    )
  })
});

describe("sayfaOku tests", () => {
  it("should remove in prod mode", () => {
    /** @const {string} */
    const sayfa = sayfaOku("ana/sayfa.html", { dil: "tr", dev: true, kök: "birimler/test/" });
    assert.include(sayfa, "ana/sayfa.css");
    assert.include(sayfa, "Cüzdan eklendi");
    assert.include(sayfa, "TCKT eklendi");
    assert.include(sayfa, "birim/tckt/birim.css");

    assert.include(sayfa, "<b>kalın</b>");
    assert.notInclude(sayfa, "bold");
  })

  it("should perform comment substitution", () => {
    /** @const {string} */
    const sayfaEN = sayfaOku("ana/sayfa.html", { dil: "en", kök: "birimler/test/" });
    /** @const {string} */
    const sayfaTR = sayfaOku("ana/sayfa.html", { dil: "tr", kök: "birimler/test/" });
    assert.include(sayfaTR, "Toplam: 1,00");
    assert.include(sayfaEN, "Total: 1.00");
  })

  it("should perform inline substitution", () => {
    /** @const {string} */
    const sayfaEN = sayfaOku("ana/sayfa.html", { dil: "en", dev: true, kök: "birimler/test/" });

    assert.include(sayfaEN, 'svg width="33" height="33"');
    assert.include(sayfaEN, 'svg" id="ansvg"');
    assert.include(sayfaEN, '<path d="M1,2L1,2"/>');
    assert.notInclude(sayfaEN, "</path>");
  })

  it("should perform innertext substitution", () => {
    /** @const {string} */
    const sayfa = sayfaOku("ana/sayfa.html", { dil: "en", dev: false, kök: "birimler/test/" });

    assert.include(sayfa, '<div>Unvan</div>');
    assert.notInclude(sayfa, 'titrspan');
    assert.notInclude
  })

  it("should perform English substitution", () => {
    /** @const {string} */
    const sayfaEN = sayfaOku("ana/sayfa.html", { dil: "en", dev: false, kök: "birimler/test/" });
    /** @const {string} */
    const sayfaTR = sayfaOku("ana/sayfa.html", { dil: "tr", dev: false, kök: "birimler/test/" })

    assert.include(sayfaEN, "REPLACED_TEXT");
    assert.notInclude(sayfaEN, "<test1>");
    assert.notInclude(sayfaEN, "</test1>");

    assert.include(sayfaEN, "REPLACED_2NDTEXT");
    assert.notInclude(sayfaEN, "<test2>");
    assert.notInclude(sayfaEN, "</test2>");
  })
});

describe("birimOku tests", () => {
  it("should perform variable substitution", () => {
    const { html, _ } = birimOku("ana/sayfa.html", { dil: "tr", dev: true, kök: "birimler/test/" }, {});

    assert.include(html, 'id="var1value"');
  })

  it("should eliminate self-closing xml tags", () => {
    const { html, _ } = birimOku("birim/logo.svg", { dil: "tr", dev: false, kök: "birimler/test/" }, {});

    assert.notInclude(html, "</stop>");
    assert.notInclude(html, "</path>");
  })

  it("should perform parametric content generation", () => {
    const { html, _ } = birimOku("birim/cüzdan/birim.html", { dil: "tr", dev: false, kök: "birimler/test/" }, {});

    assert.include(html, "<div>354224848179261915075</div>");
    assert.include(html, "<div>201</div>");
    assert.include(html, "<div>20003</div");
  })
})
