import { Abi } from 'abitype/zod'

/**
 * Zod validator for a valid ABI
 */
export const zAbi = Abi.describe('A valid ABI')
