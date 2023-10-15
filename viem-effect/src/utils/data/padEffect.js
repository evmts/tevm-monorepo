import { pad } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof pad, Error>}
 */
export const padEffect = wrapInEffect(pad);