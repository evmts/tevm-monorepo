import { gobi } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof gobi, Error>}
 */
export const gobiEffect = wrapInEffect(gobi);