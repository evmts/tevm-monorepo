import { kromaSepolia } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof kromaSepolia, Error>}
 */
export const kromaSepoliaEffect = wrapInEffect(kromaSepolia);