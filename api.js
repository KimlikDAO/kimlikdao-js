/**
 * @fileoverview API veri şekli tanımları.
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 * @struct
 */
function HataBildirimi(kod, ek) {
    this.kod = kod;
    this.ek = ek;
}

/** @type {number} */
HataBildirimi.prototype.kod;

/** @type {Array<string>} */
HataBildirimi.prototype.ek;

/**
 * @record
 * @struct
 */
function OAuthAccessToken() {}

/** @type {string} */
OAuthAccessToken.prototype.access_token;

/** @type {string} */
OAuthAccessToken.prototype.token_type;

/** @type {number} */
OAuthAccessToken.prototype.expires_in;

/** @type {string} */
OAuthAccessToken.prototype.scope;

/**
 * @record
 * @struct
 */
function OAuthAccessTokenRequest() {}

/** @type {string} */
OAuthAccessTokenRequest.prototype.grant_type;

/** @type {string} */
OAuthAccessTokenRequest.prototype.code;

/** @type {string} */
OAuthAccessTokenRequest.prototype.client_id;

/** @type {string} */
OAuthAccessTokenRequest.prototype.client_secret;
