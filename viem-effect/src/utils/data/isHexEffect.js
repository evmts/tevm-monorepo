import { isHex } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isHex, Error>}
 */
export const isHexEffect = wrapInEffect(isHex);