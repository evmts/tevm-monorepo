import { buildRequest } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof buildRequest, never>}
 */
export const buildRequestEffect = wrapInEffect(buildRequest);