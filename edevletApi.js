/**
 * @fileoverview e-devlet API veri şekli tanımları.
 *
 * @author KimlikDAO
 * @externs
 */

/**
 * @const
 */
var nvi = {};

/**
 * @typedef {{
 *   ad: string,
 *   soyad: string,
 *   dt: number,
 *   TCKN: number,
 *   dyeri: string,
 *   cinsiyet: string
 * }}
 */
nvi.TemelBilgileri;

/**
 * @typedef {{
 *   il: string,
 *   ilçe: string,
 *   mahalle: string,
 *   cilt: number,
 *   hane: number,
 *   BSN: number,
 *   tescil: string,
 *   annead: string,
 *   babaad: string,
 * }}
 */
nvi.KutukBilgileri;

/**
 * @typedef {{
 *   telefon: string,
 *   email: string,
 *   KEP: string,
 *   UETS: string,
 * }}
 */
nvi.IletisimBilgileri;

/**
 * @typedef {{
 *   il: string,
 *   ilçe: string,
 *   mahalle: string,
 *   CSBM: string,
 *   dışKapı: string,
 *   içKapı: string,
 * }}
 */
nvi.AdresBilgileri;

/**
 * @typedef {{
 *   access_token: string,
 *   token_type: string,
 *   expires_in: number,
 *   scope: string
 * }}
 */
var OAuthAccessToken;

/**
 * @typedef {{
 *   grant_type: string,
 *   code: string,
 *   client_id: string,
 *   client_secret: string,
 * }}
 */
var OAuthAccessTokenRequest;
