import { zkSyncTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zkSyncTestnet, Error>}
 */
export const zkSyncTestnetEffect = wrapInEffect(zkSyncTestnet);