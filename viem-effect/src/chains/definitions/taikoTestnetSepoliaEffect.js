import { taikoTestnetSepolia } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof taikoTestnetSepolia, Error>}
 */
export const taikoTestnetSepoliaEffect = wrapInEffect(taikoTestnetSepolia);