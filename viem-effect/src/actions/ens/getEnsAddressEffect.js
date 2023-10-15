import { getEnsAddress } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEnsAddress, import("viem/actions").GetEnsAddressErrorType>}
 */
export const getEnsAddressEffect = wrapInEffect(getEnsAddress);