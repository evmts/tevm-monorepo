import { createError } from './createError.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { EthjsAccount, EthjsAddress, getAddress } from '@tevm/utils'
import { hexToBytes, keccak256 } from '@tevm/utils'
import { validateSetAccountParams } from '@tevm/zod'
import { getAccountHandler } from './getAccountHandler.js'

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
    const account = await getAccountHandler(client)({ ...params, throwOnFail: false })
    if (account.errors?.length && account.errors[0]?._tag !== 'AccountNotFoundError') {
      client.logger.error('there was an unexpected error getting account', account.errors)
      throw account.errors.length > 1 ? new AggregateError(account.errors) : account.errors[1]
    }
    promises.push(
      vm.stateManager.putAccount(
        address,
        new EthjsAccount(
          params.nonce ?? account?.nonce,
          params.balance ?? account?.nonce,
          (params.storageRoot && hexToBytes(params.storageRoot)) ?? (account?.storageRoot !== undefined && account?.storageRoot !== '0x' ? hexToBytes(account.storageRoot) : undefined),
          (params.deployedBytecode &&
            hexToBytes(keccak256(params.deployedBytecode))) ?? (account?.deployedBytecode !== undefined ? hexToBytes(keccak256(account.deployedBytecode)) : undefined),
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

    if (params.deployedBytecode) {
      const account = await getAccountHandler(client)({ ...params, throwOnFail: true })
      if (account.deployedBytecode !== params.deployedBytecode) {
        client.logger.debug(account, 'no bytecode in account')
        throw new Error('InternalError: Deployed bytecoded never added')
      }
    }

    await vm.stateManager.checkpoint()
    await vm.stateManager.commit(false)

    if (params.deployedBytecode) {
      const account = await getAccountHandler(client)({ ...params, throwOnFail: true })
      if (account.deployedBytecode !== params.deployedBytecode) {
        client.logger.debug(account, 'no bytecode in account')
        throw new Error('InternalError: getAccountHandler Deployed bytecoded never added after checkpointing')
      }
      const state = vm.stateManager._baseState.stateRoots.get(vm.stateManager._baseState.getCurrentStateRoot())
      if (state?.[getAddress(params.address)]?.deployedBytecode === undefined) {
        throw new Error('InternalERror: statemanager cache Contract bytecode never added in setAccountHandler after checkpointing')
      } 
    }
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
