import { getEnsText } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEnsText, import("viem/actions").GetEnsTextErrorType>}
 */
export const getEnsTextEffect = wrapInEffect(getEnsText);