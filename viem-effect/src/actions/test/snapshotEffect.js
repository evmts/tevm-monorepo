import { snapshot } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof snapshot, import("viem/actions").SnapshotErrorType>}
 */
export const snapshotEffect = wrapInEffect(snapshot);