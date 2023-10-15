import { getAbiItem } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAbiItem, Error>}
 */
export const getAbiItemEffect = wrapInEffect(getAbiItem);