import { sepolia } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof sepolia, Error>}
 */
export const sepoliaEffect = wrapInEffect(sepolia);