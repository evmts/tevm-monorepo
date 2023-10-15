import { formatAbiItem } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItem, import("viem/contract").FormatAbiItemErrorType>}
 */
export const formatAbiItemEffect = wrapInEffect(formatAbiItem);