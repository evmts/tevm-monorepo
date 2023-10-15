import { isAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddress, Error>}
 */
export const isAddressEffect = wrapInEffect(isAddress);