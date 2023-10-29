import { wrapInEffect } from '../../wrapInEffect.js'
import { hashMessage } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashMessage, import("viem/utils").HashMessageErrorType>}
 */
export const hashMessageEffect = wrapInEffect(hashMessage)
