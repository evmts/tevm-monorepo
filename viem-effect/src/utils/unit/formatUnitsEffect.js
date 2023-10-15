import { formatUnits } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof formatUnits, Error>}
 */
export const formatUnitsEffect = wrapInEffect(formatUnits);