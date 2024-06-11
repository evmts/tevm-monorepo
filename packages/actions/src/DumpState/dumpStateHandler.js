import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { InternalError } from '@tevm/errors'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('../DumpState/DumpStateHandlerType.js').DumpStateHandler}
 */
export const dumpStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail } = {}) => {
		try {
			const vm = await client.getVm()
			if ('dumpCanonicalGenesis' in vm.stateManager) {
				return { state: await vm.stateManager.dumpCanonicalGenesis() }
			}
			throw new InternalError(
				'Unsupported state manager. Must use a Tevm state manager from `@tevm/state` package. This may indicate a bug in tevm internal code.',
			)
		} catch (e) {
			return maybeThrowOnFail(throwOnFail ?? true, {
				state: {},
				errors: [e instanceof InternalError ? e : new InternalError('Unexpected error', { cause: e })],
			})
		}
	}
