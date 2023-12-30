import { wrapInEffect } from '../../wrapInEffect.js'
import { parseEther } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseEther, import("viem/utils").ParseEtherErrorType>}
 */
export const parseEtherEffect = wrapInEffect(parseEther)
