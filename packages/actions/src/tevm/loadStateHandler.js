import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
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
      const errors = validateLoadStateParams(params)
      if (errors.length > 0) {
        return maybeThrowOnFail(throwOnFail, { errors })
      }
      try {
        const vm = await client.getVm()
        if (
          'generateCanonicalGenesis' in vm.stateManager
        ) {
          await vm.stateManager.generateCanonicalGenesis(params.state)
        } else {
          throw new Error(
            'Unsupported state manager. Must use a Tevm state manager from `@tevm/state` package. This may indicate a bug in tevm internal code.',
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
