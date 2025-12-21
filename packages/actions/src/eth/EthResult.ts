/***
 * TODO I didn't update any of these jsdocs
 * TODO some of these types are not deserialized and/or don't match viem types and will
 * need to be updated as t hey are implemented
 */
import type { BlockResult } from '../common/BlockResult.js'
import type { FilterLog } from '../common/FilterLog.js'
import type { Address, Hex } from '../common/index.js'
import type { TransactionReceiptResult } from '../common/TransactionReceiptResult.js'
import type { TransactionResult } from '../common/TransactionResult.js'

// eth_account
export type EthAccountsResult = Array<Address>
// eth_blockNumber
/**
 * JSON-RPC response for `eth_blockNumber` procedure
 */
export type EthBlockNumberResult = bigint

// eth_call
/**
 * JSON-RPC response for `eth_call` procedure
 */
export type EthCallResult = Hex

// eth_chainId
/**
 * JSON-RPC response for `eth_chainId` procedure
 */
export type EthChainIdResult = bigint

// eth_coinbase
/**
 * JSON-RPC response for `eth_coinbase` procedure
 */
export type EthCoinbaseResult = Address

// eth_estimateGas
/**
 * JSON-RPC response for `eth_estimateGas` procedure
 */
export type EthEstimateGasResult = bigint

// eth_hashrate
/**
 * JSON-RPC response for `eth_hashrate` procedure
 */
export type EthHashrateResult = Hex

// eth_gasPrice
/**
 * JSON-RPC response for `eth_gasPrice` procedure
 */
export type EthGasPriceResult = bigint

// eth_maxPriorityFeePerGas
/**
 * JSON-RPC response for `eth_maxPriorityFeePerGas` procedure
 */
export type EthMaxPriorityFeePerGasResult = bigint

// eth_feeHistory
/**
 * JSON-RPC response for `eth_feeHistory` procedure
 */
export type EthFeeHistoryResult = {
	/**
	 * Lowest number block of the returned range.
	 */
	oldestBlock: bigint
	/**
	 * An array of block base fees per gas. This includes the next block after
	 * the newest of the returned range, because this value can be derived from
	 * the newest block. Zeroes are returned for pre-EIP-1559 blocks.
	 */
	baseFeePerGas: bigint[]
	/**
	 * An array of block gas used ratios. These are calculated as the ratio
	 * of gasUsed and gasLimit.
	 */
	gasUsedRatio: number[]
	/**
	 * An array of effective priority fee per gas data points from a single
	 * block. All zeroes are returned if the block is empty.
	 */
	reward?: bigint[][]
}

// eth_getBalance
/**
 * JSON-RPC response for `eth_getBalance` procedure
 */
export type EthGetBalanceResult = bigint

// eth_getBlockByHash
/**
 * JSON-RPC response for `eth_getBlockByHash` procedure
 */
export type EthGetBlockByHashResult = BlockResult

// eth_getBlockByNumber
/**
 * JSON-RPC response for `eth_getBlockByNumber` procedure
 */
export type EthGetBlockByNumberResult = BlockResult
// eth_getBlockTransactionCountByHash
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByHash` procedure
 */
export type EthGetBlockTransactionCountByHashResult = Hex

// eth_getBlockTransactionCountByNumber
/**
 * JSON-RPC response for `eth_getBlockTransactionCountByNumber` procedure
 */
export type EthGetBlockTransactionCountByNumberResult = Hex

// eth_getCode
/**
 * JSON-RPC response for `eth_getCode` procedure
 */
export type EthGetCodeResult = Hex

// eth_getFilterChanges
/**
 * JSON-RPC response for `eth_getFilterChanges` procedure
 */
export type EthGetFilterChangesResult = Array<FilterLog>

// eth_getFilterLogs
/**
 * JSON-RPC response for `eth_getFilterLogs` procedure
 */
export type EthGetFilterLogsResult = Array<FilterLog>

// eth_getLogs
/**
 * JSON-RPC response for `eth_getLogs` procedure
 */
export type EthGetLogsResult = Array<FilterLog>

// eth_getStorageAt
/**
 * JSON-RPC response for `eth_getStorageAt` procedure
 */
export type EthGetStorageAtResult = Hex

// eth_getTransactionCount
/**
 * JSON-RPC response for `eth_getTransactionCount` procedure
 */
export type EthGetTransactionCountResult = Hex

// eth_getUncleCountByBlockHash
/**
 * JSON-RPC response for `eth_getUncleCountByBlockHash` procedure
 */
export type EthGetUncleCountByBlockHashResult = Hex

// eth_getUncleCountByBlockNumber
/**
 * JSON-RPC response for `eth_getUncleCountByBlockNumber` procedure
 */
export type EthGetUncleCountByBlockNumberResult = Hex

// eth_getTransactionByHash
/**
 * JSON-RPC response for `eth_getTransactionByHash` procedure
 */
export type EthGetTransactionByHashResult = TransactionResult

// eth_getTransactionByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockHashAndIndex` procedure
 */
