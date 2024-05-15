import { FeeMarketEIP1559Transaction } from '@tevm/tx'
import { EthjsAddress, bytesToHex, keccak256 } from '@tevm/utils'
import { setAccountHandler } from './setAccountHandler.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { getAccountHandler } from './getAccountHandler.js'

// TODO tevm_call should optionally take a signature too
const requireSig = false

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {boolean} [defaultThrowOnFail]
 */
export const createTransaction = (client, defaultThrowOnFail = true) => {
  /**
   * @param {object} params
   * @param {import('@tevm/evm').EvmRunCallOpts} params.evmInput
   * @param {import('@tevm/evm').EvmResult} params.evmOutput
   * @param {boolean} [params.throwOnFail]
   */
  return async ({ evmInput, evmOutput, throwOnFail }) => {
    const vm = await client.getVm()
    const pool = await client.getTxPool()

    const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
    const priorityFee = 0n

    const dataFee = (() => {
      let out = 0n
      for (const entry of evmInput.data ?? []) {
        out += vm.common.param('gasPrices', entry === 0 ? 'txDataZero' : 'txDataNonZero')
      }
      return out
    })()

    const baseFee = (() => {
      let out = dataFee
      const txFee = vm.common.param('gasPrices', 'tx')
      if (txFee) {
        out += txFee
      }
      const isCreation = (evmInput.to?.bytes.length ?? 0) === 0
      if (vm.common.gteHardfork('homestead') && isCreation) {
        const txCreationFee = vm.common.param('gasPrices', 'txCreation')
        if (txCreationFee) {
          out += txCreationFee
        }
      }
      return out
    })()

    const minimumGasLimit = baseFee + evmOutput.execResult.executionGasUsed
    const gasLimitWithExecutionBuffer = evmInput.gasLimit ?? (minimumGasLimit * 11n / 10n)

    if (gasLimitWithExecutionBuffer < minimumGasLimit) {
      console.warn(`The manually set gas limit set by tx is lower than the estimated cost. It may fail once mined.`)
    }

    const sender = evmInput.origin ?? evmInput.caller ?? EthjsAddress.fromString(`0x${'00'.repeat(20)}`)

    const txPool = await client.getTxPool()
    const txs = await txPool.getBySenderAddress(sender)

    const nonce = (
      (await vm.stateManager.getAccount(
        sender,
      )) ?? { nonce: 0n }
    ).nonce + BigInt(txs.length)

    client.logger.debug({ nonce, sender: sender.toString() }, 'creating tx with nonce')

    // TODO known bug here we should be allowing unlimited code size here based on user providing option
    // Just lazily not looking up how to get it from client.getVm().evm yet
    // Possible we need to make property public on client
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        nonce,
        gasLimit: gasLimitWithExecutionBuffer,
        maxFeePerGas: parentBlock.header.calcNextBaseFee() + priorityFee,
        maxPriorityFeePerGas: 0n,
        ...(evmInput.to !== undefined ? { to: evmInput.to } : {}),
        ...(evmInput.data !== undefined ? { data: evmInput.data } : {}),
        ...(evmInput.value !== undefined ? { value: evmInput.value } : {}),
        gasPrice: null,
      },
      {
        allowUnlimitedInitCodeSize: false,
        common: vm.common,
        // we don't want to freeze because there is a hack to set tx.hash when building a block
        freeze: false,
      },
    )
    client.logger.debug(
      tx,
      'callHandler: Created a new transaction from transaction data',
    )
    // So we can `impersonate` accounts we need to hack the `hash()` method to always exist whether signed or unsigned
    // TODO we should be configuring tevm_call to sometimes only accept signed transactions
    // TODO let's just make an ImpersonatedTx type in `@tevm/tx`
    const wrappedTx = new Proxy(tx, {
      get(target, prop) {
        if (prop === 'hash') {
          return () => {
            try {
              return target.hash()
            } catch (e) {
              return keccak256(target.getHashedMessageToSign(), 'bytes')
            }
          }
        }
        if (prop === 'isSigned') {
          return () => true
        }
        if (prop === 'getSenderAddress') {
          return () => sender
        }
        return Reflect.get(target, prop)
      },
    })
    try {
      client.logger.debug(
        { requireSig, skipBalance: evmInput.skipBalance },
        'callHandler: Adding tx to mempool',
      )
      const poolPromise = pool.add(wrappedTx, requireSig, evmInput.skipBalance ?? false)
      const txHash = bytesToHex(wrappedTx.hash())
      client.logger.debug(
        txHash,
        'callHandler: received txHash',
      )
      const account = await getAccountHandler(client)({
        address: /** @type {import('@tevm/utils').Hex}*/(sender.toString())
      })
      const balanceNeeded = wrappedTx.value + (gasLimitWithExecutionBuffer * wrappedTx.maxFeePerGas)
      const hasBalance = balanceNeeded <= account.balance
      if (evmInput?.skipBalance && !hasBalance) {
        await setAccountHandler(client)({
          address: /** @type {import('@tevm/utils').Hex}*/(sender.toString()),
          balance: balanceNeeded
        })
      }
      await poolPromise
      return {
        txHash
      }
    } catch (e) {
      if (typeof e === 'object' && e !== null && '_tag' in e && e._tag === 'AccountNotFoundError') {
        return maybeThrowOnFail(throwOnFail ?? defaultThrowOnFail, {
          errors: [
            {
              name: 'NoBalanceError',
              _tag: 'NoBalanceError',
              message: 'Attempting to create a transaction with an uninitialized account with no balance',
            },
          ],
          executionGasUsed: 0n,
          /**
           * @type {`0x${string}`}
           */
          rawData: '0x',
        })

      }
      client.logger.error(
        e,
        'callHandler: Unexpected error adding transaction to mempool and checkpointing state. Removing transaction from mempool and reverting state',
      )
      pool.removeByHash(bytesToHex(wrappedTx.hash()))
      // don't expect this to ever happen at this point but being defensive
      await vm.stateManager.revert()
      return maybeThrowOnFail(throwOnFail ?? defaultThrowOnFail, {
        errors: [
          {
            name: 'UnexpectedError',
            _tag: 'UnexpectedError',
            message:
              typeof e === 'string'
                ? e
                : e instanceof Error
                  ? e.message
                  : typeof e === 'object' && e !== null && 'message' in e
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
  }
}
