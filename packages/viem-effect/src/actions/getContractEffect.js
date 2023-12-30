import { wrapInEffect } from '../wrapInEffect.js'
import { getContract } from 'viem'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof getContract, import("viem").GetContractErrorType>}
 */
export const getContractEffect = wrapInEffect(getContract)
