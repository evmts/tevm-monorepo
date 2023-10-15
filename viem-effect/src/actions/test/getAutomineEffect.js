import { getAutomine } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAutomine, import("viem/actions").GetAutomineErrorType>}
 */
export const getAutomineEffect = wrapInEffect(getAutomine);