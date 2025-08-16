/**
 * @internal
 * @typedef {InvalidParamsError} HandleStateOverridesError
 */
/**
 * Handles state overrides for the given client and parameters.
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('./CallParams.js').CallParams['stateOverrideSet']} stateOverrideSet
 * @returns {Promise<{errors?: Array<HandleStateOverridesError>}>}
 */
export function handleStateOverrides(client: import("@tevm/node").TevmNode, stateOverrideSet: import("./CallParams.js").CallParams["stateOverrideSet"]): Promise<{
    errors?: Array<HandleStateOverridesError>;
}>;
export type HandleStateOverridesError = InvalidParamsError;
import { InvalidParamsError } from '@tevm/errors';
//# sourceMappingURL=handleStateOverrides.d.ts.map