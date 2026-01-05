/**
 * Native RPC type definitions for JSON-RPC schemas.
 * These types replace viem's RPC types for a more minimal dependency footprint.
 *
 * Migration status:
 * ✅ Basic types: Quantity, Index, Status, TransactionType
 * ✅ RpcBlock - Generic JSON-RPC block type
 * ✅ RpcTransaction - Generic JSON-RPC transaction type
 * ✅ RpcTransactionReceipt - Generic JSON-RPC transaction receipt type
 * ✅ RpcTransactionRequest - Generic JSON-RPC transaction request type
 * ✅ RpcBlockNumber, RpcBlockIdentifier - Block reference types
 * ✅ RpcStateOverride, RpcAccountStateOverride - State override types
 * ✅ RpcLog, RpcUncle - Ancillary types
 */

import type { Address, Hex } from './abitype.js'

/**
 * JSON-RPC index type (hex encoded).
 * Used for transaction indices, log indices, etc.
 */
export type Index = Hex

/**
 * JSON-RPC quantity type (hex encoded bigint).
 * Used for gas, value, nonce, block number, etc.
 */
export type Quantity = Hex

/**
 * JSON-RPC status type for transaction receipts.
 * '0x0' indicates failure, '0x1' indicates success.
 */
export type Status = '0x0' | '0x1'

/**
 * JSON-RPC transaction type.
 * '0x0' = Legacy, '0x1' = EIP-2930, '0x2' = EIP-1559, '0x3' = EIP-4844, '0x4' = EIP-7702
 */
export type TransactionType = '0x0' | '0x1' | '0x2' | '0x3' | '0x4' | (string & {})

/**
 * JSON-RPC block number reference.
 * Can be a hex-encoded number.
 */
export type RpcBlockNumber = Quantity

/**
 * JSON-RPC block identifier.
 * Can be a block number, block hash, or block tag.
 */
export type RpcBlockIdentifier =
	| { blockNumber: Quantity }
	| { blockHash: Hex; requireCanonical?: boolean | undefined }

/**
 * JSON-RPC authorization for EIP-7702 transactions.
 */
export type RpcAuthorization = {
	/** Address of the contract to set as code for the Authority. */
	address: Address
	/** Chain ID to authorize. */
	chainId: Hex
	/** Nonce of the Authority to authorize. */
	nonce: Hex
	/** ECDSA r value. */
	r: Hex
	/** ECDSA s value. */
	s: Hex
	/** y parity. */
	yParity: Hex
}

/**
 * JSON-RPC authorization list for EIP-7702 transactions.
 */
export type RpcAuthorizationList = readonly RpcAuthorization[]

/**
 * JSON-RPC access list item for EIP-2930/EIP-1559 transactions.
 */
export type RpcAccessListItem = {
	address: Address
	storageKeys: readonly Hex[]
}

/**
 * JSON-RPC access list for EIP-2930/EIP-1559 transactions.
 */
export type RpcAccessList = readonly RpcAccessListItem[]

/**
 * JSON-RPC log object returned from eth_getLogs, etc.
 */
export type RpcLog = {
	/** Address from which this log originated. */
	address: Address
	/** List of 0 to 4 32-byte topics. */
	topics: readonly Hex[]
	/** Log data. */
	data: Hex
	/** Block hash containing this log, or null if pending. */
	blockHash: Hex | null
	/** Block number containing this log, or null if pending. */
	blockNumber: Quantity | null
	/** Transaction hash that created this log. */
	transactionHash: Hex | null
	/** Transaction index position in the block, or null if pending. */
	transactionIndex: Index | null
	/** Log index position in the block, or null if pending. */
	logIndex: Index | null
	/** Whether log was removed due to chain reorganization. */
	removed: boolean
}

/**
 * JSON-RPC uncle (ommer) block header.
 */
export type RpcUncle = {
	/** Block hash. */
	hash: Hex
	/** Parent block hash. */
	parentHash: Hex
	/** Uncles hash (sha3Uncles). */
	sha3Uncles: Hex
	/** Miner/coinbase address. */
	miner: Address
	/** State root hash. */
	stateRoot: Hex
	/** Transactions root hash. */
	transactionsRoot: Hex
	/** Receipts root hash. */
	receiptsRoot: Hex
	/** Logs bloom filter. */
	logsBloom: Hex
	/** Difficulty value. */
	difficulty: Quantity
	/** Block number. */
	number: Quantity
	/** Gas limit. */
	gasLimit: Quantity
	/** Gas used. */
	gasUsed: Quantity
	/** Block timestamp. */
	timestamp: Quantity
	/** Extra data. */
	extraData: Hex
	/** Mix hash (proof-of-work). */
	mixHash: Hex
	/** Nonce (proof-of-work). */
	nonce: Hex
}

