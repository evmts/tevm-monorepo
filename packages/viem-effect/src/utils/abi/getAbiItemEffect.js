import { wrapInEffect } from '../../wrapInEffect.js'
import { getAbiItem } from 'viem/abi'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAbiItem, import("viem/abi").GetAbiItemErrorType>}
 */
export const getAbiItemEffect = wrapInEffect(getAbiItem)
