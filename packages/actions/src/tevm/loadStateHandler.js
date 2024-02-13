import { createError } from './createError.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'
import { validateLoadStateParams } from '@tevm/zod'

/**
 * @param {import("@tevm/vm").TevmVm} vm
 * @returns {import('@tevm/actions-types').LoadStateHandler}
 */
export const loadStateHandler = (vm) => async (params) => {
	const errors = validateLoadStateParams(params)
	if (errors.length > 0) {
		return { errors }
	}
	try {
		if (
			vm.stateManager instanceof NormalStateManager ||
			vm.stateManager instanceof ProxyStateManager ||
			vm.stateManager instanceof ForkStateManager
		) {
			await vm.stateManager.generateCanonicalGenesis(params.state)
		} else {
			throw new Error(
				'Unsupported state manager. Must use a NormalStateManager, ProxyStateManager, or ForkStateManager. This indicates a bug in tevm internal code.',
			)
		}
		return {}
	} catch (e) {
		return {
			errors: [
				createError(
					'UnexpectedError',
					typeof e === 'string'
						? e
						: e instanceof Error
						? e.message
						: 'unknown error',
				),
			],
		}
	}
}
