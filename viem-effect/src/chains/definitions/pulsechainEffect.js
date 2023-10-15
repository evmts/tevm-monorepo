import { pulsechain } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof pulsechain, Error>}
 */
export const pulsechainEffect = wrapInEffect(pulsechain);