import { xdc } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof xdc, Error>}
 */
export const xdcEffect = wrapInEffect(xdc);