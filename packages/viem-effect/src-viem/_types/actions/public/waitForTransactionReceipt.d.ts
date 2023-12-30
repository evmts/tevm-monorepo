import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import type { Transaction } from '../../types/transaction.js'
import { type GetTransactionReceiptReturnType } from './getTransactionReceipt.js'
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
export declare function waitForTransactionReceipt<
	TChain extends Chain | undefined,
>(
	client: Client<Transport, TChain>,
	{
		confirmations,
		hash,
		onReplaced,
		pollingInterval,
		timeout,
	}: WaitForTransactionReceiptParameters<TChain>,
): Promise<WaitForTransactionReceiptReturnType<TChain>>
//# sourceMappingURL=waitForTransactionReceipt.d.ts.map
