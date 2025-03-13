import { Abi } from 'abitype/zod'

/**
 * Validator for a valid ABI
 * @type {any}
 */
export const zAbi = Abi.describe('A valid ABI')
