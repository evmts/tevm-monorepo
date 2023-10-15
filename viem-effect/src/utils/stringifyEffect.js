import { stringify } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof stringify, import("viem/utils").StringifyErrorType>}
 */
export const stringifyEffect = wrapInEffect(stringify);