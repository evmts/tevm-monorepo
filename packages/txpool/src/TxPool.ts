import { TxPool as ZevmTxPool } from '@evmts/zevm/txpool'

export type {
	ImpersonatedTx,
	TxPoolBlock,
	TxPoolObject,
	TxPoolOptions,
	TxPoolTransaction,
	TxPoolVm,
} from '@evmts/zevm/txpool'

type FeeMarketLikeTx = {
	maxFeePerGas: bigint
	maxPriorityFeePerGas: bigint
}

type LegacyLikeTx = {
	gasPrice: bigint
}

const isFeeMarketLikeTx = (tx: unknown): tx is FeeMarketLikeTx =>
	typeof tx === 'object' &&
	tx !== null &&
	'maxFeePerGas' in tx &&
	'maxPriorityFeePerGas' in tx &&
	typeof tx.maxFeePerGas === 'bigint' &&
	typeof tx.maxPriorityFeePerGas === 'bigint'

const isLegacyLikeTx = (tx: unknown): tx is LegacyLikeTx =>
	typeof tx === 'object' && tx !== null && 'gasPrice' in tx && typeof tx.gasPrice === 'bigint'

const txType = (tx: unknown) =>
	typeof tx === 'object' && tx !== null && 'type' in tx ? String(tx.type) : 'unknown'

/**
 * Tevm txpool facade.
 *
 * ZEVM's pool handles the storage and nonce ordering, while this facade broadens
 * fee classification to all fee-market-shaped transactions, including EIP-7702.
 */
export class TxPool extends ZevmTxPool {
	constructor(...args: ConstructorParameters<typeof ZevmTxPool>) {
		super(...args)

		const pool = this as unknown as {
			txGasPrice: (tx: unknown) => { maxFee: bigint; tip: bigint }
			normalizedGasPrice: (tx: unknown, baseFee?: bigint) => bigint
		}

		pool.txGasPrice = (tx) => {
			if (isFeeMarketLikeTx(tx)) {
				return {
					maxFee: tx.maxFeePerGas,
					tip: tx.maxPriorityFeePerGas,
				}
			}
			if (isLegacyLikeTx(tx)) {
				return {
					maxFee: tx.gasPrice,
					tip: tx.gasPrice,
				}
			}
			throw new Error(`tx of type ${txType(tx)} unknown`)
		}

		pool.normalizedGasPrice = (tx, baseFee) => {
			if (typeof baseFee === 'bigint' && baseFee !== 0n) {
				if (isFeeMarketLikeTx(tx)) {
					const priorityFeeCap = tx.maxFeePerGas - baseFee
					if (priorityFeeCap <= 0n) {
						return 0n
					}
					return tx.maxPriorityFeePerGas < priorityFeeCap ? tx.maxPriorityFeePerGas : priorityFeeCap
				}
				if (isLegacyLikeTx(tx)) {
					const priorityFee = tx.gasPrice - baseFee
					return priorityFee > 0n ? priorityFee : 0n
				}
				throw new Error(`tx of type ${txType(tx)} unknown`)
			}
			return pool.txGasPrice(tx).maxFee
		}
	}

	cleanup(): void {
		const pool = this as unknown as {
			pool: Map<string, Array<{ hash: string; tx: unknown }>>
			handled: Map<string, unknown>
			txsByHash: Map<string, unknown>
			txsByNonce: Map<string, Map<bigint, unknown>>
			txsInNonceOrder: Map<string, unknown[]>
		}
		const before = new Set([...pool.pool.values()].flatMap((objects) => objects.map((obj) => obj.hash)))

		super.cleanup()

		const liveTxs = new Set<unknown>()
		const after = new Set<string>()
		for (const objects of pool.pool.values()) {
			for (const obj of objects) {
				after.add(obj.hash)
				liveTxs.add(obj.tx)
			}
		}

		for (const hash of before) {
			if (!after.has(hash)) {
				pool.handled.delete(hash)
			}
		}

		for (const [hash, tx] of pool.txsByHash) {
			if (!liveTxs.has(tx)) {
				pool.txsByHash.delete(hash)
			}
		}
		for (const [address, nonceMap] of pool.txsByNonce) {
			for (const [nonce, tx] of nonceMap) {
				if (!liveTxs.has(tx)) {
					nonceMap.delete(nonce)
				}
			}
			if (nonceMap.size === 0) {
				pool.txsByNonce.delete(address)
			}
		}
		for (const [address, txs] of pool.txsInNonceOrder) {
			const live = txs.filter((tx) => liveTxs.has(tx))
			if (live.length === 0) {
				pool.txsInNonceOrder.delete(address)
			} else if (live.length !== txs.length) {
				pool.txsInNonceOrder.set(address, live)
			}
		}
	}
}
