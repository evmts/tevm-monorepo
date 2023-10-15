import { toHex } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof toHex, Error>}
 */
export const toHexEffect = wrapInEffect(toHex);