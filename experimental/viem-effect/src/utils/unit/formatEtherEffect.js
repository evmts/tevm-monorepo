import { wrapInEffect } from '../../wrapInEffect.js'
import { formatEther } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatEther, import("viem/utils").FormatEtherErrorType>}
 */
export const formatEtherEffect = wrapInEffect(formatEther)
