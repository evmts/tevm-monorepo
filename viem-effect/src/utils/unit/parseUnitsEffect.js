import { parseUnits } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseUnits, import("viem/utils").ParseUnitsErrorType>}
 */
export const parseUnitsEffect = wrapInEffect(parseUnits);