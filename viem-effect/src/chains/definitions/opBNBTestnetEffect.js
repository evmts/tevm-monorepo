import { opBNBTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof opBNBTestnet, Error>}
 */
export const opBNBTestnetEffect = wrapInEffect(opBNBTestnet);