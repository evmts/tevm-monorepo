import { extract } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof extract, import("viem/utils").ExtractErrorType>}
 */
export const extractEffect = wrapInEffect(extract);