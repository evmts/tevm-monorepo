import { mantleTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mantleTestnet, Error>}
 */
export const mantleTestnetEffect = wrapInEffect(mantleTestnet);