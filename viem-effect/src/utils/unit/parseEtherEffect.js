import { parseEther } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseEther, import("viem/utils").ParseEtherErrorType>}
 */
export const parseEtherEffect = wrapInEffect(parseEther);