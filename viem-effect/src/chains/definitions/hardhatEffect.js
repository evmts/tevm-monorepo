import { hardhat } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hardhat, Error>}
 */
export const hardhatEffect = wrapInEffect(hardhat);