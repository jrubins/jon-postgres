export const APP_ENV_LOCAL = 'local'
export const APP_ENV_STAGING = 'staging'

/**
 * Returns if we're currently debugging or not.
 *
 * @returns {Boolean}
 */
export function isDebug() {
  return process.env.DEBUG
}

/**
 * Returns if we're currently in development or not.
 *
 * @returns {Boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}
