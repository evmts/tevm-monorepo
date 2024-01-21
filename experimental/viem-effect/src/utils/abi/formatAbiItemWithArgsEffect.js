import { wrapInEffect } from '../../wrapInEffect.js'
import { formatAbiItemWithArgs } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItemWithArgs, import("viem/contract").FormatAbiItemWithArgsErrorType>}
 */
export const formatAbiItemWithArgsEffect = wrapInEffect(formatAbiItemWithArgs)
