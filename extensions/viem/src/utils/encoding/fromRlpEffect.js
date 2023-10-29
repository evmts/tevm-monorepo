import { wrapInEffect } from '../../wrapInEffect.js'
import { fromRlp } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromRlp, import("viem/utils").FromRlpErrorType>}
 */
export const fromRlpEffect = wrapInEffect(fromRlp)
