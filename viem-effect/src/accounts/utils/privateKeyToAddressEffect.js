import { privateKeyToAddress } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof privateKeyToAddress, Error>}
 */
export const privateKeyToAddressEffect = wrapInEffect(privateKeyToAddress);