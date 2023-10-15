import { hashTypedData } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hashTypedData, Error>}
 */
export const hashTypedDataEffect = wrapInEffect(hashTypedData);