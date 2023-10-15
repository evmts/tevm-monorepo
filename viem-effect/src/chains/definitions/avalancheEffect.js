import { avalanche } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof avalanche, Error>}
 */
export const avalancheEffect = wrapInEffect(avalanche);