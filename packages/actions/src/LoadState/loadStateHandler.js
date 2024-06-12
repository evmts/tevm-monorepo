import { InternalError } from '@tevm/errors'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateLoadStateParams } from './validateLoadStateParams.js'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('./LoadStateHandlerType.js').LoadStateHandler}
 */
export const loadStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
		const errors = validateLoadStateParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, { errors })
		}
		try {
			const vm = await client.getVm()
			if ('generateCanonicalGenesis' in vm.stateManager) {
				await vm.stateManager.generateCanonicalGenesis(params.state)
			} else {
				throw new Error(
					'Unsupported state manager. Must use a Tevm state manager from `@tevm/state` package. This may indicate a bug in tevm internal code.',
				)
			}
			return {}
		} catch (e) {
			return maybeThrowOnFail(throwOnFail, {
				errors: [new InternalError('UnexpectedError', { cause: e })],
			})
		}
	}
