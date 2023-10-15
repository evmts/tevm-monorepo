import { ronin } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof ronin, Error>}
 */
export const roninEffect = wrapInEffect(ronin);