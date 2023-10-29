import { wrapInEffect } from '../../wrapInEffect.js'
import { verifyMessage } from 'viem/actions'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof verifyMessage, import("viem/actions").VerifyMessageErrorType>}
 */
export const verifyMessageEffect = wrapInEffect(verifyMessage)
