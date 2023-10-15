import { isAddressEqual } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof isAddressEqual, Error>}
 */
export const isAddressEqualEffect = wrapInEffect(isAddressEqual);