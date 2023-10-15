import { getAddresses } from "viem/wallet";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAddresses, import("viem/wallet").GetAddressesErrorType>}
 */
export const getAddressesEffect = wrapInEffect(getAddresses);