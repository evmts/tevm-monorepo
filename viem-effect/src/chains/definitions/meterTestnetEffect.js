import { meterTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof meterTestnet, Error>}
 */
export const meterTestnetEffect = wrapInEffect(meterTestnet);