import { createClient } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createClient, import("viem").CreateClientErrorType>}
 */
export const createClientEffect = wrapInEffect(createClient);