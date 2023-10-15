import { publicKeyToAddress } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof publicKeyToAddress, import("viem/accounts").PublicKeyToAddressErrorType>}
 */
export const publicKeyToAddressEffect = wrapInEffect(publicKeyToAddress);