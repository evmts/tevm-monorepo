import { multicall } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof multicall, import("viem/actions").MulticallErrorType>}
 */
export const multicallEffect = wrapInEffect(multicall);