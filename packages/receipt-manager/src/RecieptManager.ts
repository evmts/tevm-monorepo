// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { Rlp } from '@tevm/rlp'
import { Bloom, bytesToBigInt, bytesToNumber, equalsBytes, hexToBytes, numberToHex, stringToHex } from '@tevm/utils'

import type { Block } from '@tevm/block'
import { type Chain, getBlock } from '@tevm/blockchain'
import type { TransactionType, TypedTransaction } from '@tevm/tx'
import type { EthjsLog } from '@tevm/utils'
import type { MapDb } from './MapDb.js'

// Some of these types are actually from the Vm package but they are better to live here imo
/**
 * Abstract interface with common transaction receipt fields
 */
export interface BaseTxReceipt {
	/**
	 * Cumulative gas used in the block including this tx
	 */
	cumulativeBlockGasUsed: bigint
	/**
	 * Bloom bitvector
	 */
	bitvector: Uint8Array
	/**
	 * Logs emitted
	 */
	logs: EthjsLog[]
}
/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Status of transaction, `1` if successful, `0` if an exception occurred
	 */
	status: 0 | 1
}
/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends BaseTxReceipt {
	/**
	 * Intermediary state root
	 */
	stateRoot: Uint8Array
}
export interface EIP4844BlobTxReceipt extends PostByzantiumTxReceipt {
	/**
	 * blob gas consumed by a transaction
	 *
	 * Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasUsed: bigint
	/**
	 * blob gas price for block transaction was included in
	 *
	 * Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
	 * and is only provided as part of receipt metadata.
	 */
	blobGasPrice: bigint
}
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt
/**
 * TxReceiptWithType extends TxReceipt to provide:
 *  - txType: byte prefix for serializing typed tx receipts
 */
export type TxReceiptWithType = PreByzantiumTxReceiptWithType | PostByzantiumTxReceiptWithType
interface PreByzantiumTxReceiptWithType extends PreByzantiumTxReceipt {
	/* EIP-2718 Typed Transaction Envelope type */
	txType: TransactionType
}
interface PostByzantiumTxReceiptWithType extends PostByzantiumTxReceipt {
	/* EIP-2718 Typed Transaction Envelope type */
	txType: TransactionType
}

/**
 * Function return values
 */
type GetReceiptByTxHashReturn = [receipt: TxReceipt, blockHash: Uint8Array, txIndex: number, logIndex: number]
type GetLogsReturn = {
	log: EthjsLog
	block: Block
	tx: TypedTransaction
	txIndex: number
	logIndex: number
}[]

/**
 * Indexes
 */
type TxHashIndex = [blockHash: Uint8Array, txIndex: number]

enum IndexType {
	TxHash = 0,
}
enum IndexOperation {
	Save = 0,
	Delete = 1,
}

/**
 * Storage encodings
 */
type rlpLog = EthjsLog
type rlpReceipt = [postStateOrStatus: Uint8Array, cumulativeGasUsed: Uint8Array, logs: rlpLog[]]
type rlpTxHash = [blockHash: Uint8Array, txIndex: Uint8Array]

enum RlpConvert {
	Encode = 0,
	Decode = 1,
}
enum RlpType {
	Receipts = 0,
	Logs = 1,
	TxHash = 2,
}
type rlpOut = EthjsLog[] | TxReceipt[] | TxHashIndex

export class ReceiptsManager {
	constructor(
		public readonly mapDb: MapDb,
		public readonly chain: Chain,
	) {}
	/**
	 * Limit of logs to return in getLogs
	 */
	GET_LOGS_LIMIT = 10000

	/**
	 * Size limit for the getLogs response in megabytes
	 */
	GET_LOGS_LIMIT_MEGABYTES = 150

	/**
	 * Block range limit for getLogs
	 */
	GET_LOGS_BLOCK_RANGE_LIMIT = 2500

	deepCopy(chain: Chain): ReceiptsManager {
		return new ReceiptsManager(this.mapDb.deepCopy(), chain)
	}

	/**
	 * Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
	 * and removes tx hash indexes for one block past txLookupLimit.
	 * @param block the block to save receipts for
	 * @param receipts the receipts to save
	 */
	async saveReceipts(block: Block, receipts: TxReceipt[]) {
		const encoded = this.rlp(RlpConvert.Encode, RlpType.Receipts, receipts)
		await this.mapDb.put('Receipts', block.hash(), encoded)
		void this.updateIndex(IndexOperation.Save, IndexType.TxHash, block)
	}

	async deleteReceipts(block: Block) {
		await this.mapDb.delete('Receipts', block.hash())
		void this.updateIndex(IndexOperation.Delete, IndexType.TxHash, block)
	}

	/**
	 * Returns receipts for given blockHash
	 * @param blockHash the block hash
	 * @param calcBloom whether to calculate and return the logs bloom for each receipt (default: false)
	 * @param includeTxType whether to include the tx type for each receipt (default: false)
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
	 * Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found
	 * @param txHash the tx hash
	 */
	async getReceiptByTxHash(txHash: Uint8Array): Promise<GetReceiptByTxHashReturn | null> {
		const txHashIndex = await this.getIndex(IndexType.TxHash, txHash)
		if (!txHashIndex) return null
		const [blockHash, txIndex] = txHashIndex
		const receipts = await this.getReceipts(blockHash)
		if (receipts.length === 0) return null
		let logIndex = 0
		receipts.slice(0, txIndex).map((r) => {
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
	 * Returns logs as specified by the eth_getLogs JSON RPC query parameters
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
	 * Saves or deletes an index from the metaDB
	 * @param operation the {@link IndexOperation}
	 * @param type the {@link IndexType}
	 * @param value for {@link IndexType.TxHash}, the block to save or delete the tx hash indexes for
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
	 * Returns the value for an index or null if not found
	 * @param type the {@link IndexType}
	 * @param value for {@link IndexType.TxHash}, the txHash to get
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
	 * Rlp encodes or decodes the specified data type for storage or retrieval from the metaDB
	 * @param conversion {@link RlpConvert.Encode} or {@link RlpConvert.Decode}
	 * @param type one of {@link RlpType}
	 * @param value the value to encode or decode
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
	 * Returns the logs bloom for a receipt's logs
	 * @param logs
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
