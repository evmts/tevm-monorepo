import { createHash } from 'node:crypto'

/**
 * @param {string} value
 * @returns {string}
 */
export const cacheHash = (value) => createHash('sha256').update(value).digest('hex')
