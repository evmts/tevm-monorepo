import { wrapInEffect } from '../../wrapInEffect.js'
import { getTransactionType } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getTransactionType, never>}
 */
export const getTransactionTypeEffect = wrapInEffect(getTransactionType)
