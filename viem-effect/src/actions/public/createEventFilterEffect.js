import { createEventFilter } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof createEventFilter, import("viem/actions").CreateEventFilterErrorType>}
 */
export const createEventFilterEffect = wrapInEffect(createEventFilter);