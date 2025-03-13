import { Address } from 'abitype/zod'

/**
 * Zod validator for a valid ethereum address
 * @type {import('zod').ZodType}
 */
export const zAddress = Address.describe('A valid ethereum address')
