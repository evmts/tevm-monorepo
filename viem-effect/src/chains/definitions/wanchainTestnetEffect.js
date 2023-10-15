import { wanchainTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof wanchainTestnet, Error>}
 */
export const wanchainTestnetEffect = wrapInEffect(wanchainTestnet);