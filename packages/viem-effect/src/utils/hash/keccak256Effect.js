import { wrapInEffect } from '../../wrapInEffect.js'
import { keccak256 } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof keccak256, import("viem/utils").Keccak256ErrorType>}
 */
export const keccak256Effect = wrapInEffect(keccak256)
