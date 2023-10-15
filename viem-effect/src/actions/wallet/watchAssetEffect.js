import { watchAsset } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof watchAsset, import("viem/actions").WatchAssetErrorType>}
 */
export const watchAssetEffect = wrapInEffect(watchAsset);