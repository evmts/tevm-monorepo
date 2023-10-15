import { extractFunctionParts } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof extractFunctionParts, import("viem/utils").ExtractFunctionPartsErrorType>}
 */
export const extractFunctionPartsEffect = wrapInEffect(extractFunctionParts);