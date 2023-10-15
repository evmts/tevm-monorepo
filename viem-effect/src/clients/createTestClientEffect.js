import { createTestClient } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof createTestClient, import("viem").CreateTestClientErrorType>}
 */
export const createTestClientEffect = wrapInEffect(createTestClient);