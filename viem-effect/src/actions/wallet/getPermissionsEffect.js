import { getPermissions } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getPermissions, import("viem/actions").GetPermissionsErrorType>}
 */
export const getPermissionsEffect = wrapInEffect(getPermissions);