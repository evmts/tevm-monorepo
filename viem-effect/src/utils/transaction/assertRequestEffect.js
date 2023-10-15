import { assertRequest } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof assertRequest, Error>}
 */
export const assertRequestEffect = wrapInEffect(assertRequest);