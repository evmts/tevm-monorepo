import { requestAddresses } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof requestAddresses, import("viem/actions").RequestAddressesErrorType>}
 */
export const requestAddressesEffect = wrapInEffect(requestAddresses);