import { createBlockFilter } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createBlockFilter, import("viem/actions").CreateBlockFilterErrorType>}
 */
export const createBlockFilterEffect = wrapInEffect(createBlockFilter);