export type EthGetTransactionByBlockHashAndIndexResult = TransactionResult

// eth_getTransactionByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getTransactionByBlockNumberAndIndex` procedure
 */
export type EthGetTransactionByBlockNumberAndIndexResult = TransactionResult

// eth_getTransactionReceipt
/**
 * JSON-RPC response for `eth_getTransactionReceipt` procedure
 */
export type EthGetTransactionReceiptResult = TransactionReceiptResult | null

// eth_getBlockReceipts
/**
 * JSON-RPC response for `eth_getBlockReceipts` procedure
 * Returns an array of all transaction receipts for the specified block
 */
export type EthGetBlockReceiptsResult = TransactionReceiptResult[] | null

// eth_getUncleByBlockHashAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockHashAndIndex` procedure
 */
export type EthGetUncleByBlockHashAndIndexResult = Hex

// eth_getUncleByBlockNumberAndIndex
/**
 * JSON-RPC response for `eth_getUncleByBlockNumberAndIndex` procedure
 */
export type EthGetUncleByBlockNumberAndIndexResult = Hex

// eth_mining
/**
 * JSON-RPC response for `eth_mining` procedure
 */
export type EthMiningResult = boolean

// eth_protocolVersion
/**
 * JSON-RPC response for `eth_protocolVersion` procedure
 */
export type EthProtocolVersionResult = Hex

// eth_sendRawTransaction
/**
 * JSON-RPC response for `eth_sendRawTransaction` procedure
 */
export type EthSendRawTransactionResult = Hex

// eth_sendTransaction
/**
 * JSON-RPC response for `eth_sendTransaction` procedure
 */
export type EthSendTransactionResult = Hex

// eth_sign
/**
 * JSON-RPC response for `eth_sign` procedure
 */
export type EthSignResult = Hex

// eth_signTransaction
/**
 * JSON-RPC response for `eth_signTransaction` procedure
 */
export type EthSignTransactionResult = Hex

// eth_syncing
/**
 * JSON-RPC response for `eth_syncing` procedure
 */
export type EthSyncingResult =
	| boolean
	| {
			startingBlock: Hex
			currentBlock: Hex
			highestBlock: Hex
			// some clients return these
			// geth
			headedBytecodebytes?: Hex
			healedBytecodes?: Hex
			healedTrienodes?: Hex
			healingBytecode?: Hex
			healingTrienodes?: Hex
			syncedBytecodeBytes?: Hex
			syncedBytecodes?: Hex
			syncedStorage?: Hex
			syncedStorageBytes?: Hex
			// besu
			pulledStates: Hex
			knownStates: Hex
	  }

// eth_newFilter
/**
 * JSON-RPC response for `eth_newFilter` procedure
 */
export type EthNewFilterResult = Hex

// eth_newBlockFilter
/**
 * JSON-RPC response for `eth_newBlockFilter` procedure
 */
export type EthNewBlockFilterResult = Hex

// eth_newPendingTransactionFilter
/**
 * JSON-RPC response for `eth_newPendingTransactionFilter` procedure
 */
export type EthNewPendingTransactionFilterResult = Hex

// eth_uninstallFilter
/**
 * JSON-RPC response for `eth_uninstallFilter` procedure
 */
export type EthUninstallFilterResult = boolean

// eth_subscribe
/**
 * JSON-RPC response for `eth_subscribe` procedure
 * Returns a subscription ID
 */
export type EthSubscribeResult = Hex

// eth_unsubscribe
/**
 * JSON-RPC response for `eth_unsubscribe` procedure
 * Returns true if the subscription was successfully cancelled, false otherwise
 */
export type EthUnsubscribeResult = boolean

// eth_getProof
/**
 * Storage proof for a single storage slot
 */
export type StorageProof = {
	/**
	 * The key of the storage slot
	 */
	key: Hex
	/**
	 * The value of the storage slot
	 */
	value: Hex
	/**
	 * The merkle proof for this storage slot
	 */
	proof: Hex[]
}

/**
 * JSON-RPC response for `eth_getProof` procedure (EIP-1186)
 * Returns the account and storage values of the specified account including the Merkle-proof.
 */
export type EthGetProofResult = {
	/**
	 * The address of the account
	 */
	address: Address
	/**
	 * The account proof (array of RLP-serialized merkle trie nodes)
	 */
	accountProof: Hex[]
	/**
	 * The balance of the account
	 */
	balance: Hex
	/**
	 * The code hash of the account
	 */
	codeHash: Hex
	/**
	 * The nonce of the account
	 */
	nonce: Hex
	/**
	 * The storage hash (root of the storage trie)
	 */
	storageHash: Hex
	/**
	 * Array of storage proofs for the requested keys
	 */
	storageProof: StorageProof[]
}

