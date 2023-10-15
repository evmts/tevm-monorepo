import { dogechain } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof dogechain, Error>}
 */
export const dogechainEffect = wrapInEffect(dogechain);