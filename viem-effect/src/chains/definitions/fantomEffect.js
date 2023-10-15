import { fantom } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fantom, Error>}
 */
export const fantomEffect = wrapInEffect(fantom);