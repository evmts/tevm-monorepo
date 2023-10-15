import { size } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof size, import("viem/utils").SizeErrorType>}
 */
export const sizeEffect = wrapInEffect(size);