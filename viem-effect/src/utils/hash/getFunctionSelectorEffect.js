import { getFunctionSelector } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFunctionSelector, Error>}
 */
export const getFunctionSelectorEffect = wrapInEffect(getFunctionSelector);