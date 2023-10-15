import { zoraTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zoraTestnet, Error>}
 */
export const zoraTestnetEffect = wrapInEffect(zoraTestnet);