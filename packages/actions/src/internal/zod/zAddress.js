import { Address } from 'abitype/zod'

/**
 * Validator for a valid ethereum address
 * @type {any}
 */
export const zAddress = Address.describe('A valid ethereum address')
