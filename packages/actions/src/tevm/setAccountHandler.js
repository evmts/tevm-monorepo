import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { hexToBytes, keccak256 } from '@tevm/utils'
import { validateSetAccountParams } from '@tevm/zod'

/**
 * Creates an SetAccountHandler for handling account params with Ethereumjs EVM
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').SetAccountHandler}
 */
export const setAccountHandler = (client, options = {}) => async (params) => {
  const { throwOnFail = options.throwOnFail ?? true } = params
  /**
   * @type {Array<import('@tevm/errors').SetAccountError>}
   */
  const errors = validateSetAccountParams(params)
  if (errors.length > 0) {
    return maybeThrowOnFail(throwOnFail, { errors })
  }

  const address = new EthjsAddress(hexToBytes(params.address))

  /**
   * @type {Array<Promise<any>>}
   */
  const promises = []
  try {
    const vm = await client.getVm()
    promises.push(
      vm.stateManager.putAccount(
        address,
        new EthjsAccount(
          params.nonce,
          params.balance,
          params.storageRoot && hexToBytes(params.storageRoot),
          params.deployedBytecode &&
          hexToBytes(keccak256(params.deployedBytecode)),
        ),
      ),
    )
    if (params.deployedBytecode) {
      promises.push(
        vm.stateManager.putContractCode(
          address,
          hexToBytes(params.deployedBytecode),
        ),
      )
    }
    // state clears state first stateDiff does not
    if (params.state) {
      await vm.stateManager.clearContractStorage(address)
    }
    const state = params.state ?? params.stateDiff
    if (state) {
      for (const [key, value] of Object.entries(state)) {
        promises.push(
          vm.stateManager.putContractStorage(
            address,
            hexToBytes(/** @type {import('@tevm/utils').Hex}*/(key)),
            hexToBytes(value),
          ),
        )
      }
    }
    const results = await Promise.allSettled(promises)
    for (const result of results) {
      if (result.status === 'rejected') {
        errors.push(result.reason)
      }
    }

    if (errors.length > 0) {
      return maybeThrowOnFail(throwOnFail, { errors })
    }

    await vm.stateManager.checkpoint()
    await vm.stateManager.commit()
    // TODO offer way of setting contract storage with evm.stateManager.putContractStorage
    return {}
  } catch (e) {
    errors.push(
      createError(
        'UnexpectedError',
        typeof e === 'string'
          ? e
          : e instanceof Error
            ? e.message
            : 'unknown error',
      ),
    )
    return maybeThrowOnFail(throwOnFail, { errors })
  }
}
