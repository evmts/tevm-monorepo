import { Address } from 'abitype/zod'

/**
 * Zod validator for a valid ethereum address
 */
export const zAddress = Address.describe('A valid ethereum address')
