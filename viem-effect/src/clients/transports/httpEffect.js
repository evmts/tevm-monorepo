import { http } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof http, Error>}
 */
export const httpEffect = wrapInEffect(http);