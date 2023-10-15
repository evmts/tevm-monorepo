import { arbitrum } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof arbitrum, Error>}
 */
export const arbitrumEffect = wrapInEffect(arbitrum);