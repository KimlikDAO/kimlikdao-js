/**
 * @fileoverview TCKT'nin içerdiği bilgilerin şekil tanımları.
 * @author KimlikDAO
 * @externs
 */

/**
 * @interface
 */
function InfoSection() { }

/**
 * Contains the fundamental identification data of a person such as
 * name, date of birth, national id etc.
 *
 * @interface
 * @extends {InfoSection}
 */
function PersonInfo() { };

/** @type {string} */
PersonInfo.prototype.first;

/** @type {string} */
PersonInfo.prototype.last;

/** @type {string} */
PersonInfo.prototype.localIdNumber;

/** @type {string} */
PersonInfo.prototype.dateOfBirth;

/** @type {string} */
PersonInfo.prototype.cityOfBirth;

/** @type {string} */
PersonInfo.prototype.gender;


/**
 * Kişinin aile bilgilerini içerir bilgi kartı.
 *
 * @interface
 * @extends {InfoSection}
 */
function AileBilgileri() { }

/** @type {string} */
AileBilgileri.prototype.annead;

/** @type {string} */
AileBilgileri.prototype.babaad;

/** @type {number} */
AileBilgileri.prototype.BSN;

/** @type {number} */
AileBilgileri.prototype.cilt;

/** @type {number} */
AileBilgileri.prototype.hane;

/** @type {string} */
AileBilgileri.prototype.mhali;

/** @type {string} */
AileBilgileri.prototype.din;


/**
 * Kişinin kütük bilgilerini içerir bilgi kartı.
 *
 * @interface
 * @extends {InfoSection}
 */
function KütükBilgileri() { };

/** @type {string} */
KütükBilgileri.prototype.il;

/** @type {string} */
KütükBilgileri.prototype.ilçe;

/** @type {string} */
KütükBilgileri.prototype.mahalle;

/** @type {string} */
KütükBilgileri.prototype.tescil;

/** @type {string} */
KütükBilgileri.prototype.taahhüt;


/**
 * @interface
 * @type {Object<string, InfoSection>}
 */
function AçıkTCKT() { };
