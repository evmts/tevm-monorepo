import { getEnsName } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEnsName, import("viem/actions").GetEnsNameErrorType>}
 */
export const getEnsNameEffect = wrapInEffect(getEnsName);