import { bearNetworkChainTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof bearNetworkChainTestnet, Error>}
 */
export const bearNetworkChainTestnetEffect = wrapInEffect(bearNetworkChainTestnet);