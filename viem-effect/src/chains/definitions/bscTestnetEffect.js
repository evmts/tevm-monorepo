import { bscTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bscTestnet, Error>}
 */
export const bscTestnetEffect = wrapInEffect(bscTestnet);