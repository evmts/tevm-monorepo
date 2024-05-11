import { callHandler } from './callHandler.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { setAccountHandler } from './setAccountHandler.js'
import { EthjsAddress, bytesToHex, getAddress } from '@tevm/utils'
import {
  decodeErrorResult,
  decodeFunctionResult,
  encodeFunctionData,
  isHex,
} from '@tevm/utils'
import { validateScriptParams } from '@tevm/zod'

/**
 * Creates an ScriptHandler for handling script params with Ethereumjs EVM
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import("@tevm/actions-types").ScriptHandler}
 */
export const scriptHandler = (client, options = {}) => async (params) => {
  client.logger.debug({ functionName: params.functionName, abi: params.abi, args: params.args, deployedBytecode: params.deployedBytecode }, 'Processing script...')
  const vm = await client.getVm().then(vm => vm.deepCopy())
  const { throwOnFail = options.throwOnFail ?? true } = params
  /**
   * @type {import('@tevm/utils').Hex}
   */
  let functionData = '0x'
  // Internally we overload this function to take raw data too for the jsonrpc handler
  // We might make this public later
  if (/** @type any*/ (params).data) {
    functionData = /** @type any*/ (params).data
  } else {
    const errors = validateScriptParams(/** @type any*/(params))
    if (errors.length > 0) {
      return maybeThrowOnFail(throwOnFail, {
        errors,
        executionGasUsed: 0n,
        rawData: '0x',
      })
    }
  }

  try {
    functionData =
      functionData === '0x'
        ? encodeFunctionData(
						/** @type {any} */({
            abi: params.abi,
            functionName: params.functionName,
            args: params.args,
          }),
        )
        : functionData
  } catch (e) {
    /**
     * @type {import('@tevm/errors').InvalidRequestError}
     */
    const err = {
      name: 'InvalidRequestError',
      _tag: 'InvalidRequestError',
      message: /** @type {Error}*/ (e).message,
    }
    return maybeThrowOnFail(throwOnFail, {
      rawData: '0x',
      executionGasUsed: 0n,
      errors: [err],
    })
  }

  const randomBigInt = BigInt(Math.floor(Math.random() * 1_000_000_000_000_000))
  const scriptAddress = getAddress(
    EthjsAddress.generate(
      EthjsAddress.fromString(`0x${'6969'.repeat(10)}`),
      randomBigInt,
    ).toString()
  )

  client.logger.debug({ address: scriptAddress }, 'Deploying script to randomly generated address')

  const accountRes = await setAccountHandler(
    {
      ...client,
      getVm: async () => vm,
    },
    options,
  )({
    deployedBytecode: params.deployedBytecode,
    address: scriptAddress,
    throwOnFail: false,
  })

  if (accountRes.errors) {
    return maybeThrowOnFail(throwOnFail, {
      errors: accountRes.errors,
      data: '0x',
      executionGasUsed: 0n,
    })
  }

  const stateRoot = vm.stateManager._baseState.stateRoots.get(vm.stateManager._baseState.getCurrentStateRoot())
  if (!stateRoot) {
    throw new Error('state root doesnt exist')
  }

  if (!stateRoot[scriptAddress]) {
    throw new Error('The contract is not added to the state root')
  }

  if (!stateRoot[scriptAddress]?.deployedBytecode) {
    throw new Error('No deployed bytecode!')
  }

  // This should never happen just being defensive
  const doesContractStillExist = await vm.stateManager.getContractCode(EthjsAddress.fromString(scriptAddress))
  if (bytesToHex(doesContractStillExist) !== params.deployedBytecode) {
    client.logger.debug(bytesToHex(doesContractStillExist), params.deployedBytecode)
    throw new Error("NoContractCode: Script contract code was not successfully added to the vm. This indicates a bug in tevm. Consider opening an issue")
  }

  /**
   * @type {import('@tevm/actions-types').CallParams}
   */
  const callParams = {
    ...params,
    to: scriptAddress,
    skipBalance: params.skipBalance === undefined ? true : params.skipBalance,
    data: functionData,
    throwOnFail: false,
  }
  delete callParams.deployedBytecode

  if ((accountRes.errors ?? []).length > 0) {
    // this should only fail if deployedBytecode is not formatted correctly
    return maybeThrowOnFail(throwOnFail, accountRes)
  }

  const result = await callHandler(
    {
      ...client,
      getVm: async () => vm,
      mode: client.mode,
      getTxPool: client.getTxPool,
    },
    options,
  )(callParams)

  if (result.errors && result.errors.length > 0) {
    result.errors = result.errors.map((err) => {
      if (isHex(err.message) && err._tag === 'revert') {
        const decodedError = decodeErrorResult(
					/** @type {any} */({
            abi: params.abi,
            data: err.message,
            functionName: params.functionName,
          }),
        )
        return {
          ...err,
          message: `Revert: ${decodedError.errorName}: ${JSON.stringify(
            decodedError,
          )}`,
        }
      }
      return err
    })
    return maybeThrowOnFail(throwOnFail, result)
  }

  // Internally we use runScript without encoding/decoding
  if (/** @type any*/ (params).data) {
    return maybeThrowOnFail(throwOnFail, result)
  }

  let decodedResult
  try {
    decodedResult = decodeFunctionResult(
			/** @type {any} */({
        abi: params.abi,
        data: result.rawData,
        functionName: params.functionName,
      }),
    )
  } catch (e) {
    if (result.rawData === '0x' && params.abi) {
      client.logger.error('0x data returned from EVM with no error message. This may indicate a the contract was missing from the evm state if no other errors were thrown')
    }
    /**
     * @type {import('@tevm/errors').ContractError}
     */
    const err = {
      name: 'DecodeFunctionDataError',
      _tag: 'DecodeFunctionDataError',
      message: /** @type {Error}*/ (e).message,
    }
    return maybeThrowOnFail(throwOnFail, {
      ...result,
      errors: [err],
    })
  }

  return maybeThrowOnFail(throwOnFail, {
    .../** @type any */ (result),
    data: decodedResult,
  })
}
