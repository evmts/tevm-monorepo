import { fallback } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fallback, never>}
 */
export const fallbackEffect = wrapInEffect(fallback);