/**
 * JSON-RPC transaction object (generic covering all transaction types).
 */
export type RpcTransaction<pending extends boolean = boolean> = {
	/** Block hash containing this transaction, or null if pending. */
	blockHash: pending extends true ? null : Hex
	/** Block number containing this transaction, or null if pending. */
	blockNumber: pending extends true ? null : Quantity
	/** Transaction sender address. */
	from: Address
	/** Gas limit. */
	gas: Quantity
	/** Transaction hash. */
	hash: Hex
	/** Input data. */
	input: Hex
	/** Nonce. */
	nonce: Quantity
	/** Recipient address, or null for contract creation. */
	to: Address | null
	/** Transaction index in block, or null if pending. */
	transactionIndex: pending extends true ? null : Index
	/** Transaction value in wei. */
	value: Quantity
	/** ECDSA v value. */
	v: Quantity
	/** ECDSA r value. */
	r: Hex
	/** ECDSA s value. */
	s: Hex
	/** Transaction type. */
	type?: TransactionType
	/** Gas price (legacy/EIP-2930). */
	gasPrice?: Quantity
	/** Max fee per gas (EIP-1559+). */
	maxFeePerGas?: Quantity
	/** Max priority fee per gas (EIP-1559+). */
	maxPriorityFeePerGas?: Quantity
	/** Access list (EIP-2930+). */
	accessList?: RpcAccessList
	/** Chain ID. */
	chainId?: Quantity
	/** y parity for EIP-2930+ (alternative to v). */
	yParity?: Quantity
	/** Max fee per blob gas (EIP-4844). */
	maxFeePerBlobGas?: Quantity
	/** Blob versioned hashes (EIP-4844). */
	blobVersionedHashes?: readonly Hex[]
	/** Authorization list (EIP-7702). */
	authorizationList?: RpcAuthorizationList
}

/**
 * JSON-RPC block object.
 */
export type RpcBlock<
	includeTransactions extends boolean = boolean,
	transaction = RpcTransaction,
> = {
	/** Block hash, or null if pending. */
	hash: Hex | null
	/** Parent block hash. */
	parentHash: Hex
	/** Uncles hash (sha3Uncles). */
	sha3Uncles: Hex
	/** Miner/coinbase address. */
	miner: Address
	/** State root hash. */
	stateRoot: Hex
	/** Transactions root hash. */
	transactionsRoot: Hex
	/** Receipts root hash. */
	receiptsRoot: Hex
	/** Logs bloom filter. */
	logsBloom: Hex
	/** Difficulty value. */
	difficulty: Quantity
	/** Block number, or null if pending. */
	number: Quantity | null
	/** Gas limit. */
	gasLimit: Quantity
	/** Gas used. */
	gasUsed: Quantity
	/** Block timestamp. */
	timestamp: Quantity
	/** Extra data. */
	extraData: Hex
	/** Mix hash (proof-of-work). */
	mixHash: Hex
	/** Nonce (proof-of-work). */
	nonce: Hex
	/** Total difficulty. */
	totalDifficulty?: Quantity | null
	/** Base fee per gas (EIP-1559+). */
	baseFeePerGas?: Quantity | null
	/** Withdrawals root (post-Shanghai). */
	withdrawalsRoot?: Hex
	/** Withdrawals (post-Shanghai). */
	withdrawals?: readonly RpcWithdrawal[]
	/** Blob gas used (EIP-4844). */
	blobGasUsed?: Quantity
	/** Excess blob gas (EIP-4844). */
	excessBlobGas?: Quantity
	/** Parent beacon block root (EIP-4788). */
	parentBeaconBlockRoot?: Hex
	/** Size of block in bytes. */
	size: Quantity
	/** List of transaction hashes or full transaction objects. */
	transactions: includeTransactions extends true ? transaction[] : Hex[]
	/** List of uncle hashes. */
	uncles: readonly Hex[]
}

/**
 * JSON-RPC withdrawal object (post-Shanghai).
 */
export type RpcWithdrawal = {
	/** Withdrawal index. */
	index: Quantity
	/** Validator index. */
	validatorIndex: Quantity
	/** Withdrawal address. */
	address: Address
	/** Withdrawal amount in gwei. */
	amount: Quantity
}

/**
 * JSON-RPC transaction receipt object.
 */
