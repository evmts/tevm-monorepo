// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts

import type { Block } from '@tevm/block'
import { type Chain, getBlock } from '@tevm/blockchain'
import { Rlp } from '@tevm/rlp'
import type { TransactionType, TypedTransaction } from '@tevm/tx'
import type { EthjsLog } from '@tevm/utils'
import { Bloom, bytesToBigInt, bytesToNumber, equalsBytes, hexToBytes, numberToHex, stringToHex } from '@tevm/utils'
import type { MapDb } from './MapDb.js'

// Some of these types are actually from the Vm package but they are better to live here imo
/**
 * Abstract interface with common transaction receipt fields that all receipt types share
 * This serves as the base for both pre and post-Byzantium transaction receipts
 */
export interface BaseTxReceipt {
	/**
	 * Cumulative gas used in the block including this transaction
	 * Represented as a bigint to handle large gas values accurately
	 */
	cumulativeBlockGasUsed: bigint

	/**
	 * Bloom filter bitvector containing indexed log data
	 * Used for efficient searching of logs in the blockchain
	 */
	bitvector: Uint8Array

	/**
	 * Array of logs emitted during transaction execution
	 * Each log contains address, topics, and data fields
	 */
	logs: EthjsLog[]
}

/**
 * Receipt type for Byzantium and beyond (EIP-658)
 * Replaces the intermediary state root field with a status code field
 * Introduced in the Byzantium hard fork
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Status of transaction execution
	 * - `1` if successful
	 * - `0` if an exception occurred during execution
	 */
	status: 0 | 1
}

/**
 * Pre-Byzantium receipt type used before the Byzantium hard fork
 * Contains a state root field instead of the status code used in later versions
 */
export interface PreByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Intermediary state root after transaction execution
	 * This is a 32-byte Merkle root of the state trie
	 */
	stateRoot: Uint8Array
}

/**
 * Receipt type for EIP-4844 blob transactions
 * Extends the post-Byzantium receipt with additional blob gas fields
 */
