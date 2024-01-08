import { create } from "/cloudflare/pageWorker";
import { assertEq } from "/testing/assert";

/**
 * @constructor
 * @implements {cloudflare.KeyValue}
 */
function KeyKey() { }

/**
 * @override
 *
 * @param {string} key
 * @param {string} type
 * @return {!Promise<ArrayBuffer>}
 */
KeyKey.prototype.get = (key, type) =>
  Promise.resolve(new TextEncoder().encode(key).buffer);

/**
 * @override
 *
 * @param {string} key
 * @param {string|!ArrayBuffer} value
 * @return {!Promise<void>}
 */
KeyKey.prototype.put = (key, value) => Promise.resolve()
  .then(() => console.log(key, value));

/**
 * @override
 *
 * @param {string} key
 * @return {!Promise<void>}
 */
KeyKey.prototype.delete = (key) => Promise.resolve();

/**
 * @override
 *
 * @return {!Promise<!cloudflare.KeyValueList>}
 */
KeyKey.prototype.list = () => Promise.resolve(new cloudflare.KeyValueList());

globalThis["caches"] = {};
globalThis["caches"]["default"] = /** @type {!Cache} */({
  /**
   * @param {string} key
   * @return {!Promise<Response>}
   */
  match(key) {
    console.log(key)
    return Promise.resolve(null);
  },

  /**
   * @param {string} key
   * @param {!Response} res
   */
  put(key, res) { return Promise.resolve(); },
});

/** @const {!cloudflare.PageWorkerEnv} */
const env = /** @type {!cloudflare.PageWorkerEnv} */({
  KV: new KeyKey()
});

/** @const {!cloudflare.Context} */
const ctx = /** @type {!cloudflare.Context} */({
  /**
   * @param {!Promise<*>} promise
   */
  waitUntil(promise) { }
})

/**
 * @param {string} url
 * @param {string} encoding
 * @param {string} cookie
 * @return {!cloudflare.Request}
 */
const createRequest = (url, encoding, cookie) => /** @type {!cloudflare.Request} */({
  url,
  headers: {
    /**
     * @param {string} key
     * @return {?string}
     */
    get(key) { return key.toLowerCase() == "cookie" ? cookie : ""; }
  },
  cf: {
    clientAcceptEncoding: encoding
  }
});

/** @const {!cloudflare.ModuleWorker} */
const PageWorker = create("https://kimlikdao.org/", {
  "?tr": "ana-tr.html",
  "?en": "ana-en.html",
  "al": "al-tr.html",
  "mint": "al-en.html",
  "tcktm": "tcktm-tr.html",
  "my-tckt": "tcktm-en.html",
  "oyla": "oyla-tr.html",
  "vote": "oyla-en.html",
  "iptal": "iptal-tr.html",
  "revoke": "iptal-en.html"
});

const testKvName = (url, acceptEncoding, cookie, kvName) => /** @type {!Promise<Response>} */(
  PageWorker.fetch(
    createRequest(url, acceptEncoding, cookie), env, ctx))
  .then((res) => res.text())
  .then((res) => assertEq(res, kvName));

testKvName("https://kimlikdao.org/", "br", "l=tr", "ana-tr.html.br");
testKvName("https://kimlikdao.org/", "br", null, "ana-en.html.br");
testKvName("https://kimlikdao.org/?tr", "gzip", "l=en", "ana-tr.html.gz");
testKvName("https://kimlikdao.org/?en", "", "l=tr", "ana-en.html");
testKvName("https://kimlikdao.org/?utm_source=Wallet", "br, gzip", null, "ana-en.html.br");
testKvName("https://kimlikdao.org/?utm", "gzip, br", "l=tr", "ana-tr.html.br");
testKvName("https://kimlikdao.org/abc.woff2", "br", null, "abc.woff2");
testKvName("https://kimlikdao.org/vote", "br", null, "oyla-en.html.br");
testKvName("https://kimlikdao.org/vote", "gzip", "l=tr", "oyla-en.html.gz");
