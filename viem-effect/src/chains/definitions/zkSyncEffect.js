import { zkSync } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof zkSync, Error>}
 */
export const zkSyncEffect = wrapInEffect(zkSync);