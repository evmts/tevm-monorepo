import { createError } from './createError.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'

/**
 * @param {import("@ethereumjs/vm").VM} vm
 * @returns {import('@tevm/actions-types').DumpStateHandler}
 */
export const dumpStateHandler = (vm) => async () => {
	try {
		if (
			vm.stateManager instanceof NormalStateManager ||
			vm.stateManager instanceof ProxyStateManager ||
			vm.stateManager instanceof ForkStateManager
		) {
			return { state: await vm.stateManager.dumpCanonicalGenesis() }
		} else {
			throw new Error(
				'Unsupported state manager. Must use a NormalStateManager, ProxyStateManager, or ForkStateManager. This indicates a bug in tevm internal code.',
			)
		}
	} catch (e) {
		return {
			state: {},
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
