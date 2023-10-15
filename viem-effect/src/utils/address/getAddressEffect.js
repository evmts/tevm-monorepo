import { getAddress } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * // I manually updated this
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getAddress, Error>}
 */
export const getAddressEffect = wrapInEffect(getAddress);
