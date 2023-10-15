import { songbirdTestnet } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof songbirdTestnet, Error>}
 */
export const songbirdTestnetEffect = wrapInEffect(songbirdTestnet);