export interface EIP4844BlobTxReceipt extends PostByzantiumTxReceipt {
	/**
	 * Amount of blob gas consumed by the transaction
	 *
	 * Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasUsed: bigint

	/**
	 * Price of blob gas for the block the transaction was included in
	 *
	 * Note: This value is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasPrice: bigint
}

/**
 * Union type of all transaction receipt types
 * Can be pre-Byzantium, post-Byzantium, or EIP-4844 blob receipt
 */
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt

/**
 * TxReceiptWithType extends TxReceipt to provide transaction type information
 * This is used when the receipt needs to include the transaction type (EIP-2718)
 */
export type TxReceiptWithType = PreByzantiumTxReceiptWithType | PostByzantiumTxReceiptWithType

/**
 * Pre-Byzantium receipt type with transaction type information
 * Extends the pre-Byzantium receipt with the EIP-2718 transaction type
 */
interface PreByzantiumTxReceiptWithType extends PreByzantiumTxReceipt {
	/**
	 * EIP-2718 Typed Transaction Envelope type
	 * Indicates which transaction format was used
	 */
	txType: TransactionType
}

/**
 * Post-Byzantium receipt type with transaction type information
 * Extends the post-Byzantium receipt with the EIP-2718 transaction type
 */
interface PostByzantiumTxReceiptWithType extends PostByzantiumTxReceipt {
	/**
	 * EIP-2718 Typed Transaction Envelope type
	 * Indicates which transaction format was used
	 */
	txType: TransactionType
}

/**
 * Return type for getReceiptByTxHash method containing the receipt and its metadata
 * Used to format responses for RPC methods like eth_getTransactionReceipt
 */
type GetReceiptByTxHashReturn = [receipt: TxReceipt, blockHash: Uint8Array, txIndex: number, logIndex: number]

/**
 * Return type for getLogs method containing log entries with their associated block and transaction data
 * Used to format responses for RPC methods like eth_getLogs
 */
type GetLogsReturn = {
	/** The log entry containing address, topics, and data */
	log: EthjsLog
	/** The block containing the transaction that produced this log */
	block: Block
	/** The transaction that produced this log */
	tx: TypedTransaction
	/** Index of the transaction within the block */
	txIndex: number
	/** Global index of the log within the block */
	logIndex: number
}[]

/**
 * Index type for mapping transaction hashes to their block hash and position
 * Used to efficiently look up receipts by transaction hash
 */
type TxHashIndex = [blockHash: Uint8Array, txIndex: number]

/**
 * Enum defining the types of indexes that can be maintained
 * Currently only supports transaction hash indexes
 */
enum IndexType {
	/** Index for mapping transaction hashes to block hash and position */
	TxHash = 0,
}

/**
 * Enum defining operations that can be performed on indexes
 */
enum IndexOperation {
	/** Create or update an index */
	Save = 0,
	/** Remove an index */
	Delete = 1,
}

/**
 * Types for RLP encoding and decoding
 */

/** Type alias for log entries in RLP format */
type rlpLog = EthjsLog

/** RLP format for receipt entries: [status/stateRoot, gasUsed, logs] */
type rlpReceipt = [postStateOrStatus: Uint8Array, cumulativeGasUsed: Uint8Array, logs: rlpLog[]]

/** RLP format for txHash index entries: [blockHash, txIndex] */
type rlpTxHash = [blockHash: Uint8Array, txIndex: Uint8Array]

/**
 * Enum for RLP conversion operations
 */
enum RlpConvert {
	/** Convert from JavaScript objects to RLP-encoded bytes */
	Encode = 0,
	/** Convert from RLP-encoded bytes to JavaScript objects */
	Decode = 1,
}

/**
 * Enum for RLP data types
 */
enum RlpType {
	/** Transaction receipts for a block */
	Receipts = 0,
	/** Log entries */
	Logs = 1,
	/** Transaction hash index */
	TxHash = 2,
}

/**
 * Union type for data that can be RLP encoded or decoded
 */
type rlpOut = EthjsLog[] | TxReceipt[] | TxHashIndex

/**
 * Manages transaction receipts within the Ethereum virtual machine
 * Provides methods for storing, retrieving, and searching transaction receipts and logs
 */
export class ReceiptsManager {
	/**
	 * Creates a new ReceiptsManager instance
	 * @param mapDb - The database instance for storing receipts and indexes
	 * @param chain - The blockchain instance for retrieving blocks
	 */
	constructor(
		public readonly mapDb: MapDb,
		public readonly chain: Chain,
	) {}

	/**
	 * Maximum number of logs to return in getLogs
	 * This prevents excessive memory usage and response size
	 */
	GET_LOGS_LIMIT = 10000

	/**
	 * Maximum size of getLogs response in megabytes
	 * This prevents excessive memory usage and response size
	 */
	GET_LOGS_LIMIT_MEGABYTES = 150

	/**
	 * Maximum block range that can be queried in a single getLogs call
	 * This prevents excessive computational load from large queries
	 */
	GET_LOGS_BLOCK_RANGE_LIMIT = 2500

	/**
	 * Creates a deep copy of this ReceiptsManager with a new chain reference
	 * Useful for creating a snapshot of the current state
	 *
	 * @param chain - The new chain reference to use
	 * @returns A new ReceiptsManager instance with copied state
	 */
	deepCopy(chain: Chain): ReceiptsManager {
		return new ReceiptsManager(this.mapDb.deepCopy(), chain)
	}

	/**
	 * Saves transaction receipts to the database for a given block
	 * Also builds and saves transaction hash indexes for efficient lookups
	 *
	 * @param block - The block containing the transactions
	 * @param receipts - The transaction receipts to save
	 * @returns Promise that resolves when saving is complete
	 *
	 * @example
	 * const block = await chain.getBlock(blockNumber)
	 * await receiptManager.saveReceipts(block, txReceipts)
	 */
	async saveReceipts(block: Block, receipts: TxReceipt[]) {
		const encoded = this.rlp(RlpConvert.Encode, RlpType.Receipts, receipts)
		await this.mapDb.put('Receipts', block.hash(), encoded)
		await this.updateIndex(IndexOperation.Save, IndexType.TxHash, block)
	}

