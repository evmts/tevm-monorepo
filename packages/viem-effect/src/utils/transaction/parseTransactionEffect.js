import { wrapInEffect } from '../../wrapInEffect.js'
import { parseTransaction } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseTransaction, import("viem/utils").ParseTransactionErrorType>}
 */
export const parseTransactionEffect = wrapInEffect(parseTransaction)
