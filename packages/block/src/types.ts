import type { Common } from '@tevm/common'
import type { JsonRpcTx, JsonTx, TransactionType, TxData } from '@tevm/tx'
import type { AddressLike, BigIntLike, BytesLike, Hex, JsonRpcWithdrawal, WithdrawalData } from '@tevm/utils'
import type { ClRequest } from './ClRequest.js'
import type { BlockHeader } from './header.js'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a {@link Common} object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
	/**
	 * A {@link Common} object defining the chain and the hardfork a block/block header belongs to.
	 *
	 * Object will be internally copied so that tx behavior don't incidentally
	 * change on future HF changes.
	 *
	 * Default: {@link Common} object set to `mainnet` and the HF currently defined as the default
	 * hardfork in the {@link Common} class.
	 *
	 * Current default hardfork: `merge`
	 */
	common: Common
	/**
	 * Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
	 * for older Hfs.
	 *
	 * Additionally it is possible to pass in a specific TD value to support live-Merge-HF
	 * transitions. Note that this should only be needed in very rare and specific scenarios.
	 *
	 * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
	 */
	setHardfork?: boolean | BigIntLike
	/**
	 * If a preceding {@link BlockHeader} (usually the parent header) is given the preceding
	 * header will be used to calculate the difficulty for this block and the calculated
	 * difficulty takes precedence over a provided static `difficulty` value.
	 *
	 * Note that this option has no effect on networks other than PoW/Ethash networks
	 * (respectively also deactivates on the Merge HF switching to PoS/Casper).
	 */
	calcDifficultyFromHeader?: BlockHeader
	/**
	 * A block object by default gets frozen along initialization. This gives you
	 * strong additional security guarantees on the consistency of the block parameters.
	 * It also enables block hash caching when the `hash()` method is called multiple times.
	 *
	 * If you need to deactivate the block freeze - e.g. because you want to subclass block and
	 * add additional properties - it is strongly encouraged that you do the freeze yourself
	 * within your code instead.
	 *
	 * Default: true
	 */
	freeze?: boolean
	/**
	 * Provide a clique signer's privateKey to seal this block.
	 * Will throw if provided on a non-PoA chain.
	 */
	cliqueSigner?: Uint8Array
	/**
	 *  Skip consensus format validation checks on header if set. Defaults to false.
	 */
	skipConsensusFormatValidation?: boolean

	executionWitness?: VerkleExecutionWitness
}

/**
 * Represents a Verkle proof used for state verification
 *
 * Verkle trees are an upgrade to Merkle Patricia trees that use vector commitments
 * instead of hash-based commitments, resulting in smaller proof sizes.
 * This interface contains the elements needed for Verkle proof verification.
 *
 * @see https://eips.ethereum.org/EIPS/eip-6800 for more details on Verkle trees in Ethereum
 *
 * @example
 * ```typescript
 * import { VerkleProof } from '@tevm/block'
 *
 * // Example of verifying a Verkle proof
 * function verifyProof(proof: VerkleProof, key: Hex, value: Hex, commitment: Hex): boolean {
 *   // Verkle proof verification implementation would go here
 *   return true
 * }
 * ```
 */
export interface VerkleProof {
	commitmentsByPath: Hex[]
	d: Hex
	depthExtensionPresent: Hex
	ipaProof: {
		cl: Hex[]
		cr: Hex[]
		finalEvaluation: Hex
	}
	otherStems: Hex[]
}

/**
 * Represents the state differences in a Verkle tree between two states
 *
 * Used to describe state changes between blocks in a more efficient way than
 * recording the entire state. Contains a mapping of stems (path prefixes) to
 * their corresponding state changes, along with proofs to verify these changes.
 *
 * Part of Ethereum's statelessness roadmap, enabling clients to validate blocks
 * without storing the entire state.
 *
 * @example
 * ```typescript
 * import { VerkleStateDiff } from '@tevm/block'
 *
 * // Example of applying state changes from a diff
 * function applyStateDiff(currentState: Map<string, Hex>, diff: VerkleStateDiff): Map<string, Hex> {
 *   const updatedState = new Map(currentState)
 *
 *   // Apply each change from the state diff
 *   for (const [stem, changes] of Object.entries(diff.stateDiff)) {
 *     for (const [key, value] of Object.entries(changes)) {
 *       const fullKey = stem + key
 *       if (value === null) {
 *         updatedState.delete(fullKey)
 *       } else {
 *         updatedState.set(fullKey, value)
 *       }
 *     }
 *   }
 *
 *   return updatedState
 * }
 * ```
 */
