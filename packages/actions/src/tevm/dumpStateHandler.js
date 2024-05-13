import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').DumpStateHandler}
 */
export const dumpStateHandler =
  (client, options = {}) =>
    async ({ throwOnFail = options.throwOnFail } = {}) => {
      try {
        const vm = await client.getVm()
        await vm.stateManager.ready()
        if (
          'dumpCanonicalGenesis' in vm.stateManager
        ) {
          return { state: await vm.stateManager.dumpCanonicalGenesis() }
        } else {
          throw new Error(
            'Unsupported state manager. Must use a Tevm state manager from `@tevm/state` package. This may indicate a bug in tevm internal code.',
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
