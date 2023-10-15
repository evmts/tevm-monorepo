import { songbird } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof songbird, Error>}
 */
export const songbirdEffect = wrapInEffect(songbird);