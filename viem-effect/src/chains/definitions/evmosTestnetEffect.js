import { evmosTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof evmosTestnet, Error>}
 */
export const evmosTestnetEffect = wrapInEffect(evmosTestnet);