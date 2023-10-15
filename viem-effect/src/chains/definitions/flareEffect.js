import { flare } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof flare, Error>}
 */
export const flareEffect = wrapInEffect(flare);