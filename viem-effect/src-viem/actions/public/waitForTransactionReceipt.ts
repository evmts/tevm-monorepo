import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import {
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
} from '../../errors/transaction.js'
import type { ErrorType } from '../../errors/utils.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import type { Transaction } from '../../types/transaction.js'
import { type ObserveErrorType, observe } from '../../utils/observe.js'
import { withRetry } from '../../utils/promise/withRetry.js'
import { stringify } from '../../utils/stringify.js'

import { type GetBlockErrorType, getBlock } from './getBlock.js'
import {
  type GetTransactionErrorType,
  type GetTransactionReturnType,
  getTransaction,
} from './getTransaction.js'
import {
  type GetTransactionReceiptErrorType,
  type GetTransactionReceiptReturnType,
  getTransactionReceipt,
} from './getTransactionReceipt.js'
import {
  type WatchBlockNumberErrorType,
  watchBlockNumber,
} from './watchBlockNumber.js'

export type ReplacementReason = 'cancelled' | 'replaced' | 'repriced'
export type ReplacementReturnType<
  TChain extends Chain | undefined = Chain | undefined,
> = {
  reason: ReplacementReason
  replacedTransaction: Transaction
  transaction: Transaction
  transactionReceipt: GetTransactionReceiptReturnType<TChain>
}

export type WaitForTransactionReceiptReturnType<
  TChain extends Chain | undefined = Chain | undefined,
> = GetTransactionReceiptReturnType<TChain>

export type WaitForTransactionReceiptParameters<
  TChain extends Chain | undefined = Chain | undefined,
> = {
  /**
   * The number of confirmations (blocks that have passed) to wait before resolving.
   * @default 1
   */
  confirmations?: number
  /** The hash of the transaction. */
  hash: Hash
  /** Optional callback to emit if the transaction has been replaced. */
  onReplaced?: (response: ReplacementReturnType<TChain>) => void
  /**
   * Polling frequency (in ms). Defaults to the client's pollingInterval config.
   * @default client.pollingInterval
   */
  pollingInterval?: number
  /** Optional timeout (in milliseconds) to wait before stopping polling. */
  timeout?: number
}

export type WaitForTransactionReceiptErrorType =
  | ObserveErrorType
  | GetBlockErrorType
  | GetTransactionErrorType
  | GetTransactionReceiptErrorType
  | WatchBlockNumberErrorType
  | ErrorType

