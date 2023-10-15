import { getBytecode } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getBytecode, import("viem/actions").GetBytecodeErrorType>}
 */
export const getBytecodeEffect = wrapInEffect(getBytecode);