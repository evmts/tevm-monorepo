import { getCallError } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getCallError, Error>}
 */
export const getCallErrorEffect = wrapInEffect(getCallError);