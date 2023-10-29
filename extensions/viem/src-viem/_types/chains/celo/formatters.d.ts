import type { Hash } from '../../types/misc.js'
import type {
	CeloBlockOverrides,
	CeloRpcTransaction,
	CeloRpcTransactionReceiptOverrides,
	CeloTransaction,
	CeloTransactionRequest,
} from './types.js'
export declare const formattersCelo: {
	readonly block: {
		exclude:
			| ('nonce' | 'difficulty' | 'gasLimit' | 'mixHash' | 'uncles')[]
			| undefined
		format: (
			args: import('../../types/utils.js').Assign<
				Partial<import('../../types/rpc.js').RpcBlock>,
				CeloBlockOverrides & {
					transactions: Hash[] | CeloRpcTransaction[]
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
			transactions: Hash[] | CeloTransaction[]
			transactionsRoot: `0x${string}`
			uncles: `0x${string}`[]
			randomness: {
				committed: `0x${string}`
				revealed: `0x${string}`
			}
		} & {
			nonce: never
			difficulty: never
			gasLimit: never
			mixHash: never
			uncles: never
		}
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
				  > &
						import('../../index.js').TransactionBase<
							`0x${string}`,
							`0x${string}`,
							boolean
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
							type: '0x7c'
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
				  > &
						import('../../index.js').TransactionBase<
							`0x${string}`,
							`0x${string}`,
							boolean
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
							type: '0x7c'
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
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
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
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
						CeloRpcTransaction
				  > &
						import('../../index.js').TransactionBase<
							`0x${string}`,
							`0x${string}`,
							boolean
						> &
						import('../../index.js').FeeValuesEIP1559<`0x${string}`> & {
							feeCurrency: `0x${string}` | null
							gatewayFee: `0x${string}` | null
							gatewayFeeRecipient: `0x${string}` | null
							type: '0x7c'
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
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					type: 'cip42'
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					type: 'cip42'
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
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
					type: 'cip42'
					feeCurrency: `0x${string}` | null
					gatewayFee: bigint | null
					gatewayFeeRecipient: `0x${string}` | null
			  }
		) & {}
		type: 'transaction'
	}
	readonly transactionReceipt: {
		exclude: [] | undefined
		format: (
			args: import('../../types/utils.js').Assign<
				Partial<import('../../types/rpc.js').RpcTransactionReceipt>,
				CeloRpcTransactionReceiptOverrides
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
			feeCurrency: `0x${string}` | null
			gatewayFee: bigint | null
			gatewayFeeRecipient: `0x${string}` | null
		} & {}
		type: 'transactionReceipt'
	}
	readonly transactionRequest: {
		exclude: [] | undefined
		format: (
			args: import('../../types/utils.js').Assign<
				Partial<import('../../index.js').TransactionRequest>,
				CeloTransactionRequest
			>,
		) => (
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: undefined
					type?: '0x0' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x1' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x2' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x7c' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: undefined
					type?: '0x0' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x1' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x2' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x7c' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: undefined
					type?: '0x0' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: `0x${string}` | undefined
					maxFeePerGas?: undefined
					maxPriorityFeePerGas?: undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x1' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x2' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
			| {
					data?: `0x${string}` | undefined
					from: `0x${string}`
					gas?: `0x${string}` | undefined
					nonce?: `0x${string}` | undefined
					to?: `0x${string}` | undefined
					value?: `0x${string}` | undefined
					gasPrice?: undefined
					maxFeePerGas?: `0x${string}` | undefined
					maxPriorityFeePerGas?: `0x${string}` | undefined
					accessList?: import('../../index.js').AccessList | undefined
					type?: '0x7c' | undefined
					feeCurrency?: `0x${string}` | undefined
					gatewayFee?: `0x${string}` | undefined
					gatewayFeeRecipient?: `0x${string}` | undefined
			  }
		) & {}
		type: 'transactionRequest'
	}
}
//# sourceMappingURL=formatters.d.ts.map
