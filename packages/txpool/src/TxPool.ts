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
					return tx.maxPriorityFeePerGas
				}
				if (isLegacyLikeTx(tx)) {
					return tx.gasPrice - baseFee
				}
				throw new Error(`tx of type ${txType(tx)} unknown`)
			}
			return pool.txGasPrice(tx).maxFee
		}
	}
}
