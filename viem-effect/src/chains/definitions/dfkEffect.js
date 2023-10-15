import { dfk } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof dfk, Error>}
 */
export const dfkEffect = wrapInEffect(dfk);