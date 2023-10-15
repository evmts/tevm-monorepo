import { formatAbiItemWithArgs } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItemWithArgs, import("viem/contract").FormatAbiItemWithArgsErrorType>}
 */
export const formatAbiItemWithArgsEffect = wrapInEffect(formatAbiItemWithArgs);