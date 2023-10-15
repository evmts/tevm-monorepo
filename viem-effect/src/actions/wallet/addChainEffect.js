import { addChain } from "viem/wallet";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof addChain, import("viem/wallet").AddChainErrorType>}
 */
export const addChainEffect = wrapInEffect(addChain);