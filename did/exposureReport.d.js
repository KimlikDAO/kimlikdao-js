/**
 * @fileoverview
 *
 * @externs
 */

/**
 * @interface
 */
did.ExposureReportID = function () { }

/** @const {string} */
did.ExposureReportID.prototype.id;

/** @const {string} */
did.ExposureReportID.prototype.proof;

/**
 * @interface
 * @extends {did.Section}
 * @extends {did.ExposureReportID}
 */
did.ExposureReport = function () { }
