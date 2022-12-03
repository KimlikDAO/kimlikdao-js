/**
 * TCKT için ek `InfoSection` tanımları.
 *
 * @author KimlikDAO
 * @externs
 */

 /**
 * @interface
 * @extends {did.AddressInfo}
 * @extends {nvi.AdresBilgileri}
 */
did.TürkiyeAdresi = function () { }

/**
 * Kişinin kütük bilgilerini içerir bilgi kartı.
 *
 * @interface
 * @extends {did.InfoSection}
 * @extends {nvi.KutukBilgileri}
 */
did.KütükBilgileri = function () { }

/**
 * @interface
 * @extends {did.InfoSection}
 */
did.SoyZinciri = function () { }

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
did.SoyZinciri.prototype.anneSymmetricKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
did.SoyZinciri.prototype.annePrivateKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
did.SoyZinciri.prototype.babaSymmetricKey;

/**
 * Sağ ebeveynler için `symmetricKey` tutuyoruz.
 *
 * @type {string}
 */
did.SoyZinciri.prototype.babaPrivateKey;