export interface VerkleStateDiff {
	stem: Hex
	suffixDiffs: {
		currentValue: Hex | null
		newValue: Hex | null
		suffix: number | string
	}[]
}

/**
 * Experimental, object format could eventual change.
 * An object that provides the state and proof necessary for verkle stateless execution
 * */
export interface VerkleExecutionWitness {
	/**
	 * An array of state diffs.
	 * Each item corresponding to state accesses or state modifications of the block.
	 * In the current design, it also contains the resulting state of the block execution (post-state).
	 */
	stateDiff: VerkleStateDiff[]
	/**
	 * The verkle proof for the block.
	 * Proves that the provided stateDiff belongs to the canonical verkle tree.
	 */
	verkleProof: VerkleProof
}

/**
 * A block header's data.
 */
// TODO: Deprecate the string type and only keep BytesLike/AddressLike/BigIntLike
export interface HeaderData {
	parentHash?: BytesLike | string
	uncleHash?: BytesLike | string
	coinbase?: AddressLike | string
	stateRoot?: BytesLike | string
	transactionsTrie?: BytesLike | string
	receiptTrie?: BytesLike | string
	logsBloom?: BytesLike | string
	difficulty?: BigIntLike | string
	number?: BigIntLike | string
	gasLimit?: BigIntLike | string
	gasUsed?: BigIntLike | string
	timestamp?: BigIntLike | string
	extraData?: BytesLike | string
	mixHash?: BytesLike | string
	nonce?: BytesLike | string
	baseFeePerGas?: BigIntLike | string
	withdrawalsRoot?: BytesLike | string
	blobGasUsed?: BigIntLike | string
	excessBlobGas?: BigIntLike | string
	parentBeaconBlockRoot?: BytesLike | string
	requestsRoot?: BytesLike | string
}

/**
 * A block's data.
 */
export interface BlockData {
	/**
	 * Header data for the block
	 */
	header?: HeaderData
	transactions?: Array<TxData[TransactionType]>
	uncleHeaders?: Array<HeaderData>
	withdrawals?: Array<WithdrawalData>
	requests?: Array<ClRequest>
	/**
	 * EIP-6800: Verkle Proof Data (experimental)
	 */
	executionWitness?: VerkleExecutionWitness | null
}

/**
 * Represents the raw byte representation of Ethereum withdrawal objects
 *
 * Each element in the array is a serialized withdrawal object from the Beacon chain.
 * Used in post-merge Ethereum as part of the engine API and block structure for
 * processing withdrawals from the consensus layer to the execution layer.
 *
 * @example
 * ```typescript
 * import { WithdrawalsBytes } from '@tevm/block'
 *
 * // Decode withdrawals from their byte representation
 * function decodeWithdrawals(withdrawalBytes: WithdrawalsBytes): WithdrawalV1[] {
 *   return withdrawalBytes.map(bytes => {
 *     // Implement decoding logic to extract withdrawal data
 *     return {
 *       index: getUint64FromBytes(bytes, 0),
 *       validatorIndex: getUint64FromBytes(bytes, 8),
 *       address: getAddressFromBytes(bytes, 16),
 *       amount: getUint64FromBytes(bytes, 48)
 *     }
 *   })
 * }
 * ```
 */
export type WithdrawalsBytes = Uint8Array[]
/**
 * Represents serialized consensus layer requests in byte format
 *
 * Used in the Cancun upgrade (EIP-4788) for including consensus layer data
 * in execution layer blocks. Each element in the array is a serialized request
 * with data from the consensus layer.
 *
 * @see https://eips.ethereum.org/EIPS/eip-4788 for more details
 *
 * @example
 * ```typescript
 * import { RequestsBytes } from '@tevm/block'
 *
 * // Process consensus layer requests from their byte representation
 * function processRequests(requestsBytes: RequestsBytes): void {
 *   for (const requestBytes of requestsBytes) {
 *     // Parse request data
 *     const parentBeaconBlockRoot = requestBytes.slice(0, 32)
 *
 *     // Process the consensus layer request
 *     storeBeaconBlockRoot(parentBeaconBlockRoot)
 *   }
 * }
 * ```
 */
export type RequestsBytes = Uint8Array[]
/**
 * Represents the serialized form of execution witness data
 *
 * Used in stateless Ethereum to provide witnesses (proofs) needed for
 * transaction execution without requiring the full state. Contains
 * Verkle proofs and state differences needed to validate state transitions.
 *
 * Part of Ethereum's roadmap towards statelessness with Verkle trees.
 *
 * @example
 * ```typescript
 * import { ExecutionWitnessBytes, VerkleExecutionWitness } from '@tevm/block'
 * import { decode } from '@tevm/rlp'
 *
 * // Decode execution witness from its serialized form
 * function decodeWitness(witnessBytes: ExecutionWitnessBytes): VerkleExecutionWitness {
 *   const decoded = decode(witnessBytes) as unknown[]
 *
 *   // Extract the witness components (simplified example)
 *   return {
 *     stateDiff: deserializeStateDiffs(decoded[0]),
 *     verkleProof: deserializeVerkleProof(decoded[1])
 *   }
 * }
 * ```
 */
