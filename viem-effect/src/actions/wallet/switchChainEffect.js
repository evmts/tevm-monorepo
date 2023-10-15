import { switchChain } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof switchChain, import("viem/actions").SwitchChainErrorType>}
 */
export const switchChainEffect = wrapInEffect(switchChain);