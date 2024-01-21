import type { Hash } from '../../types/misc.js'
import type {
	OptimismRpcBlockOverrides,
	OptimismRpcTransaction,
	OptimismRpcTransactionReceiptOverrides,
	OptimismTransaction,
} from './types.js'
export declare const formattersOptimism: {
	readonly block: {
		exclude: [] | undefined
		format: (
			args: import('../../types/utils.js').Assign<
				Partial<import('../../types/rpc.js').RpcBlock>,
				OptimismRpcBlockOverrides & {
					transactions: Hash[] | OptimismRpcTransaction[]
				}
			>,
		) => {
			baseFeePerGas: bigint | null
			difficulty: bigint
			extraData: `0x${string}`
			gasLimit: bigint
			gasUsed: bigint
			hash: `0x${string}` | null
			logsBloom: `0x${string}` | null
			miner: `0x${string}`
			mixHash: `0x${string}`
			nonce: `0x${string}` | null
			number: bigint | null
			parentHash: `0x${string}`
			receiptsRoot: `0x${string}`
			sealFields: `0x${string}`[]
			sha3Uncles: `0x${string}`
			size: bigint
			stateRoot: `0x${string}`
			timestamp: bigint
			totalDifficulty: bigint | null
			transactions: Hash[] | OptimismTransaction[]
			transactionsRoot: `0x${string}`
			uncles: `0x${string}`[]
		} & {}
		type: 'block'
	}
	readonly transaction: {
		exclude: [] | undefined
		format: (
			args:
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionLegacy<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x0'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionLegacy<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x0'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionLegacy<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x0'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionBase<
								`0x${string}`,
								`0x${string}`,
								boolean
							>,
							'typeHex'
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							isSystemTx?: boolean | undefined
							mint?: `0x${string}` | undefined
							sourceHash: `0x${string}`
							type: '0x7e'
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP2930<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x1'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionLegacy<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x0'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP2930<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x1'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionEIP2930<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x1'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP2930<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x1'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionEIP1559<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x2'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP2930<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x1'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionBase<
								`0x${string}`,
								`0x${string}`,
								boolean
							>,
							'typeHex'
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							isSystemTx?: boolean | undefined
							mint?: `0x${string}` | undefined
							sourceHash: `0x${string}`
							type: '0x7e'
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP1559<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x2'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionLegacy<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x0'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP1559<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x2'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionEIP2930<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x1'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP1559<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x2'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionEIP1559<
								`0x${string}`,
								`0x${string}`,
								boolean,
								'0x2'
							>,
							'typeHex'
						> & {
							isSystemTx?: undefined
							mint?: undefined
							sourceHash?: undefined
						})
				| (import('../../types/utils.js').Assign_<
						Partial<
							Omit<
								import('../../index.js').TransactionEIP1559<
									`0x${string}`,
									`0x${string}`,
									boolean,
									'0x2'
								>,
								'typeHex'
							>
						>,
						OptimismRpcTransaction
				  > &
						Omit<
							import('../../index.js').TransactionBase<
								`0x${string}`,
								`0x${string}`,
								boolean
							>,
							'typeHex'
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							isSystemTx?: boolean | undefined
							mint?: `0x${string}` | undefined
							sourceHash: `0x${string}`
							type: '0x7e'
						}),
		) => (
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: bigint
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: undefined
					chainId?: number | undefined
					type: 'legacy'
					isSystemTx?: undefined
					mint?: undefined
					sourceHash?: undefined
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: undefined
					maxFeePerGas: bigint
					maxPriorityFeePerGas: bigint
					accessList?: undefined
					chainId?: number | undefined
					type: 'deposit'
					isSystemTx?: boolean | undefined
					mint?: bigint | undefined
					sourceHash: `0x${string}`
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: bigint
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'eip2930'
					isSystemTx?: undefined
					mint?: undefined
					sourceHash?: undefined
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: undefined
					maxFeePerGas: bigint
					maxPriorityFeePerGas: bigint
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'eip1559'
					isSystemTx?: undefined
					mint?: undefined
					sourceHash?: undefined
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: undefined
					maxFeePerGas: bigint
					maxPriorityFeePerGas: bigint
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'deposit'
					isSystemTx?: boolean | undefined
					mint?: bigint | undefined
					sourceHash: `0x${string}`
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice: bigint
					maxFeePerGas: undefined
					maxPriorityFeePerGas: undefined
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'eip2930'
					isSystemTx?: undefined
					mint?: undefined
					sourceHash?: undefined
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice?: undefined
					maxFeePerGas: bigint
					maxPriorityFeePerGas: bigint
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'eip1559'
					isSystemTx?: undefined
					mint?: undefined
					sourceHash?: undefined
			  }
			| {
					blockHash: `0x${string}` | null
					blockNumber: bigint | null
					from: `0x${string}`
					gas: bigint
					hash: `0x${string}`
					input: `0x${string}`
					nonce: number
					r: `0x${string}`
					s: `0x${string}`
					to: `0x${string}` | null
					transactionIndex: number | null
					typeHex: `0x${string}` | null
					v: bigint
					value: bigint
					gasPrice?: undefined
					maxFeePerGas: bigint
					maxPriorityFeePerGas: bigint
					accessList: import('../../index.js').AccessList
					chainId: number
					type: 'deposit'
					isSystemTx?: boolean | undefined
					mint?: bigint | undefined
					sourceHash: `0x${string}`
			  }
		) & {}
		type: 'transaction'
	}
	readonly transactionReceipt: {
		exclude: [] | undefined
		format: (
			args: import('../../types/utils.js').Assign<
				Partial<import('../../types/rpc.js').RpcTransactionReceipt>,
				OptimismRpcTransactionReceiptOverrides
			>,
		) => {
			blockHash: `0x${string}`
			blockNumber: bigint
			contractAddress: `0x${string}` | null
			cumulativeGasUsed: bigint
			effectiveGasPrice: bigint
			from: `0x${string}`
			gasUsed: bigint
			logs: import('../../index.js').Log<bigint, number>[]
			logsBloom: `0x${string}`
			status: 'success' | 'reverted'
			to: `0x${string}` | null
			transactionHash: `0x${string}`
			transactionIndex: number
			type: import('../../index.js').TransactionType
			l1GasPrice: bigint | null
			l1GasUsed: bigint | null
			l1Fee: bigint | null
			l1FeeScalar: number | null
		} & {}
		type: 'transactionReceipt'
	}
}
//# sourceMappingURL=formatters.d.ts.map
