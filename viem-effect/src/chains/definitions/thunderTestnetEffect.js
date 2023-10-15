import { thunderTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof thunderTestnet, Error>}
 */
export const thunderTestnetEffect = wrapInEffect(thunderTestnet);