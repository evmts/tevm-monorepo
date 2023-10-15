import { scrollTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof scrollTestnet, Error>}
 */
export const scrollTestnetEffect = wrapInEffect(scrollTestnet);