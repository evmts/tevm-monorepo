import { formatAbiItemWithArgs } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItemWithArgs, Error>}
 */
export const formatAbiItemWithArgsEffect = wrapInEffect(formatAbiItemWithArgs);