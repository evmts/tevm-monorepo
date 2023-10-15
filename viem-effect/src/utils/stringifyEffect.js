import { stringify } from "viem/utils";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof stringify, Error>}
 */
export const stringifyEffect = wrapInEffect(stringify);