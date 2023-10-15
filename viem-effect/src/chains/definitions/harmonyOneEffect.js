import { harmonyOne } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof harmonyOne, Error>}
 */
export const harmonyOneEffect = wrapInEffect(harmonyOne);