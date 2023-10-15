import { setAutomine } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setAutomine, import("viem/actions").SetAutomineErrorType>}
 */
export const setAutomineEffect = wrapInEffect(setAutomine);