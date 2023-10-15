import { isAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddress, import("viem/utils").IsAddressErrorType>}
 */
export const isAddressEffect = wrapInEffect(isAddress);