import { scrollSepolia } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof scrollSepolia, Error>}
 */
export const scrollSepoliaEffect = wrapInEffect(scrollSepolia);