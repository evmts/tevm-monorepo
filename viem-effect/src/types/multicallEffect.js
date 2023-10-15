import { multicall } from "viem/actions";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof multicall, Error>}
 */
export const multicallEffect = wrapInEffect(multicall);