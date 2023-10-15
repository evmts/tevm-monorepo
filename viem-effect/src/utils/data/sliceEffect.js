import { slice } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof slice, Error>}
 */
export const sliceEffect = wrapInEffect(slice);