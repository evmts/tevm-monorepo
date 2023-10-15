import { getContractAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getContractAddress, never>}
 */
export const getContractAddressEffect = wrapInEffect(getContractAddress);