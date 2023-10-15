import { size } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof size, Error>}
 */
export const sizeEffect = wrapInEffect(size);