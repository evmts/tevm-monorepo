import { getFilterChanges } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFilterChanges, import("viem/actions").GetFilterChangesErrorType>}
 */
export const getFilterChangesEffect = wrapInEffect(getFilterChanges);