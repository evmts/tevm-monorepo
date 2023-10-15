import { serializeAccessList } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeAccessList, Error>}
 */
export const serializeAccessListEffect = wrapInEffect(serializeAccessList);