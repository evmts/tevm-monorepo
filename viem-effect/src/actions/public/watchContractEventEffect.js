import { watchContractEvent } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchContractEvent, import("viem/actions").WatchContractEventErrorType>}
 */
export const watchContractEventEffect = wrapInEffect(watchContractEvent);