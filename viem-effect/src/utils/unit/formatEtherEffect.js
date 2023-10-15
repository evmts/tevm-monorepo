import { formatEther } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatEther, import("viem/utils").FormatEtherErrorType>}
 */
export const formatEtherEffect = wrapInEffect(formatEther);