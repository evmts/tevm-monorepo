import { InvalidParamsError } from '@tevm/errors'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

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
export async function handleStateOverrides(client, stateOverrideSet) {
	if (stateOverrideSet) {
		for (const [address, state] of Object.entries(stateOverrideSet)) {
			console.log('setting state', address, state)
			const res = await setAccountHandler(client)({
				address: /** @type import('@tevm/utils').Address*/ (address),
				...(state.nonce !== undefined ? { nonce: state.nonce } : {}),
				...(state.balance !== undefined ? { balance: state.balance } : {}),
				...(state.code !== undefined ? { deployedBytecode: state.code } : {}),
				...(state.state !== undefined ? { state: state.state } : {}),
				...(state.stateDiff !== undefined ? { stateDiff: state.stateDiff } : {}),
				throwOnFail: false,
			})
			if (res.errors?.length) {
				return {
					errors: [
						new InvalidParamsError('Invalid state override', {
							cause: /** @type {Error} */ (res.errors.length === 1 ? res.errors[0] : new AggregateError(res.errors)),
						}),
					],
				}
			}
		}
	}
	return {}
}
