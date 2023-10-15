import { mevTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof mevTestnet, Error>}
 */
export const mevTestnetEffect = wrapInEffect(mevTestnet);