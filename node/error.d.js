
/**
 * @param {string} message
 * @param {number} code
 * @return {!Response}
 */
const err = (message, code) => new Response('{hata:"' + message + '"}', {
    status: code,
    headers: { 'content-type': 'application/json' }
})
