import { flareTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof flareTestnet, Error>}
 */
export const flareTestnetEffect = wrapInEffect(flareTestnet);