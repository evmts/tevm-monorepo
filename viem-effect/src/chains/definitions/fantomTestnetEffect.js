import { fantomTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fantomTestnet, Error>}
 */
export const fantomTestnetEffect = wrapInEffect(fantomTestnet);