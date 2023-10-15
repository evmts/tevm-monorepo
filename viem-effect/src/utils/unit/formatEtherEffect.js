import { formatEther } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatEther, Error>}
 */
export const formatEtherEffect = wrapInEffect(formatEther);