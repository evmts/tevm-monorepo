import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { validateMineParams } from '@tevm/zod'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').MineHandler}
 */
export const mineHandler =
  (client, options = {}) =>
    async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
      const errors = validateMineParams(params)
      if (errors.length > 0) {
        return maybeThrowOnFail(throwOnFail, { errors })
      }
      const { interval = 1, blockCount = 1 } = params
      const pool = await client.getTxPool()
      const chain = await client.getChain()
      console.log('TODO', { pool, chain, createError, interval, blockCount })
      // TODO execute all the pool tx and create a new block
      return {}
	}
