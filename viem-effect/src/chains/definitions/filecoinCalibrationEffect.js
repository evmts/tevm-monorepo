import { filecoinCalibration } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof filecoinCalibration, Error>}
 */
export const filecoinCalibrationEffect = wrapInEffect(filecoinCalibration);