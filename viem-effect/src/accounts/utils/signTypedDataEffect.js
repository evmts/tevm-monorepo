import { signTypedData } from "viem/accounts";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof signTypedData, Error>}
 */
export const signTypedDataEffect = wrapInEffect(signTypedData);