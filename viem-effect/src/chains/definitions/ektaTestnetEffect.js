import { ektaTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof ektaTestnet, Error>}
 */
export const ektaTestnetEffect = wrapInEffect(ektaTestnet);