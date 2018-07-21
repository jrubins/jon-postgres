import moment from 'moment'

/**
 * Formats the provided date into the requested format.
 *
 * @param {Date|Number|String} date
 * @param {String} dateFormat
 * @returns {String}
 */
export function formatDate(date, dateFormat) {
  return moment(date).format(dateFormat)
}
