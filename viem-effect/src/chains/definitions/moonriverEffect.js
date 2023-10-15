import { moonriver } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof moonriver, Error>}
 */
export const moonriverEffect = wrapInEffect(moonriver);