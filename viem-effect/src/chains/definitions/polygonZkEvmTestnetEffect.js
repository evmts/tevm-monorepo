import { polygonZkEvmTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof polygonZkEvmTestnet, Error>}
 */
export const polygonZkEvmTestnetEffect = wrapInEffect(polygonZkEvmTestnet);