export type ExecutionWitnessBytes = Uint8Array

/**
 * Represents the serialized form of an Ethereum block
 *
 * The structure is a tuple of components, with variations depending on the Ethereum hardfork:
 * - First element: Block header bytes
 * - Second element: Transactions bytes
 * - Third element: Uncle headers bytes
 * - Fourth element (optional): Withdrawals bytes (post-Shanghai)
 * - Fifth element (optional): Requests bytes (post-Cancun)
 * - Sixth element (optional): Execution witness bytes (for stateless Ethereum)
 *
 * The format evolves with new Ethereum upgrades as additional block components are added.
 *
 * @example
 * ```typescript
 * import { BlockBytes, Block } from '@tevm/block'
 * import { decode } from '@tevm/rlp'
 *
 * // Decode a complete block from its serialized form
 * function decodeBlock(blockBytes: BlockBytes): Block {
 *   // Determine format based on array length
 *   if (blockBytes.length === 3) {
 *     // Pre-Shanghai format
 *     const [headerBytes, txBytes, uncleBytes] = blockBytes
 *     return {
 *       header: decodeHeader(headerBytes),
 *       transactions: decodeTxs(txBytes),
 *       uncleHeaders: decodeUncles(uncleBytes),
 *     }
 *   } else if (blockBytes.length === 4) {
 *     // Post-Shanghai format with withdrawals
 *     const [headerBytes, txBytes, uncleBytes, withdrawalBytes] = blockBytes
 *     return {
 *       header: decodeHeader(headerBytes),
 *       transactions: decodeTxs(txBytes),
 *       uncleHeaders: decodeUncles(uncleBytes),
 *       withdrawals: decodeWithdrawals(withdrawalBytes),
 *     }
 *   }
 *   // Handle other formats as needed
 * }
 * ```
 */
export type BlockBytes =
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes, RequestsBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes, RequestsBytes, ExecutionWitnessBytes]

/**
 * BlockHeaderBuffer is a Buffer array, except for the Verkle PreState which is an array of prestate arrays.
 */
export type BlockHeaderBytes = Uint8Array[]
/**
 * Represents the serialized form of an Ethereum block body
 *
 * Contains all block components except the header. The structure is:
 * - First element: Transactions bytes
 * - Second element: Uncle headers bytes
 * - Third element (optional): Withdrawals bytes (post-Shanghai)
 * - Fourth element (optional): Additional data (like consensus layer requests)
 *
 * Used when transmitting or processing block bodies separately from headers,
 * typically in Ethereum's P2P protocols.
 *
 * @example
 * ```typescript
 * import { BlockBodyBytes, BlockBody } from '@tevm/block'
 *
 * // Decode a block body
 * function decodeBlockBody(bodyBytes: BlockBodyBytes): BlockBody {
 *   const [txBytes, uncleBytes, withdrawalBytes] = bodyBytes
 *
 *   return {
 *     transactions: decodeTxs(txBytes),
 *     uncleHeaders: decodeUncles(uncleBytes),
 *     ...(withdrawalBytes ? { withdrawals: decodeWithdrawals(withdrawalBytes) } : {})
 *   }
 * }
 *
 * // For network transmission
 * function getBlockBody(block: Block): BlockBodyBytes {
 *   const body: BlockBodyBytes = [
 *     encodeTxs(block.transactions),
 *     encodeUncles(block.uncleHeaders)
 *   ]
 *
 *   if (block.withdrawals) {
 *     body.push(encodeWithdrawals(block.withdrawals))
 *   }
 *
 *   return body
 * }
 * ```
 */
export type BlockBodyBytes = [TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes?, Uint8Array?]
/**
 * TransactionsBytes can be an array of serialized txs for Typed Transactions or an array of Uint8Array Arrays for legacy transactions.
 */
