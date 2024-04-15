import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'
import { validateLoadStateParams } from '@tevm/zod'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').LoadStateHandler}
 */
export const loadStateHandler =
	(client, options = {}) =>
		async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
			client.logger.debug(params, 'Called with params')

			const errors = validateLoadStateParams(params)
			if (errors.length > 0) {
				return maybeThrowOnFail(throwOnFail, { errors })
			}
			try {
				const vm = await client.getVm()
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
				return maybeThrowOnFail(throwOnFail, {
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
