import { coreDao } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof coreDao, Error>}
 */
export const coreDaoEffect = wrapInEffect(coreDao);