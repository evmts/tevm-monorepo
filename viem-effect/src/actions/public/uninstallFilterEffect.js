import { uninstallFilter } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof uninstallFilter, import("viem/actions").UninstallFilterErrorType>}
 */
export const uninstallFilterEffect = wrapInEffect(uninstallFilter);