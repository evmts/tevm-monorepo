import { Abi } from 'abitype/zod'

/**
 * Zod validator for a valid ABI
 * @type {import('zod').ZodType}
 */
export const zAbi = Abi.describe('A valid ABI')
