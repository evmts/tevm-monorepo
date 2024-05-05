import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { validateCallParams } from '@tevm/zod'
import { createTransaction } from './createTransaction.js'

/**
 * The callHandler is the most important function in Tevm.
 * It is the direct implementation of `tevm_call`.
 * It is also wrapped by all call-like actions including
 * - `tevm_contract`
 * - `tevm_script`
 * - `eth_call`
 * - `debug_traceCall`
 * - etc.
 *
 * If it needs to create a transaction on the chain it sends it's results to [createTransactionHandler](./createTrasactionHandler.js)
 *
 * It has 5 steps
 * 0. Validate params
 * 1. Clone vm
 * 2. Run vm
 * 3. Create tx (if necessary)
 * 4. Return result
 */

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('@tevm/actions-types').CallHandler}
 */
export const callHandler =
  (client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
    async (params) => {
      /**
       * ***************
       * 0 VALIDATE PARAMS
       * ***************
       */
      client.logger.debug(params, 'callHandler: Executing call with params')
      const validationErrors = validateCallParams(params)
      if (validationErrors.length > 0) {
        client.logger.debug(validationErrors, 'Params do not pass validation')
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          errors: validationErrors,
          executionGasUsed: 0n,
          /**
           * @type {`0x${string}`}
           */
          rawData: '0x',
        })
      }
      const { errors, data: evmInput } = await callHandlerOpts(client, params)
      if (errors ?? !evmInput) {
        client.logger.error(
          errors ?? evmInput,
          'callHandler: Unexpected error converting params to ethereumjs params',
        )
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          errors: /** @type {import('@tevm/errors').CallError[]}*/ (errors),
          executionGasUsed: 0n,
          rawData: /** @type {`0x${string}`}*/('0x'),
        })
      }

      /**
       * ************
       * 1 CLONE THE VM WITH BLOCK TAG
       * ************
       */
      client.logger.debug(
        'Cloning vm to execute a call...',
      )
      /**
       * @type {import('@tevm/vm').Vm}
       */
      let vm
      try {
        vm = await client.getVm().then(vm => vm.deepCopy())
        // TODO why is this broken?
        /**
         * @type {Uint8Array}
         */
        const stateRoot = /** @type any*/(evmInput?.block?.header).stateRoot
        if (stateRoot) {
          vm.stateManager.setStateRoot(stateRoot)
        }
      } catch (e) {
        client.logger.error(e, 'callHandler: Unexpected error failed to clone vm')
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          errors: [
            {
              name: 'UnexpectedError',
              _tag: 'UnexpectedError',
              message:
                typeof e === 'string'
                  ? e
                  : e instanceof Error
                    ? e.message
                    : 'unknown error',
            },
          ],
          executionGasUsed: 0n,
          rawData: '0x',
        })
      }

      /**
       * ************
       * 2 RUN THE EVM
       * ************
       */
      /**
       * @type {import('@tevm/evm').EvmResult | undefined}
       */
      let evmOutput = undefined
      /**
       * @type {import('@tevm/actions-types').DebugTraceCallResult | undefined}
       */
      let trace = undefined
      try {

        client.logger.debug(evmInput, 'callHandler: Executing runCall with params')
        if (params.createTrace) {
          const { trace: _trace, ...res } = await runCallWithTrace(
            vm,
            client.logger,
            evmInput,
          )
          evmOutput = res
          trace = _trace
        } else {
          evmOutput = await vm.evm.runCall(evmInput)
        }
      } catch (e) {
        client.logger.error(e, 'callHandler: Unexpected error executing evm')
        return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
          errors: [
            {
              name: 'UnexpectedError',
              _tag: 'UnexpectedError',
              message:
                typeof e === 'string'
                  ? e
                  : e instanceof Error
                    ? e.message
                    : 'unknown error',
            },
          ],
          executionGasUsed: 0n,
          /**
           * @type {`0x${string}`}
           */
          rawData: '0x',
        })
      }

      /**
       * ****************************
       * 3 CREATE TRANSACTION WITH CALL (if neessary)
       * ****************************
       */
      const shouldCreateTransaction = (() => {
        if (params.createTransaction === undefined) {
          client.logger.debug(
            'callHandler: Defaulting to false for creating a transaction',
          )
          return false
        }
        if (
          params.createTransaction === true ||
          params.createTransaction === 'always'
        ) {
          client.logger.debug(
            "callHandler: Creating transaction because config set to 'always'",
          )
          return true
        }
        if (
          params.createTransaction === false ||
          params.createTransaction === 'never'
        ) {
          client.logger.debug(
            "callHandler: Creating transaction because config set to 'never'",
          )
          return false
        }
        if (params.createTransaction === 'on-success') {
          client.logger.debug(
            "callHandler: Creating transaction because config set to 'on-success'",
          )
          return evmOutput.execResult.exceptionError === undefined
        }
        /**
         * @type {never} this typechecks that we've exhausted all cases
         */
        const invalidOption = params.createTransaction
        throw new Error(`Invalid createTransaction value: ${invalidOption}`)
      })()
      if (shouldCreateTransaction) {
        const txRes = await createTransaction(client)({ throwOnFail: false, evmOutput, evmInput })
        if ('errors' in txRes && txRes.errors.length) {
          return /** @type {any}*/ (
            maybeThrowOnFail(
              params.throwOnFail ?? defaultThrowOnFail,
              {
                ...('errors' in txRes ? { errors: txRes.errors } : {}),
                ...callHandlerResult(evmOutput, undefined, trace),
              }
            )
          )
        }
      }

      /**
       * ******************
       * 4 RETURN CALL RESULT
       * ******************
       */
      return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
        ...callHandlerResult(evmOutput, undefined, trace),
        executionGasUsed: 0n,
        /**
         * @type {`0x${string}`}
         */
        rawData: '0x',
      })
  }
