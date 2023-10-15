import { taikoJolnir } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof taikoJolnir, Error>}
 */
export const taikoJolnirEffect = wrapInEffect(taikoJolnir);