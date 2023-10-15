import { parseEther } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof parseEther, Error>}
 */
export const parseEtherEffect = wrapInEffect(parseEther);