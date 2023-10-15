import { haqqMainnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof haqqMainnet, Error>}
 */
export const haqqMainnetEffect = wrapInEffect(haqqMainnet);