import { kroma } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof kroma, Error>}
 */
export const kromaEffect = wrapInEffect(kroma);