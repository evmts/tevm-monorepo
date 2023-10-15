import { getAbiItem } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAbiItem, import("viem/abi").GetAbiItemErrorType>}
 */
export const getAbiItemEffect = wrapInEffect(getAbiItem);