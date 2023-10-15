import { getNodeError } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getNodeError, Error>}
 */
export const getNodeErrorEffect = wrapInEffect(getNodeError);