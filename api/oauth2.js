/**
 * @author KimlikDAO
 * @externs
 */

/**
 * @const
 */
const jsonrpc = {};

/**
 * @typedef {{
 *   access_token: string,
 *   token_type: string,
 *   expires_in: number,
 *   scope: string
 * }}
 */
oauth2.AccessToken;

/**
 * @typedef {{
 *   grant_type: string,
 *   code: string,
 *   client_id: string,
 *   client_secret: string,
 * }}
 */
oauth2.AccessTokenRequest;
