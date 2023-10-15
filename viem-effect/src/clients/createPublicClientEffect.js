import { createPublicClient } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createPublicClient, import("viem").CreatePublicClientErrorType>}
 */
export const createPublicClientEffect = wrapInEffect(createPublicClient);