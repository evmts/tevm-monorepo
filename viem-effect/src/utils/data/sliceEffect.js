import { slice } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof slice, import("viem/utils").SliceErrorType>}
 */
export const sliceEffect = wrapInEffect(slice);