export type TransactionsBytes = Uint8Array[][] | Uint8Array[]
/**
 * Represents serialized uncle (ommer) block headers
 *
 * Uncle blocks are valid blocks that weren't included in the main chain.
 * In Ethereum's PoW era, miners would include references to these blocks
 * and receive a partial reward. Each element is a serialized block header.
 *
 * While uncles are not relevant in post-merge Ethereum (PoS), the data
 * structure remains for backward compatibility.
 *
 * @example
 * ```typescript
 * import { UncleHeadersBytes, BlockHeader } from '@tevm/block'
 *
 * // Decode uncle headers from their serialized form
 * function decodeUncleHeaders(uncleBytes: UncleHeadersBytes): BlockHeader[] {
 *   return uncleBytes.map(headerBytes => {
 *     // Process each uncle header using the same header decoding logic
 *     return decodeBlockHeader(headerBytes)
 *   })
 * }
 *
 * // Check if a block has uncles
 * function hasUncles(uncleBytes: UncleHeadersBytes): boolean {
 *   return uncleBytes.length > 0
 * }
 * ```
 */
export type UncleHeadersBytes = Uint8Array[][]

/**
 * An object with the block's data represented as strings.
 */
export interface JsonBlock {
	/**
	 * Header data for the block
	 */
	header?: JsonHeader
	transactions?: JsonTx[]
	uncleHeaders?: JsonHeader[]
	withdrawals?: JsonRpcWithdrawal[]
	requests?: Hex[] | null
	executionWitness?: VerkleExecutionWitness | null
}

/**
 * An object with the block header's data represented as 0x-prefixed hex strings.
 */
// TODO: Remove the string type and only keep Hex
export interface JsonHeader {
	parentHash?: Hex | string
	uncleHash?: Hex | string
	coinbase?: Hex | string
	stateRoot?: Hex | string
	transactionsTrie?: Hex | string
	receiptTrie?: Hex | string
	logsBloom?: Hex | string
	difficulty?: Hex | string
	number?: Hex | string
	gasLimit?: Hex | string
	gasUsed?: Hex | string
	timestamp?: Hex | string
	extraData?: Hex | string
	mixHash?: Hex | string
	nonce?: Hex | string
	baseFeePerGas?: Hex | string
	withdrawalsRoot?: Hex | string
	blobGasUsed?: Hex | string
	excessBlobGas?: Hex | string
	parentBeaconBlockRoot?: Hex | string
	requestsRoot?: Hex | string
}

/*
 * Based on https://ethereum.org/en/developers/docs/apis/json-rpc/
 */
// TODO: Remove the string type and only keep Hex
export interface JsonRpcBlock {
	number: Hex | string // the block number. null when pending block.
	hash: Hex | string // hash of the block. null when pending block.
	parentHash: Hex | string // hash of the parent block.
	mixHash?: Hex | string // bit hash which proves combined with the nonce that a sufficient amount of computation has been carried out on this block.
	nonce: Hex | string // hash of the generated proof-of-work. null when pending block.
	sha3Uncles: Hex | string // SHA3 of the uncles data in the block.
	logsBloom: Hex | string // the bloom filter for the logs of the block. null when pending block.
	transactionsRoot: Hex | string // the root of the transaction trie of the block.
	stateRoot: Hex | string // the root of the final state trie of the block.
	receiptsRoot: Hex | string // the root of the receipts trie of the block.
	miner: Hex | string // the address of the beneficiary to whom the mining rewards were given.
	difficulty: Hex | string // integer of the difficulty for this block.
	totalDifficulty: Hex | string // integer of the total difficulty of the chain until this block.
	extraData: Hex | string // the “extra data” field of this block.
	size: Hex | string // integer the size of this block in bytes.
	gasLimit: Hex | string // the maximum gas allowed in this block.
	gasUsed: Hex | string // the total used gas by all transactions in this block.
	timestamp: Hex | string // the unix timestamp for when the block was collated.
	transactions: Array<JsonRpcTx | Hex | string> // Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
	uncles: Hex[] | string[] // Array of uncle hashes
	baseFeePerGas?: Hex | string // If EIP-1559 is enabled for this block, returns the base fee per gas
	withdrawals?: Array<JsonRpcWithdrawal> // If EIP-4895 is enabled for this block, array of withdrawals
	withdrawalsRoot?: Hex | string // If EIP-4895 is enabled for this block, the root of the withdrawal trie of the block.
	blobGasUsed?: Hex | string // If EIP-4844 is enabled for this block, returns the blob gas used for the block
	excessBlobGas?: Hex | string // If EIP-4844 is enabled for this block, returns the excess blob gas for the block
	parentBeaconBlockRoot?: Hex | string // If EIP-4788 is enabled for this block, returns parent beacon block root
	executionWitness?: VerkleExecutionWitness | null // If Verkle is enabled for this block
	requestsRoot?: Hex | string // If EIP-7685 is enabled for this block, returns the requests root
	requests?: Array<Hex | string> // If EIP-7685 is enabled for this block, array of serialized CL requests
}

