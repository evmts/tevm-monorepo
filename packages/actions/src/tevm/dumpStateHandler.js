import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'

/**
 * @param {Pick<import("@tevm/base-client").BaseClient, 'getVm'>} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').DumpStateHandler}
 */
export const dumpStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail } = {}) => {
		try {
			const vm = await client.getVm()
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
			return maybeThrowOnFail(throwOnFail ?? true, {
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
			})
		}
	}
