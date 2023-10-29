import { wrapInEffect } from '../../wrapInEffect.js'
import { formatAbiItem } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItem, import("viem/contract").FormatAbiItemErrorType>}
 */
export const formatAbiItemEffect = wrapInEffect(formatAbiItem)
