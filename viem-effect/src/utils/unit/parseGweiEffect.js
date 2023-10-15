import { parseGwei } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseGwei, import("viem/utils").ParseGweiErrorType>}
 */
export const parseGweiEffect = wrapInEffect(parseGwei);