import { wrapInEffect } from '../../wrapInEffect.js'
import { getSerializedTransactionType } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getSerializedTransactionType, import("viem/utils").GetSerializedTransactionTypeErrorType>}
 */
export const getSerializedTransactionTypeEffect = wrapInEffect(
	getSerializedTransactionType,
)
