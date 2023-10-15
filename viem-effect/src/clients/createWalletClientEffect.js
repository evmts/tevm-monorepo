import { createWalletClient } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createWalletClient, import("viem").CreateWalletClientErrorType>}
 */
export const createWalletClientEffect = wrapInEffect(createWalletClient);