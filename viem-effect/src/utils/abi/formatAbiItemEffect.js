import { formatAbiItem } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatAbiItem, Error>}
 */
export const formatAbiItemEffect = wrapInEffect(formatAbiItem);