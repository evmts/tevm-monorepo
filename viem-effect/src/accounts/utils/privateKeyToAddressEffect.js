import { privateKeyToAddress } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof privateKeyToAddress, import("viem/accounts").PrivateKeyToAddressErrorType>}
 */
export const privateKeyToAddressEffect = wrapInEffect(privateKeyToAddress);