export type RpcTransactionReceipt = {
	/** Block hash containing this transaction. */
	blockHash: Hex
	/** Block number containing this transaction. */
	blockNumber: Quantity
	/** Contract address created, or null if not a contract creation. */
	contractAddress: Address | null
	/** Cumulative gas used in the block up to this transaction. */
	cumulativeGasUsed: Quantity
	/** Actual gas used by this transaction. */
	effectiveGasPrice: Quantity
	/** Transaction sender address. */
	from: Address
	/** Gas used by this transaction. */
	gasUsed: Quantity
	/** Logs emitted by this transaction. */
	logs: readonly RpcLog[]
	/** Logs bloom filter. */
	logsBloom: Hex
	/** Transaction status. */
	status: Status
	/** Recipient address, or null for contract creation. */
	to: Address | null
	/** Transaction hash. */
	transactionHash: Hex
	/** Transaction index in block. */
	transactionIndex: Index
	/** Transaction type. */
	type: TransactionType
	/** Blob gas used (EIP-4844). */
	blobGasUsed?: Quantity
	/** Blob gas price (EIP-4844). */
	blobGasPrice?: Quantity
	/** State root (pre-Byzantium). */
	root?: Hex
}

/**
 * JSON-RPC transaction request object.
 */
export type RpcTransactionRequest = {
	/** Transaction sender address. */
	from: Address
	/** Recipient address, or null/omitted for contract creation. */
	to?: Address | null
	/** Gas limit. */
	gas?: Quantity
	/** Gas price (legacy). */
	gasPrice?: Quantity
	/** Max fee per gas (EIP-1559+). */
	maxFeePerGas?: Quantity
	/** Max priority fee per gas (EIP-1559+). */
	maxPriorityFeePerGas?: Quantity
	/** Value in wei. */
	value?: Quantity
	/** Input data. */
	data?: Hex
	/** Nonce. */
	nonce?: Quantity
	/** Transaction type. */
	type?: TransactionType
	/** Access list (EIP-2930+). */
	accessList?: RpcAccessList
	/** Chain ID. */
	chainId?: Quantity
	/** Max fee per blob gas (EIP-4844). */
	maxFeePerBlobGas?: Quantity
	/** Blob versioned hashes (EIP-4844). */
	blobVersionedHashes?: readonly Hex[]
	/** Blobs (EIP-4844). */
	blobs?: readonly Hex[]
	/** Authorization list (EIP-7702). */
	authorizationList?: RpcAuthorizationList
}

/**
 * A key-value mapping of slot and storage values (hex encoded).
 */
export type RpcStateMapping = {
	[slots: Hex]: Hex
}

/**
 * JSON-RPC account state override for eth_call, etc.
 */
export type RpcAccountStateOverride = {
	/** Fake balance to set for the account. */
	balance?: Hex
	/** Fake nonce to set for the account. */
	nonce?: Hex
	/** Fake EVM bytecode to inject into the account. */
	code?: Hex
	/** Fake key-value mapping to override all slots in the account storage. */
	state?: RpcStateMapping
	/** Fake key-value mapping to override individual slots in the account storage. */
	stateDiff?: RpcStateMapping
}

/**
 * JSON-RPC state override object (address -> account state override).
 */
export type RpcStateOverride = {
	[address: Address]: RpcAccountStateOverride
}

/**
 * JSON-RPC fee history object (from eth_feeHistory).
 */
export type RpcFeeHistory = {
	/** Oldest block in the returned range. */
	oldestBlock: Quantity
	/** Base fee per gas for each block. */
	baseFeePerGas: readonly Quantity[]
	/** Gas used ratio (0 to 1) for each block. */
	gasUsedRatio: readonly number[]
	/** Effective priority fee per gas at requested percentiles for each block. */
	reward?: readonly (readonly Quantity[])[]
	/** Blob base fee per gas for each block (EIP-4844). */
	blobBaseFeePerGas?: readonly Quantity[]
	/** Blob gas used ratio for each block (EIP-4844). */
	blobGasUsedRatio?: readonly number[]
}

/**
 * JSON-RPC proof storage entry.
 */
export type RpcStorageProof = {
	/** Storage slot key. */
	key: Hex
	/** Storage value. */
	value: Quantity
	/** Merkle proof for the storage slot. */
	proof: readonly Hex[]
}

/**
 * JSON-RPC account proof object (from eth_getProof).
 */
export type RpcProof = {
	/** Account address. */
	address: Address
	/** Account balance. */
	balance: Quantity
	/** Account code hash. */
	codeHash: Hex
	/** Account nonce. */
	nonce: Quantity
	/** Account storage root. */
	storageHash: Hex
	/** Merkle proof for the account. */
	accountProof: readonly Hex[]
	/** Storage proofs for requested slots. */
	storageProof: readonly RpcStorageProof[]
}
