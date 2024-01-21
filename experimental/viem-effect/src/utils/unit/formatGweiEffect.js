import { wrapInEffect } from '../../wrapInEffect.js'
import { formatGwei } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatGwei, import("viem/utils").FormatGweiErrorType>}
 */
export const formatGweiEffect = wrapInEffect(formatGwei)