// eth_simulateV1
/**
 * Error information for a simulated call
 */
export type SimulateCallError = {
	/**
	 * Error code
	 */
	code: number
	/**
	 * Error message
	 */
	message: string
	/**
	 * Optional data (e.g., revert reason)
	 */
	data?: Hex
}

/**
 * Result of a single simulated call
 */
export type EthSimulateV1CallResult = {
	/**
	 * The return data from the call
	 */
	returnData: Hex
	/**
	 * Logs emitted during the call execution
	 */
	logs: FilterLog[]
	/**
	 * Gas used by the call
	 */
	gasUsed: bigint
	/**
	 * Status of the call (1 = success, 0 = failure)
	 */
	status: bigint
	/**
	 * Error information if the call failed
	 */
	error?: SimulateCallError
}

/**
 * Result of a simulated block containing multiple call results
 */
export type EthSimulateV1BlockResult = {
	/**
	 * The block number
	 */
	number: bigint
	/**
	 * The block hash
	 */
	hash: Hex
	/**
	 * The timestamp of the block
	 */
	timestamp: bigint
	/**
	 * The gas limit of the block
	 */
	gasLimit: bigint
	/**
	 * The gas used in the block
	 */
	gasUsed: bigint
	/**
	 * The base fee per gas for the block
	 */
	baseFeePerGas?: bigint
	/**
	 * Results of the simulated calls in this block
	 */
	calls: EthSimulateV1CallResult[]
}

/**
 * JSON-RPC response for `eth_simulateV1` procedure
 * Returns an array of block results, each containing call results
 */
export type EthSimulateV1Result = EthSimulateV1BlockResult[]

// eth_simulateV2
/**
 * A single call trace step for V2 debugging
 */
export type CallTraceStep = {
	/**
	 * The opcode executed
	 */
	op: string
	/**
	 * The program counter
	 */
	pc: number
	/**
	 * The gas remaining
	 */
	gas: bigint
	/**
	 * The gas cost of this operation
	 */
	gasCost: bigint
	/**
	 * The current depth of the call stack
	 */
	depth: number
	/**
	 * The stack contents (top items)
	 */
	stack?: Hex[]
	/**
	 * The memory contents (if requested)
	 */
	memory?: Hex
}

/**
 * A contract creation event for V2
 */
export type ContractCreationEvent = {
	/**
	 * The address of the newly created contract
	 */
	address: Address
	/**
	 * The address of the creator
	 */
	creator: Address
	/**
	 * The code deployed to the contract
	 */
	code: Hex
}

/**
 * Call trace for V2 debugging
 */
export type CallTrace = {
	/**
	 * The type of call (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2)
	 */
	type: string
	/**
	 * The sender address
	 */
	from: Address
	/**
	 * The recipient address (or created contract address)
	 */
	to?: Address
	/**
	 * The value transferred
	 */
	value?: bigint
	/**
	 * The gas provided
	 */
	gas: bigint
	/**
	 * The gas used
	 */
	gasUsed: bigint
	/**
	 * The input data
	 */
	input: Hex
	/**
	 * The output/return data
	 */
	output: Hex
	/**
	 * Error message if the call failed
	 */
	error?: string
	/**
	 * Sub-calls made during this call
	 */
	calls?: CallTrace[]
}

/**
 * Result of a single simulated call (V2)
 * Extends V1 with additional debugging information
 */
export type EthSimulateV2CallResult = EthSimulateV1CallResult & {
	/**
	 * Contract creation events if a contract was deployed
	 * V2 feature: provides visibility into contract deployments
	 */
	contractCreated?: ContractCreationEvent
	/**
	 * Estimated gas if gas estimation was requested
	 * V2 feature: accurate gas estimation
	 */
	estimatedGas?: bigint
	/**
	 * Call trace for debugging
	 * V2 feature: detailed execution trace
	 */
	trace?: CallTrace
}

/**
 * Result of a simulated block containing multiple call results (V2)
 * Extends V1 with streamlined output
 */
export type EthSimulateV2BlockResult = {
	/**
	 * The block number
	 */
	number: bigint
	/**
	 * The block hash
	 */
	hash: Hex
	/**
	 * The timestamp of the block
	 */
	timestamp: bigint
	/**
	 * The gas limit of the block
	 */
	gasLimit: bigint
	/**
	 * The gas used in the block
	 */
	gasUsed: bigint
	/**
	 * The base fee per gas for the block
	 */
	baseFeePerGas?: bigint
	/**
	 * The fee recipient (coinbase)
	 */
	feeRecipient?: Address
	/**
	 * Results of the simulated calls in this block
	 */
	calls: EthSimulateV2CallResult[]
}

/**
 * JSON-RPC response for `eth_simulateV2` procedure
 * Returns an array of block results with enhanced debugging information
 */
export type EthSimulateV2Result = EthSimulateV2BlockResult[]
