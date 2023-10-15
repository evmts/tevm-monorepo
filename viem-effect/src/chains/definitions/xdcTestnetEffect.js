import { xdcTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof xdcTestnet, Error>}
 */
export const xdcTestnetEffect = wrapInEffect(xdcTestnet);