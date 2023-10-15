import { telosTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof telosTestnet, Error>}
 */
export const telosTestnetEffect = wrapInEffect(telosTestnet);