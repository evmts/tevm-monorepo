import { bearNetworkChainMainnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bearNetworkChainMainnet, Error>}
 */
export const bearNetworkChainMainnetEffect = wrapInEffect(bearNetworkChainMainnet);