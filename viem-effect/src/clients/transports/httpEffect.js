import { http } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof http, never>}
 */
export const httpEffect = wrapInEffect(http);