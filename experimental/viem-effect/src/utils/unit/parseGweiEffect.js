import { wrapInEffect } from '../../wrapInEffect.js'
import { parseGwei } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseGwei, import("viem/utils").ParseGweiErrorType>}
 */
export const parseGweiEffect = wrapInEffect(parseGwei)
