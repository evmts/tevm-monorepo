import { parseUnits } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseUnits, Error>}
 */
export const parseUnitsEffect = wrapInEffect(parseUnits);