	/**
	 * Deletes transaction receipts and their indexes for a given block
	 * Used when removing or replacing block data
	 *
	 * @param block - The block whose receipts should be deleted
	 * @returns Promise that resolves when deletion is complete
	 *
	 * @example
	 * const block = await chain.getBlock(blockNumber)
	 * await receiptManager.deleteReceipts(block)
	 */
	async deleteReceipts(block: Block) {
		await this.mapDb.delete('Receipts', block.hash())
		await this.updateIndex(IndexOperation.Delete, IndexType.TxHash, block)
	}

	/**
	 * Retrieves transaction receipts for a given block hash
	 * Can optionally calculate bloom filters and include transaction types
	 *
	 * @param blockHash - The hash of the block to get receipts for
	 * @param calcBloom - Whether to calculate and include bloom filters (default: false)
	 * @param includeTxType - Whether to include transaction types in the receipts (default: false)
	 * @returns Promise resolving to an array of transaction receipts
	 *
	 * @example
	 * // Get basic receipts
	 * const receipts = await receiptManager.getReceipts(blockHash)
	 *
	 * // Get receipts with bloom filters and transaction types
	 * const receiptsWithDetails = await receiptManager.getReceipts(blockHash, true, true)
	 */
	async getReceipts(blockHash: Uint8Array, calcBloom?: boolean, includeTxType?: true): Promise<TxReceiptWithType[]>
	async getReceipts(blockHash: Uint8Array, calcBloom?: boolean, includeTxType?: false): Promise<TxReceipt[]>
	async getReceipts(
		blockHash: Uint8Array,
		calcBloom = false,
		includeTxType = false,
	): Promise<TxReceipt[] | TxReceiptWithType[]> {
		const encoded = await this.mapDb.get('Receipts', blockHash)
		if (!encoded) return []
		let receipts = this.rlp(RlpConvert.Decode, RlpType.Receipts, encoded)
		if (calcBloom) {
			receipts = receipts.map((r) => {
				r.bitvector = this.logsBloom(r.logs).bitvector
				return r
			})
		}
		if (includeTxType) {
			const block = await getBlock(this.chain)(blockHash)
			receipts = (receipts as TxReceiptWithType[]).map((r, i) => {
				const type = block.transactions[i]?.type
				if (type) {
					r.txType = type
				}
				return r
			})
		}
		return receipts
	}

	/**
	 * Retrieves a transaction receipt by transaction hash
	 * Also returns additional metadata needed for JSON-RPC responses
	 *
	 * @param txHash - The transaction hash to look up
	 * @returns Promise resolving to receipt data or null if not found
	 *
	 * @example
	 * const receiptData = await receiptManager.getReceiptByTxHash(txHash)
	 * if (receiptData) {
	 *   const [receipt, blockHash, txIndex, logIndex] = receiptData
	 *   // Use receipt data
	 * }
	 */
	async getReceiptByTxHash(txHash: Uint8Array): Promise<GetReceiptByTxHashReturn | null> {
		const txHashIndex = await this.getIndex(IndexType.TxHash, txHash)
		if (!txHashIndex) return null
		const [blockHash, txIndex] = txHashIndex
		const receipts = await this.getReceipts(blockHash)
		if (receipts.length === 0) return null
		let logIndex = 0
		receipts.slice(0, txIndex).forEach((r) => {
			logIndex += r.logs.length
		})
		const receipt = receipts[txIndex]
		if (!receipt) {
			throw new Error('Receipt not found')
		}
		receipt.bitvector = this.logsBloom(receipt.logs).bitvector
		return [receipt, blockHash, txIndex, logIndex]
	}