/**
 * Waits for the [Transaction](https://viem.sh/docs/glossary/terms.html#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms.html#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms.html#transaction-receipt). If the Transaction reverts, then the action will throw an error.
 *
 * - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt.html
 * - Example: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/transactions/sending-transactions
 * - JSON-RPC Methods:
 *   - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
 *   - If a Transaction has been replaced:
 *     - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
 *     - Checks if one of the Transactions is a replacement
 *     - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).
 *
 * The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).
 *
 * Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.
 *
 * There are 3 types of Transaction Replacement reasons:
 *
 * - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
 * - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
 * - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)
 *
 * @param client - Client to use
 * @param parameters - {@link WaitForTransactionReceiptParameters}
 * @returns The transaction receipt. {@link WaitForTransactionReceiptReturnType}
 *
 * @example
 * import { createPublicClient, waitForTransactionReceipt, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionReceipt = await waitForTransactionReceipt(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
export async function waitForTransactionReceipt<
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    confirmations = 1,
    hash,
    onReplaced,
    pollingInterval = client.pollingInterval,
    timeout,
  }: WaitForTransactionReceiptParameters<TChain>,
): Promise<WaitForTransactionReceiptReturnType<TChain>> {
  const observerId = stringify(['waitForTransactionReceipt', client.uid, hash])

  let transaction: GetTransactionReturnType<TChain> | undefined
  let replacedTransaction: GetTransactionReturnType<TChain> | undefined
  let receipt: GetTransactionReceiptReturnType<TChain>
  let retrying = false

  return new Promise((resolve, reject) => {
    if (timeout)
      setTimeout(
        () => reject(new WaitForTransactionReceiptTimeoutError({ hash })),
        timeout,
      )

    const _unobserve = observe(
      observerId,
      { onReplaced, resolve, reject },
      (emit) => {
        const _unwatch = watchBlockNumber(client, {
          emitMissed: true,
          emitOnBegin: true,
          poll: true,
          pollingInterval,
          async onBlockNumber(blockNumber_) {
            if (retrying) return

            let blockNumber = blockNumber_

            const done = (fn: () => void) => {
              _unwatch()
              fn()
              _unobserve()
            }

            try {
              // If we already have a valid receipt, let's check if we have enough
              // confirmations. If we do, then we can resolve.
              if (receipt) {
                if (
                  confirmations > 1 &&
                  (!receipt.blockNumber ||
                    blockNumber - receipt.blockNumber + 1n < confirmations)
                )
                  return

                done(() => emit.resolve(receipt))
                return
              }

              // Get the transaction to check if it's been replaced.
              // We need to retry as some RPC Providers may be slow to sync
              // up mined transactions.
              if (!transaction) {
                retrying = true
                await withRetry(
                  async () => {
                    transaction = await getTransaction(client, { hash })
                    if (transaction.blockNumber)
                      blockNumber = transaction.blockNumber
                  },
                  {
                    // exponential backoff
                    delay: ({ count }) => ~~(1 << count) * 200,
                    retryCount: 6,
                  },
                )
                retrying = false
              }

              // Get the receipt to check if it's been processed.
              receipt = await getTransactionReceipt(client, { hash })

              // Check if we have enough confirmations. If not, continue polling.
              if (
                confirmations > 1 &&
                (!receipt.blockNumber ||
                  blockNumber - receipt.blockNumber + 1n < confirmations)
              )
                return

              done(() => emit.resolve(receipt))
            } catch (err) {
              // If the receipt is not found, the transaction will be pending.
              // We need to check if it has potentially been replaced.
              if (
                transaction &&
                (err instanceof TransactionNotFoundError ||
                  err instanceof TransactionReceiptNotFoundError)
              ) {
                try {
                  replacedTransaction = transaction

                  // Let's retrieve the transactions from the current block.
                  const block = await getBlock(client, {
                    blockNumber,
                    includeTransactions: true,
                  })

                  const replacementTransaction = (
                    block.transactions as Transaction[]
                  ).find(
                    ({ from, nonce }) =>
                      from === replacedTransaction!.from &&
                      nonce === replacedTransaction!.nonce,
                  )

                  // If we couldn't find a replacement transaction, continue polling.
                  if (!replacementTransaction) return

                  // If we found a replacement transaction, return it's receipt.
                  receipt = await getTransactionReceipt(client, {
                    hash: replacementTransaction.hash,
                  })

                  // Check if we have enough confirmations. If not, continue polling.
                  if (
                    confirmations > 1 &&
                    (!receipt.blockNumber ||
                      blockNumber - receipt.blockNumber + 1n < confirmations)
                  )
                    return

                  let reason: ReplacementReason = 'replaced'
                  if (
                    replacementTransaction.to === replacedTransaction.to &&
                    replacementTransaction.value === replacedTransaction.value
                  ) {
                    reason = 'repriced'
                  } else if (
                    replacementTransaction.from === replacementTransaction.to &&
                    replacementTransaction.value === 0n
                  ) {
                    reason = 'cancelled'
                  }

                  done(() => {
                    emit.onReplaced?.({
                      reason,
                      replacedTransaction: replacedTransaction!,
                      transaction: replacementTransaction,
                      transactionReceipt: receipt,
                    })
                    emit.resolve(receipt)
                  })
                } catch (err_) {
                  done(() => emit.reject(err_))
                }
              } else {
                done(() => emit.reject(err))
              }
            }
          },
        })
      },
    )
  })
}
