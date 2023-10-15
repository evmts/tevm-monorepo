import { modeTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof modeTestnet, Error>}
 */
export const modeTestnetEffect = wrapInEffect(modeTestnet);