import { getChainId } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getChainId, import("viem/actions").GetChainIdErrorType>}
 */
export const getChainIdEffect = wrapInEffect(getChainId);