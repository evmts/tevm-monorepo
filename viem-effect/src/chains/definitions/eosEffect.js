import { eos } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof eos, Error>}
 */
export const eosEffect = wrapInEffect(eos);