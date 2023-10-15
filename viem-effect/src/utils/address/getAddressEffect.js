import { getAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAddress, import("viem/utils").GetAddressErrorType>}
 */
export const getAddressEffect = wrapInEffect(getAddress);