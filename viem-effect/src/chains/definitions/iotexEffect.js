import { iotex } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof iotex, Error>}
 */
export const iotexEffect = wrapInEffect(iotex);