/**
 * Represents an Ethereum withdrawal from the consensus layer to the execution layer
 *
 * Introduced in the Shanghai/Capella upgrade (EIP-4895), these withdrawals allow validators
 * to receive ETH from the beacon chain to their execution layer accounts.
 *
 * @see https://eips.ethereum.org/EIPS/eip-4895 for detailed information
 *
 * @example
 * ```typescript
 * import { WithdrawalV1 } from '@tevm/block'
 *
 * // Example withdrawal object
 * const withdrawal: WithdrawalV1 = {
 *   index: '0x42',                                     // Sequential index
 *   validatorIndex: '0x7b',                            // Index of the validator
 *   address: '0x0c54fccd2e384b4bb6f2e405bf5cbc15a017aafb', // Recipient address
 *   amount: '0x1bc16d674ec80000'                       // Amount in Gwei (2 ETH)
 * }
 *
 * // Process withdrawals in a block
 * function processWithdrawals(withdrawals: WithdrawalV1[]): void {
 *   for (const withdrawal of withdrawals) {
 *     // Credit the amount to the recipient's account
 *     creditAccount(withdrawal.address, BigInt(withdrawal.amount))
 *   }
 * }
 * ```
 */
export type WithdrawalV1 = {
	index: Hex // Quantity, 8 Bytes
	validatorIndex: Hex // Quantity, 8 bytes
	address: Hex // DATA, 20 bytes
	amount: Hex // Quantity, 32 bytes
}

// Note: all these strings are 0x-prefixed
// TODO: Remove the string type and only keep Hex
/**
 * Represents the execution layer data of an Ethereum block
 *
 * Introduced with The Merge (Paris fork), the ExecutionPayload is passed between
 * the consensus layer and execution layer as part of the Engine API. It contains
 * all the information needed for transaction execution and state updates.
 *
 * The structure has evolved over time with various Ethereum upgrades:
 * - The Merge (Paris): Basic structure with transactions
 * - Shanghai: Added withdrawals field
 * - Cancun: Added blobGasUsed, excessBlobGas, parentBeaconBlockRoot
 * - Prague (planned): Will add verkle-related fields
 *
 * @see https://github.com/ethereum/execution-apis/blob/main/src/engine/shanghai.md
 *
 * @example
 * ```typescript
 * import { ExecutionPayload } from '@tevm/block'
 *
 * // Engine API handler receiving a payload from the consensus layer
 * async function handleNewPayload(payload: ExecutionPayload): Promise<{status: string}> {
 *   // Validate the payload
 *   const validationResult = await validateExecutionPayload(payload)
 *
 *   if (validationResult.valid) {
 *     // Execute transactions and update state
 *     await executeTransactions(payload.transactions)
 *
 *     // Process withdrawals if present
 *     if (payload.withdrawals) {
 *       await processWithdrawals(payload.withdrawals)
 *     }
 *
 *     return { status: 'VALID' }
 *   } else {
 *     return { status: 'INVALID', validationError: validationResult.error }
 *   }
 * }
 * ```
 */
export type ExecutionPayload = {
	parentHash: Hex | string // DATA, 32 Bytes
	feeRecipient: Hex | string // DATA, 20 Bytes
	stateRoot: Hex | string // DATA, 32 Bytes
	receiptsRoot: Hex | string // DATA, 32 bytes
	logsBloom: Hex | string // DATA, 256 Bytes
	prevRandao: Hex | string // DATA, 32 Bytes
	blockNumber: Hex | string // QUANTITY, 64 Bits
	gasLimit: Hex | string // QUANTITY, 64 Bits
	gasUsed: Hex | string // QUANTITY, 64 Bits
	timestamp: Hex | string // QUANTITY, 64 Bits
	extraData: Hex | string // DATA, 0 to 32 Bytes
	baseFeePerGas: Hex | string // QUANTITY, 256 Bits
	blockHash: Hex | string // DATA, 32 Bytes
	transactions: Hex[] | string[] // Array of DATA - Array of transaction rlp strings,
	withdrawals?: WithdrawalV1[] // Array of withdrawal objects
	blobGasUsed?: Hex | string // QUANTITY, 64 Bits
	excessBlobGas?: Hex | string // QUANTITY, 64 Bits
	parentBeaconBlockRoot?: Hex | string // QUANTITY, 64 Bits
	// VerkleExecutionWitness is already a hex serialized object
	executionWitness?: VerkleExecutionWitness | null // QUANTITY, 64 Bits, null implies not available
	requestsRoot?: Hex | string | null // DATA, 32 bytes, null implies EIP 7685 not active yet
}