	/**
	 * Retrieves logs matching the specified criteria within a block range
	 * Implements the core functionality of eth_getLogs JSON-RPC method
	 * Enforces size and count limits to prevent excessive resource usage
	 *
	 * @param from - The starting block
	 * @param to - The ending block
	 * @param addresses - Optional array of addresses to filter logs by
	 * @param topics - Optional array of topics to filter logs by, can include arrays and nulls
	 * @returns Promise resolving to array of matching logs with metadata
	 *
	 * @example
	 * // Get all logs between blocks 100 and 200
	 * const logs = await receiptManager.getLogs(block100, block200)
	 *
	 * // Get logs from a specific contract
	 * const logs = await receiptManager.getLogs(block100, block200, [contractAddress])
	 *
	 * // Get logs with specific topics
	 * const logs = await receiptManager.getLogs(block100, block200, undefined, [eventTopic])
	 */
	async getLogs(
		from: Block,
		to: Block,
		addresses?: Uint8Array[],
		topics: (Uint8Array | Uint8Array[] | null)[] = [],
	): Promise<GetLogsReturn> {
		const returnedLogs: GetLogsReturn = []
		let returnedLogsSize = 0
		for (let i = from.header.number; i <= to.header.number; i++) {
			const block = await getBlock(this.chain)(i)
			const receipts = await this.getReceipts(block.hash())
			if (receipts.length === 0) continue
			let logs: GetLogsReturn = []
			let logIndex = 0
			for (const [receiptIndex, receipt] of receipts.entries()) {
				logs.push(
					...receipt.logs.map((log) => ({
						log,
						block,
						tx: block.transactions[receiptIndex] as TypedTransaction,
						txIndex: receiptIndex,
						logIndex: logIndex++,
					})),
				)
			}
			if (addresses && addresses.length > 0) {
				logs = logs.filter((l) => addresses.some((a) => equalsBytes(a, l.log[0])))
			}
			if (topics.length > 0) {
				// From https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter/:
				// Topics are order-dependent. A transaction with a log with topics
				// [A, B] will be matched by the following topic filters:
				//  * [] - anything
				//  * [A] - A in first position (and anything after)
				//  * [null, B] - anything in first position AND B in second position (and anything after)
				//  * [A, B] - A in first position AND B in second position (and anything after)
				//  * [[A, B], [A, B]] - (A OR B) in first position AND (A OR B) in second position (and anything after)
				logs = logs.filter((l) => {
					for (const [i, topic] of topics.entries()) {
						if (Array.isArray(topic)) {
							// Can match any items in this array
							if (!topic.find((t) => equalsBytes(t, l.log[1][i] as Uint8Array))) return false
						} else if (!topic) {
							// If null then can match any
						} else {
							// If a value is specified then it must match
							if (!equalsBytes(topic, l.log[1][i] as Uint8Array)) return false
						}
						return true
					}
					return false
				})
			}
			returnedLogs.push(...logs)
			// TODO add stringToBytes to utils
			returnedLogsSize += hexToBytes(stringToHex(JSON.stringify(logs))).byteLength
			if (returnedLogs.length >= this.GET_LOGS_LIMIT || returnedLogsSize >= this.GET_LOGS_LIMIT_MEGABYTES * 1048576) {
				break
			}
		}
		return returnedLogs
	}

	/**
	 * Updates indexes in the database based on the operation type
	 * Used internally to maintain transaction hash to receipt mappings
	 *
	 * @param operation - Whether to save or delete indexes
	 * @param type - The type of index to update
	 * @param value - The data used to update indexes (typically a block)
	 * @returns Promise that resolves when the update is complete
	 * @private
	 */
	private async updateIndex(operation: IndexOperation, type: IndexType.TxHash, value: Block): Promise<void>
	private async updateIndex(operation: IndexOperation, type: IndexType, value: any): Promise<void> {
		switch (type) {
			case IndexType.TxHash: {
				const block = value
				if (operation === IndexOperation.Save) {
					for (const [i, tx] of block.transactions.entries()) {
						const index: TxHashIndex = [block.hash(), i]
						const encoded = this.rlp(RlpConvert.Encode, RlpType.TxHash, index)
						await this.mapDb.put('TxHash', tx.hash(), encoded)
					}
				} else if (operation === IndexOperation.Delete) {
					for (const tx of block.transactions) {
						await this.mapDb.delete('TxHash', tx.hash())
					}
				}
				break
			}
			default:
				throw new Error('Unsupported index type')
		}
	}

	/**
	 * Retrieves an index value from the database
	 * Used internally to look up transaction hash mappings
	 *
	 * @param type - The type of index to retrieve
	 * @param value - The key to look up (typically a transaction hash)
	 * @returns Promise resolving to the index value or null if not found
	 * @private
	 */
	private async getIndex(type: IndexType.TxHash, value: Uint8Array): Promise<TxHashIndex | null>
	private async getIndex(type: IndexType, value: Uint8Array): Promise<any | null> {
		switch (type) {
			case IndexType.TxHash: {
				const encoded = await this.mapDb.get('TxHash', value)
				if (!encoded) return null
				return this.rlp(RlpConvert.Decode, RlpType.TxHash, encoded)
			}
			default:
				throw new Error('Unsupported index type')
		}
	}

