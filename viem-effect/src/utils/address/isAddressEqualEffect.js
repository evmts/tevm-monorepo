import { isAddressEqual } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddressEqual, import("viem/utils").IsAddressEqualErrorType>}
 */
export const isAddressEqualEffect = wrapInEffect(isAddressEqual);