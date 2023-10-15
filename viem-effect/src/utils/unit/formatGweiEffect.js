import { formatGwei } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatGwei, Error>}
 */
export const formatGweiEffect = wrapInEffect(formatGwei);