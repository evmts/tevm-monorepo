import { getContractError } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getContractError, Error>}
 */
export const getContractErrorEffect = wrapInEffect(getContractError);