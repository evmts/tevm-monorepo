import { getEventSelector } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEventSelector, import("viem/utils").GetEventSelectorErrorType>}
 */
export const getEventSelectorEffect = wrapInEffect(getEventSelector);