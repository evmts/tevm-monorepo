import { saigon } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof saigon, Error>}
 */
export const saigonEffect = wrapInEffect(saigon);