	/**
	 * Encodes or decodes data using RLP serialization for database storage
	 * Supports different data types and formats based on the parameters
	 *
	 * @param conversion - Whether to encode or decode
	 * @param type - The type of data being processed
	 * @param value - The data to encode or decode
	 * @returns Encoded bytes or decoded data structures
	 * @private
	 */
	private rlp(conversion: RlpConvert.Encode, type: RlpType, value: rlpOut): Uint8Array
	private rlp(conversion: RlpConvert.Decode, type: RlpType.Receipts, values: Uint8Array): TxReceipt[]
	private rlp(conversion: RlpConvert.Decode, type: RlpType.Logs, value: rlpLog[]): EthjsLog[]
	private rlp(conversion: RlpConvert.Decode, type: RlpType.TxHash, value: Uint8Array): TxHashIndex
	private rlp(conversion: RlpConvert, type: RlpType, value: Uint8Array | rlpOut): Uint8Array | rlpOut {
		switch (type) {
			case RlpType.Receipts: {
				if (conversion === RlpConvert.Encode) {
					return Rlp.encode(
						(value as TxReceipt[]).map((r) => [
							(r as PreByzantiumTxReceipt).stateRoot ??
								// TODO add numberToBytes to utils
								hexToBytes(numberToHex((r as PostByzantiumTxReceipt).status)),
							// TODO add numberToBytes to utils
							hexToBytes(numberToHex(r.cumulativeBlockGasUsed)),
							this.rlp(RlpConvert.Encode, RlpType.Logs, r.logs),
						]),
					)
				}
				const decoded = Rlp.decode(value as Uint8Array) as unknown as rlpReceipt[]
				return decoded.map((r) => {
					const gasUsed = r[1]
					const logs = this.rlp(RlpConvert.Decode, RlpType.Logs, r[2])
					if (r[0].length === 32) {
						// Pre-Byzantium Receipt
						return {
							stateRoot: r[0],
							cumulativeBlockGasUsed: bytesToBigInt(gasUsed),
							logs,
						} as PreByzantiumTxReceipt
					}
					// Post-Byzantium Receipt
					return {
						status: bytesToNumber(r[0]),
						cumulativeBlockGasUsed: bytesToBigInt(gasUsed),
						logs,
					} as PostByzantiumTxReceipt
				})
			}
			case RlpType.Logs:
				if (conversion === RlpConvert.Encode) {
					return Rlp.encode(value as EthjsLog[])
				}
				return Rlp.decode(value as Uint8Array) as EthjsLog[]
			case RlpType.TxHash: {
				if (conversion === RlpConvert.Encode) {
					const [blockHash, txIndex] = value as TxHashIndex
					// TODO add numberToBytes to utils
					return Rlp.encode([blockHash, hexToBytes(numberToHex(txIndex))])
				}
				const [blockHash, txIndex] = Rlp.decode(value as Uint8Array) as unknown as rlpTxHash
				return [blockHash, bytesToNumber(txIndex)] as TxHashIndex
			}
			default:
				throw new Error('Unknown rlp conversion')
		}
	}

	/**
	 * Calculates a Bloom filter for a set of transaction logs
	 * Used for efficient log filtering and lookups
	 *
	 * @param logs - The logs to include in the bloom filter
	 * @returns A Bloom filter containing the log data
	 * @private
	 */
	private logsBloom(logs: rlpLog[]) {
		const bloom = new Bloom()
		for (let i = 0; i < logs.length; i++) {
			const log = logs[i]
			if (!log) {
				throw new Error('Log is empty')
			}
			// add the address
			bloom.add(log[0])
			// add the topics
			const topics = log[1]
			for (let q = 0; q < topics.length; q++) {
				bloom.add(topics[q] as Uint8Array)
			}
		}
		return bloom
	}
}
