import { getContractAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getContractAddress, Error>}
 */
export const getContractAddressEffect = wrapInEffect(getContractAddress);