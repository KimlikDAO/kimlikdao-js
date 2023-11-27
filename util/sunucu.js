import express from "express";
import { createServer } from "vite";
import { sayfaOku } from "./birimler.js";

const devSunucu = (port, sayfalar) => createServer({
  server: { middlewareMode: true },
  appType: "custom"
}).then((vite) => {
  const app = express();
  app.get("/*.svg", (req, res) => {
    const sayfaAdı = decodeURIComponent(req.path.slice(1));
    const svg = sayfaOku(sayfaAdı, { dil: "en", dev: true })
    res.status(200).set({ "content-type": "image/svg+xml" }).end(svg);
  })
  app.use(vite.middlewares)
  app.use(Object.keys(sayfalar), (req, res, next) => {
    if (!(req.path in sayfalar)) {
      res.status(200).end(); // Dev sunucuda hata vermemeye çalış
    } else {
      const { ad, dil } = sayfalar[req.path]
      /** @const {string} */
      const sayfa = sayfaOku(ad, {
        dil: "tr" in req.query ? "tr" : "en" in req.query ? "en" : dil,
        dev: true
      });
      vite.transformIndexHtml(req.path, sayfa).then((sayfa) => {
        res.status(200)
          .set({ 'Content-type': 'text/html;charset=utf-8' })
          .end(sayfa);
      }).catch((e) => {
        vite.ssrFixStacktrace(e)
        next(e)
      })
    }
  });
  app.listen(port);
});

export {
  devSunucu
};
