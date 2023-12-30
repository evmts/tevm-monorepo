import { wrapInEffect } from '../../wrapInEffect.js'
import { toRlp } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toRlp, import("viem/utils").ToRlpErrorType>}
 */
export const toRlpEffect = wrapInEffect(toRlp)
