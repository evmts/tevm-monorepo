import { buildRequest } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof buildRequest, Error>}
 */
export const buildRequestEffect = wrapInEffect(buildRequest);