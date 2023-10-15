import { formatUnits } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatUnits, import("viem/utils").FormatUnitsErrorType>}
 */
export const formatUnitsEffect = wrapInEffect(formatUnits);