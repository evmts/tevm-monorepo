import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'
import { validateLoadStateParams } from '@tevm/zod'

/**
 * @param {Pick<import("@tevm/base-client").BaseClient, 'vm'>} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').LoadStateHandler}
 */
export const loadStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
		const errors = validateLoadStateParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, { errors })
		}
		try {
			if (
				client.vm.stateManager instanceof NormalStateManager ||
				client.vm.stateManager instanceof ProxyStateManager ||
				client.vm.stateManager instanceof ForkStateManager
			) {
				await client.vm.stateManager.generateCanonicalGenesis(params.state)
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
