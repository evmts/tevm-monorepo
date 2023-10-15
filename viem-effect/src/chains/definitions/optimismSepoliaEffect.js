import { optimismSepolia } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof optimismSepolia, Error>}
 */
export const optimismSepoliaEffect = wrapInEffect(optimismSepolia);