import { mantle } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mantle, Error>}
 */
export const mantleEffect = wrapInEffect(mantle);