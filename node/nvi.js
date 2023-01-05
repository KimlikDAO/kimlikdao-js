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
 *   dt: string,
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
 *   mhali: string
 * }}
 */
nvi.KutukBilgileri;

/**
 * @typedef {{
 *   telefon: string,
 *   eposta: string,
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
