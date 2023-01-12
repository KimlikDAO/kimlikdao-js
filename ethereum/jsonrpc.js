
/**
 * @param {string} url
 * @param {string} method
 * @param {!Array<*>} params
 */
const request = () => fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(/** @type {!jsonrpc.Request} */({
    jsonrpc: "2.0",
    id: 1,
    method,
    params
  }))
}).then((res) => res.ok ? res.json() : Promise.reject())
  .then((/** @type {jsonrpc.Response} */ res) => res.result || Promise.reject());

export { request };
