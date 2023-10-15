import { requestPermissions } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof requestPermissions, import("viem/actions").RequestPermissionsErrorType>}
 */
export const requestPermissionsEffect = wrapInEffect(requestPermissions);