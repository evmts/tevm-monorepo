import { wrapInEffect } from '../../wrapInEffect.js'
import { serializeTransaction } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeTransaction, import("viem/utils").SerializeTransactionErrorType>}
 */
export const serializeTransactionEffect = wrapInEffect(serializeTransaction)
