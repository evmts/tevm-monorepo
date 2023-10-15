import { createContractEventFilter } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createContractEventFilter, import("viem/actions").CreateContractEventFilterErrorType>}
 */
export const createContractEventFilterEffect = wrapInEffect(createContractEventFilter);