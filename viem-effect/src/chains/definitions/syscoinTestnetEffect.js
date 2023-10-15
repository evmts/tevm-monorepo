import { syscoinTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof syscoinTestnet, Error>}
 */
export const syscoinTestnetEffect = wrapInEffect(syscoinTestnet);