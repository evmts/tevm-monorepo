import { classic } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof classic, Error>}
 */
export const classicEffect = wrapInEffect(classic);