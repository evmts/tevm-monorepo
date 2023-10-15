import { signTypedData } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTypedData, import("viem/accounts").SignTypedDataErrorType>}
 */
export const signTypedDataEffect = wrapInEffect(signTypedData);