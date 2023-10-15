import { serializeAccessList } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof serializeAccessList, import("viem/utils").SerializeAccessListErrorType>}
 */
export const serializeAccessListEffect = wrapInEffect(serializeAccessList);