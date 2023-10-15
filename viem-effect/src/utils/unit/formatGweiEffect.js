import { formatGwei } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatGwei, import("viem/utils").FormatGweiErrorType>}
 */
export const formatGweiEffect = wrapInEffect(formatGwei);