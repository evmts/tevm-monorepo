import { taraxaTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof taraxaTestnet, Error>}
 */
export const taraxaTestnetEffect = wrapInEffect(taraxaTestnet);