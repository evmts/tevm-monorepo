import { vechain } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof vechain, Error>}
 */
export const vechainEffect = wrapInEffect(vechain);