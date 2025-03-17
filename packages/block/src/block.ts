import { ConsensusType } from '@tevm/common'
import { Rlp } from '@tevm/rlp'
import { Trie } from '@tevm/trie'
import { BlobEIP4844Transaction, Capability, TransactionFactory } from '@tevm/tx'
import {
	type AddressLike,
	type Hex,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	Withdrawal,
	bytesToHex,
	bytesToUtf8,
	equalsBytes,
	hexToBytes,
	keccak256,
} from '@tevm/utils'

import { executionPayloadFromBeaconPayload } from './from-beacon-payload.js'
import { BlockHeader } from './header.js'

import type { Common } from '@tevm/common'
import type { FeeMarket1559Transaction, LegacyTransaction, TypedTransaction } from '@tevm/tx'
import { ClRequest } from './ClRequest.js'
import type { BeaconPayloadJson } from './from-beacon-payload.js'
import type {
	BlockBytes,
	BlockData,
	BlockOptions,
	ExecutionPayload,
	HeaderData,
	JsonBlock,
	JsonHeader,
	VerkleExecutionWitness,
} from './types.js'

/**
 * An object that represents the block.
 */
export class Block {
	public readonly header: BlockHeader
	public readonly transactions: TypedTransaction[] = []
	public readonly uncleHeaders: BlockHeader[] = []
	public readonly withdrawals?: Withdrawal[] | undefined
	public readonly requests?: ClRequest[] | undefined
	public readonly common: Common
	protected keccakFunction: (msg: Uint8Array) => Uint8Array

	/**
	 * EIP-6800: Verkle Proof Data (experimental)
	 * null implies that the non default executionWitness might exist but not available
	 * and will not lead to execution of the block via vm with verkle stateless manager
	 */
	public readonly executionWitness?: VerkleExecutionWitness | null | undefined

	protected cache: {
		txTrieRoot?: Uint8Array
		withdrawalsTrieRoot?: Uint8Array
		requestsRoot?: Uint8Array
	} = {}

	/**
	 * Returns the withdrawals trie root for array of Withdrawal.
	 * @param wts array of Withdrawal to compute the root of
	 * @param optional emptyTrie to use to generate the root
	 */
	public static async genWithdrawalsTrieRoot(wts: Withdrawal[], emptyTrie?: Trie) {
		const trie = emptyTrie ?? new Trie()
		for (const [i, wt] of wts.entries()) {
			await trie.put(Rlp.encode(i), Rlp.encode(wt.raw()))
		}
		return trie.root()
	}

	/**
	 * Returns the txs trie root for array of TypedTransaction
	 * @param txs array of TypedTransaction to compute the root of
	 * @param optional emptyTrie to use to generate the root
	 */
	public static async genTransactionsTrieRoot(txs: TypedTransaction[], emptyTrie?: Trie) {
		const trie = emptyTrie ?? new Trie()
		for (const [i, tx] of txs.entries()) {
			await trie.put(Rlp.encode(i), tx.serialize())
		}
		return trie.root()
	}

	/**
	 * Returns the requests trie root for an array of CLRequests
	 * @param requests - an array of CLRequests
	 * @param emptyTrie optional empty trie used to generate the root
	 * @returns a 32 byte Uint8Array representing the requests trie root
	 */
	public static async genRequestsTrieRoot(requests: ClRequest[], emptyTrie?: Trie) {
		// TODO validate that Requests should be sorted in monotonically ascending order based on type
		// and whatever internal sorting logic is defined by each request type
		const trie = emptyTrie ?? new Trie()
		for (const [i, req] of requests.entries()) {
			await trie.put(Rlp.encode(i), req.serialize())
		}
		return trie.root()
	}

	/**
	 * Static constructor to create a block from a block data dictionary
	 *
	 * @param blockData
	 * @param opts
	 */
	public static fromBlockData(blockData: BlockData, opts: BlockOptions) {
		const {
			header: headerData,
			transactions: txsData,
			uncleHeaders: uhsData,
			withdrawals: withdrawalsData,
			executionWitness: executionWitnessData,
			requests: clRequests,
		} = blockData

		const header = BlockHeader.fromHeaderData(headerData as HeaderData, opts)

		// parse transactions
		const transactions: TypedTransaction[] = []
		for (const txData of txsData ?? []) {
			// We should make a new tx using header common in case of setHardfork being activated
			// We aren't doing that atm because it causes a bug with impersonated transactions
			transactions.push(txData as any)
		}

		// parse uncle headers
		const uncleHeaders = []
		// Disable this option here (all other options carried over), since this overwrites the provided Difficulty to an incorrect value
		const { calcDifficultyFromHeader, ...restOpts } = opts
		const uncleOpts: BlockOptions = {
			...restOpts,
			// Use header common in case of setHardfork being activated
			common: header.common,
		}
		// Uncles are obsolete post-merge, any hardfork by option implies setHardfork
		if (opts?.setHardfork !== undefined) {
			uncleOpts.setHardfork = true
		}
		for (const uhData of uhsData ?? []) {
			const uh = BlockHeader.fromHeaderData(uhData, uncleOpts)
			uncleHeaders.push(uh)
		}

		const withdrawals = withdrawalsData?.map(Withdrawal.fromWithdrawalData)
		// The witness data is planned to come in rlp serialized bytes so leave this
		// stub till that time
		const executionWitness = executionWitnessData

		return new Block(opts, header, transactions, uncleHeaders, withdrawals, clRequests, executionWitness)
	}

	/**
	 * Static constructor to create a block from a RLP-serialized block
	 *
	 * @param serialized
	 * @param opts
	 */
	public static fromRLPSerializedBlock(serialized: Uint8Array, opts: BlockOptions) {
		const values = Rlp.decode(Uint8Array.from(serialized)) as BlockBytes

		if (!Array.isArray(values)) {
			throw new Error('Invalid serialized block input. Must be array')
		}

		return Block.fromValuesArray(values, opts)
	}

	/**
	 * Static constructor to create a block from an array of Bytes values
	 *
	 * @param values
	 * @param opts
	 */
	public static fromValuesArray(values: BlockBytes, opts: BlockOptions) {
		if (values.length > 5) {
			throw new Error(`invalid block. More values=${values.length} than expected were received (at most 5)`)
		}

		// First try to load header so that we can use its common (in case of setHardfork being activated)
		// to correctly make checks on the hardforks
		const [headerData, txsData, uhsData, withdrawalBytes, requestBytes, executionWitnessBytes] = values
		const header = BlockHeader.fromValuesArray(headerData, opts)

		if (
			header.common.ethjsCommon.isActivatedEIP(4895) &&
			(withdrawalBytes === undefined || !Array.isArray(withdrawalBytes))
		) {
			throw new Error('Invalid serialized block input: EIP-4895 is active, and no withdrawals were provided as array')
		}

		// parse transactions
		const transactions = []
		for (const txData of txsData ?? []) {
			transactions.push(
				TransactionFactory.fromBlockBodyData(txData, {
					...opts,
					// Use header common in case of setHardfork being activated
					common: header.common.ethjsCommon,
				}),
			)
		}

		// parse uncle headers
		const uncleHeaders = []
		const { calcDifficultyFromHeader: _, ...carriedOverUncleOpts } = opts ?? {}
		const uncleOpts: BlockOptions = {
			...carriedOverUncleOpts,
			// Use header common in case of setHardfork being activated
			common: header.common,
		}
		// Uncles are obsolete post-merge, any hardfork by option implies setHardfork
		if (opts?.setHardfork !== undefined) {
			uncleOpts.setHardfork = true
		}
		for (const uncleHeaderData of uhsData ?? []) {
			uncleHeaders.push(BlockHeader.fromValuesArray(uncleHeaderData, uncleOpts))
		}

		// TODO this type is fucked
		const withdrawals = (withdrawalBytes as unknown as Array<[number, number, AddressLike, number]>)
			?.map(([index, validatorIndex, address, amount]) => ({
				index: index,
				validatorIndex: validatorIndex,
				address: address,
				amount: amount,
			}))
			?.map((w) => Withdrawal.fromWithdrawalData(w))

		let requests: ClRequest[] = []
		if (header.common.ethjsCommon.isActivatedEIP(7685)) {
			requests = (requestBytes as Uint8Array[]).map((bytes) => new ClRequest(bytes[0] as number, bytes.slice(1)))
		}
		// executionWitness are not part of the EL fetched blocks via eth_ bodies method
		// they are currently only available via the engine api constructed blocks
		let executionWitness: VerkleExecutionWitness | null = null
		if (header.common.ethjsCommon.isActivatedEIP(6800)) {
			if (executionWitnessBytes !== undefined) {
				executionWitness = JSON.parse(bytesToUtf8(Rlp.decode(executionWitnessBytes) as Uint8Array))
			} else if (opts?.executionWitness !== undefined) {
				executionWitness = opts.executionWitness
			} else {
				// don't assign default witness if eip 6800 is implemented as it leads to incorrect
				// assumptions while executing the block. if not present in input implies its unavailable
				executionWitness = null
			}
		}

		return new Block(opts, header, transactions, uncleHeaders, withdrawals, requests, executionWitness)
	}

	/**
	 *  Method to retrieve a block from an execution payload
	 * @param execution payload constructed from beacon payload
	 * @param opts {@link BlockOptions}
	 * @returns the block constructed block
	 */
	public static async fromExecutionPayload(payload: ExecutionPayload, opts: BlockOptions): Promise<Block> {
		const {
			blockNumber: number,
			receiptsRoot: receiptTrie,
			prevRandao: mixHash,
			feeRecipient: coinbase,
			transactions,
			withdrawals: withdrawalsData,
			requestsRoot,
			executionWitness,
		} = payload

		const txs = []
		for (const [index, serializedTx] of transactions.entries()) {
			try {
				const tx = TransactionFactory.fromSerializedData(hexToBytes(serializedTx as Hex), {
					common: opts?.common.ethjsCommon,
				})
				txs.push(tx)
			} catch (error) {
				const validationError = `Invalid tx at index ${index}: ${error}`
				throw validationError
			}
		}

		const reqRoot = requestsRoot === null ? undefined : requestsRoot
		const transactionsTrie = await Block.genTransactionsTrieRoot(txs, new Trie({ common: opts?.common.ethjsCommon }))
		const withdrawals = withdrawalsData?.map((wData) => Withdrawal.fromWithdrawalData(wData))
		const withdrawalsRoot = withdrawals
			? await Block.genWithdrawalsTrieRoot(withdrawals, new Trie({ common: opts?.common.ethjsCommon }))
			: undefined
		const header: HeaderData = {
			...payload,
			number,
			receiptTrie,
			transactionsTrie,
			withdrawalsRoot,
			mixHash,
			coinbase,
			requestsRoot: reqRoot,
		} as HeaderData

		// we are not setting setHardfork as common is already set to the correct hf
		const block = Block.fromBlockData({ header, transactions: txs, withdrawals, executionWitness } as BlockData, opts)
		if (
			block.common.ethjsCommon.isActivatedEIP(6800) &&
			(executionWitness === undefined || executionWitness === null)
		) {
			throw Error('Missing executionWitness for EIP-6800 activated executionPayload')
		}
		// Verify blockHash matches payload
		if (!equalsBytes(block.hash(), hexToBytes(payload.blockHash as Hex))) {
			const validationError = `Invalid blockHash, expected: ${payload.blockHash}, received: ${bytesToHex(block.hash())}`
			throw Error(validationError)
		}

		return block
	}

	/**
	 *  Method to retrieve a block from a beacon payload json
	 * @param payload json of a beacon beacon fetched from beacon apis
	 * @param opts {@link BlockOptions}
	 * @returns the block constructed block
	 */
	public static async fromBeaconPayloadJson(payload: BeaconPayloadJson, opts: BlockOptions): Promise<Block> {
		const executionPayload = executionPayloadFromBeaconPayload(payload)
		return Block.fromExecutionPayload(executionPayload, opts)
	}

	/**
	 * This constructor takes the values, validates them, assigns them and freezes the object.
	 * Use the static factory methods to assist in creating a Block object from varying data types and options.
	 */
	constructor(
		opts: BlockOptions,
		header?: BlockHeader,
		transactions: TypedTransaction[] = [],
		uncleHeaders: BlockHeader[] = [],
		withdrawals?: Withdrawal[],
		requests?: ClRequest[],
		executionWitness?: VerkleExecutionWitness | null,
	) {
		this.header = header ?? BlockHeader.fromHeaderData({}, opts)
		this.common = this.header.common
		this.keccakFunction = this.common.ethjsCommon.customCrypto.keccak256 ?? ((item) => keccak256(item, 'bytes'))

		this.transactions = transactions
		this.withdrawals = withdrawals ?? (this.common.ethjsCommon.isActivatedEIP(4895) ? [] : undefined)
		this.executionWitness = executionWitness
		this.requests = requests ?? (this.common.ethjsCommon.isActivatedEIP(7685) ? [] : undefined)
		// null indicates an intentional absence of value or unavailability
		// undefined indicates that the executionWitness should be initialized with the default state
		if (this.common.ethjsCommon.isActivatedEIP(6800) && this.executionWitness === undefined) {
			this.executionWitness = {
				stateDiff: [],
				verkleProof: {
					commitmentsByPath: [],
					d: '0x',
					depthExtensionPresent: '0x',
					ipaProof: {
						cl: [],
						cr: [],
						finalEvaluation: '0x',
					},
					otherStems: [],
				},
			}
		}

		this.uncleHeaders = uncleHeaders
		if (uncleHeaders.length > 0) {
			this.validateUncles()
			if (this.common.ethjsCommon.consensusType() === ConsensusType.ProofOfAuthority) {
				const msg = this._errorMsg('Block initialization with uncleHeaders on a PoA network is not allowed')
				throw new Error(msg)
			}
			if (this.common.ethjsCommon.consensusType() === ConsensusType.ProofOfStake) {
				const msg = this._errorMsg('Block initialization with uncleHeaders on a PoS network is not allowed')
				throw new Error(msg)
			}
		}

		if (!this.common.ethjsCommon.isActivatedEIP(4895) && withdrawals !== undefined) {
			throw new Error('Cannot have a withdrawals field if EIP 4895 is not active')
		}

		if (!this.common.ethjsCommon.isActivatedEIP(6800) && executionWitness !== undefined && executionWitness !== null) {
			throw new Error('Cannot have executionWitness field if EIP 6800 is not active ')
		}

		if (!this.common.ethjsCommon.isActivatedEIP(7685) && requests !== undefined) {
			throw new Error('Cannot have requests field if EIP 7685 is not active')
		}

		// Requests should be sorted in monotonically ascending order based on type
		// and whatever internal sorting logic is defined by each request type
		if (requests !== undefined && requests.length > 1) {
			for (let x = 1; x < requests.length; x++) {
				if ((requests[x] as { type: number }).type < (requests[x - 1] as { type: number }).type)
					throw new Error('requests are not sorted in ascending order')
			}
		}
		const freeze = opts?.freeze ?? true
		if (freeze) {
			Object.freeze(this)
		}
	}

	/**
	 * Returns a Array of the raw Bytes Arrays of this block, in order.
	 */
	raw(): BlockBytes {
		const bytesArray = <BlockBytes>[
			this.header.raw(),
			this.transactions.map((tx) =>
				tx.supports(Capability.EIP2718TypedTransaction) ? tx.serialize() : tx.raw(),
			) as Uint8Array[],
			this.uncleHeaders.map((uh) => uh.raw()),
		]
		const withdrawalsRaw = this.withdrawals?.map((wt) => wt.raw())
		if (withdrawalsRaw) {
			bytesArray.push(withdrawalsRaw)
		}
		if (this.executionWitness !== undefined && this.executionWitness !== null) {
			const executionWitnessBytes = Rlp.encode(JSON.stringify(this.executionWitness))
			bytesArray.push(executionWitnessBytes as any)
		}
		return bytesArray
	}

	/**
	 * Returns the hash of the block.
	 */
	hash(): Uint8Array {
		return this.header.hash()
	}

	/**
	 * Determines if this block is the genesis block.
	 */
	isGenesis(): boolean {
		return this.header.isGenesis()
	}

	/**
	 * Returns the rlp encoding of the block.
	 */
	serialize(): Uint8Array {
		return Rlp.encode(this.raw())
	}

	/**
	 * Generates transaction trie for validation.
	 */
	async genTxTrie(): Promise<Uint8Array> {
		return Block.genTransactionsTrieRoot(this.transactions, new Trie({ common: this.common.ethjsCommon }))
	}

	/**
	 * Validates the transaction trie by generating a trie
	 * and do a check on the root hash.
	 * @returns True if the transaction trie is valid, false otherwise
	 */
	async transactionsTrieIsValid(): Promise<boolean> {
		let result: boolean
		if (this.transactions.length === 0) {
			result = equalsBytes(this.header.transactionsTrie, KECCAK256_RLP)
			return result
		}

		if (this.cache.txTrieRoot === undefined) {
			this.cache.txTrieRoot = await this.genTxTrie()
		}
		result = equalsBytes(this.cache.txTrieRoot, this.header.transactionsTrie)
		return result
	}

	async requestsTrieIsValid(): Promise<boolean> {
		if (!this.common.ethjsCommon.isActivatedEIP(7685)) {
			throw new Error('EIP 7685 is not activated')
		}

		let result: boolean
		if (this.requests?.length === 0) {
			result = equalsBytes(this.header.requestsRoot as Uint8Array, KECCAK256_RLP)
			return result
		}

		if (this.cache.requestsRoot === undefined) {
			this.cache.requestsRoot = await Block.genRequestsTrieRoot(this.requests ?? [])
		}

		result = equalsBytes(this.cache.requestsRoot, this.header.requestsRoot as Uint8Array)

		return result
	}
	/**
	 * Validates transaction signatures and minimum gas requirements.
	 * @returns {string[]} an array of error strings
	 */
	getTransactionsValidationErrors(): string[] {
		const errors: string[] = []
		let blobGasUsed = 0n
		const blobGasLimit = this.common.ethjsCommon.param('gasConfig', 'maxblobGasPerBlock')
		const blobGasPerBlob = this.common.ethjsCommon.param('gasConfig', 'blobGasPerBlob')

		// eslint-disable-next-line prefer-const
		for (let [i, tx] of this.transactions.entries()) {
			const errs = tx.getValidationErrors()
			if (this.common.ethjsCommon.isActivatedEIP(1559)) {
				if (tx.supports(Capability.EIP1559FeeMarket)) {
					tx = tx as FeeMarket1559Transaction
					if (tx.maxFeePerGas < (this.header.baseFeePerGas as bigint)) {
						errs.push('tx unable to pay base fee (EIP-1559 tx)')
					}
				} else {
					tx = tx as LegacyTransaction
					if (tx.gasPrice < (this.header.baseFeePerGas as bigint)) {
						errs.push('tx unable to pay base fee (non EIP-1559 tx)')
					}
				}
			}
			if (this.common.ethjsCommon.isActivatedEIP(4844)) {
				if (tx instanceof BlobEIP4844Transaction) {
					blobGasUsed += BigInt(tx.numBlobs()) * blobGasPerBlob
					if (blobGasUsed > blobGasLimit) {
						errs.push(
							`tx causes total blob gas of ${blobGasUsed} to exceed maximum blob gas per block of ${blobGasLimit}`,
						)
					}
				}
			}
			if (errs.length > 0) {
				errors.push(`errors at tx ${i}: ${errs.join(', ')}`)
			}
		}

		if (this.common.ethjsCommon.isActivatedEIP(4844)) {
			if (blobGasUsed !== this.header.blobGasUsed) {
				errors.push(`invalid blobGasUsed expected=${this.header.blobGasUsed} actual=${blobGasUsed}`)
			}
		}

		return errors
	}

	/**
	 * Validates transaction signatures and minimum gas requirements.
	 * @returns True if all transactions are valid, false otherwise
	 */
	transactionsAreValid(): boolean {
		const errors = this.getTransactionsValidationErrors()

		return errors.length === 0
	}

	/**
	 * Validates the block data, throwing if invalid.
	 * This can be checked on the Block itself without needing access to any parent block
	 * It checks:
	 * - All transactions are valid
	 * - The transactions trie is valid
	 * - The uncle hash is valid
	 * @param onlyHeader if only passed the header, skip validating txTrie and unclesHash (default: false)
	 * @param verifyTxs if set to `false`, will not check for transaction validation errors (default: true)
	 */
	async validateData(onlyHeader = false, verifyTxs = true): Promise<void> {
		if (verifyTxs) {
			const txErrors = this.getTransactionsValidationErrors()
			if (txErrors.length > 0) {
				const msg = this._errorMsg(`invalid transactions: ${txErrors.join(' ')}`)
				throw new Error(msg)
			}
		}

		if (onlyHeader) {
			return
		}

		if (verifyTxs) {
			for (const [index, tx] of this.transactions.entries()) {
				if (!tx.isSigned()) {
					const msg = this._errorMsg(`invalid transactions: transaction at index ${index} is unsigned`)
					throw new Error(msg)
				}
			}
		}

		if (!(await this.transactionsTrieIsValid())) {
			const msg = this._errorMsg('invalid transaction trie')
			throw new Error(msg)
		}

		if (!this.uncleHashIsValid()) {
			const msg = this._errorMsg('invalid uncle hash')
			throw new Error(msg)
		}

		if (this.common.ethjsCommon.isActivatedEIP(4895) && !(await this.withdrawalsTrieIsValid())) {
			const msg = this._errorMsg('invalid withdrawals trie')
			throw new Error(msg)
		}

		// Validation for Verkle blocks
		// Unnecessary in this implementation since we're providing defaults if those fields are undefined
		if (this.common.ethjsCommon.isActivatedEIP(6800)) {
			if (this.executionWitness === undefined) {
				throw new Error('Invalid block: missing executionWitness')
			}
			if (this.executionWitness === null) {
				throw new Error('Invalid block: ethereumjs stateless client needs executionWitness')
			}
		}
	}

	/**
	 * Validates that blob gas fee for each transaction is greater than or equal to the
	 * blobGasPrice for the block and that total blob gas in block is less than maximum
	 * blob gas per block
	 * @param parentHeader header of parent block
	 */
	validateBlobTransactions(parentHeader: BlockHeader) {
		if (this.common.ethjsCommon.isActivatedEIP(4844)) {
			const blobGasLimit = this.common.ethjsCommon.param('gasConfig', 'maxblobGasPerBlock')
			const blobGasPerBlob = this.common.ethjsCommon.param('gasConfig', 'blobGasPerBlob')
			let blobGasUsed = 0n

			const expectedExcessBlobGas = parentHeader.calcNextExcessBlobGas()
			if (this.header.excessBlobGas !== expectedExcessBlobGas) {
				throw new Error(
					`block excessBlobGas mismatch: have ${this.header.excessBlobGas}, want ${expectedExcessBlobGas}`,
				)
			}

			let blobGasPrice: bigint = this.header.getBlobGasPrice()

			for (const tx of this.transactions) {
				if (tx instanceof BlobEIP4844Transaction) {
					blobGasPrice = blobGasPrice ?? this.header.getBlobGasPrice()
					if (tx.maxFeePerBlobGas < blobGasPrice) {
						throw new Error(
							`blob transaction maxFeePerBlobGas ${
								tx.maxFeePerBlobGas
							} < than block blob gas price ${blobGasPrice} - ${this.errorStr()}`,
						)
					}

					blobGasUsed += BigInt(tx.blobVersionedHashes.length) * blobGasPerBlob

					if (blobGasUsed > blobGasLimit) {
						throw new Error(
							`tx causes total blob gas of ${blobGasUsed} to exceed maximum blob gas per block of ${blobGasLimit}`,
						)
					}
				}
			}

			if (this.header.blobGasUsed !== blobGasUsed) {
				throw new Error(`block blobGasUsed mismatch: have ${this.header.blobGasUsed}, want ${blobGasUsed}`)
			}
		}
	}

	/**
	 * Validates the uncle's hash.
	 * @returns true if the uncle's hash is valid, false otherwise.
	 */
	uncleHashIsValid(): boolean {
		if (this.uncleHeaders.length === 0) {
			return equalsBytes(KECCAK256_RLP_ARRAY, this.header.uncleHash)
		}
		const uncles = this.uncleHeaders.map((uh) => uh.raw())
		const raw = Rlp.encode(uncles)
		return equalsBytes(this.keccakFunction(raw), this.header.uncleHash)
	}

	/**
	 * Validates the withdrawal root
	 * @returns true if the withdrawals trie root is valid, false otherwise
	 */
	async withdrawalsTrieIsValid(): Promise<boolean> {
		if (!this.common.ethjsCommon.isActivatedEIP(4895)) {
			throw new Error('EIP 4895 is not activated')
		}

		let result: boolean
		if (this.withdrawals?.length === 0) {
			result = equalsBytes(this.header.withdrawalsRoot as Uint8Array, KECCAK256_RLP)
			return result
		}

		if (this.cache.withdrawalsTrieRoot === undefined) {
			this.cache.withdrawalsTrieRoot = await Block.genWithdrawalsTrieRoot(
				this.withdrawals ?? [],
				new Trie({ common: this.common.ethjsCommon }),
			)
		}
		result = equalsBytes(this.cache.withdrawalsTrieRoot, this.header.withdrawalsRoot as Uint8Array)
		return result
	}

	/**
	 * Consistency checks for uncles included in the block, if any.
	 *
	 * Throws if invalid.
	 *
	 * The rules for uncles checked are the following:
	 * Header has at most 2 uncles.
	 * Header does not count an uncle twice.
	 */
	validateUncles() {
		if (this.isGenesis()) {
			return
		}

		// Header has at most 2 uncles
		if (this.uncleHeaders.length > 2) {
			const msg = this._errorMsg('too many uncle headers')
			throw new Error(msg)
		}

		// Header does not count an uncle twice.
		const uncleHashes = this.uncleHeaders.map((header) => bytesToHex(header.hash()))
		if (!(new Set(uncleHashes).size === uncleHashes.length)) {
			const msg = this._errorMsg('duplicate uncles')
			throw new Error(msg)
		}
	}

	/**
	 * Returns the canonical difficulty for this block.
	 *
	 * @param parentBlock - the parent of this `Block`
	 */
	ethashCanonicalDifficulty(parentBlock: Block): bigint {
		return this.header.ethashCanonicalDifficulty(parentBlock.header)
	}

	/**
	 * Validates if the block gasLimit remains in the boundaries set by the protocol.
	 * Throws if invalid
	 *
	 * @param parentBlock - the parent of this `Block`
	 */
	validateGasLimit(parentBlock: Block) {
		return this.header.validateGasLimit(parentBlock.header)
	}

	/**
	 * Returns the block in JSON format.
	 */
	toJSON(): JsonBlock {
		const withdrawalsAttr = this.withdrawals
			? {
					withdrawals: this.withdrawals.map((wt) => wt.toJSON()),
				}
			: {}
		return {
			header: this.header.toJSON(),
			transactions: this.transactions.map((tx) => tx.toJSON()),
			uncleHeaders: this.uncleHeaders.map((uh) => uh.toJSON()),
			...withdrawalsAttr,
			requests: this.requests?.map((req) => bytesToHex(req.serialize())),
		} as JsonBlock
	}

	toExecutionPayload(): ExecutionPayload {
		const blockJson = this.toJSON()
		const header = blockJson.header as JsonHeader
		const transactions = this.transactions.map((tx) => bytesToHex(tx.serialize())) ?? []
		const withdrawalsArr = blockJson.withdrawals ? { withdrawals: blockJson.withdrawals } : {}

		const executionPayload: ExecutionPayload = {
			blockNumber: header.number,
			parentHash: header.parentHash,
			feeRecipient: header.coinbase,
			stateRoot: header.stateRoot,
			receiptsRoot: header.receiptTrie,
			logsBloom: header.logsBloom,
			gasLimit: header.gasLimit,
			gasUsed: header.gasUsed,
			timestamp: header.timestamp,
			extraData: header.extraData,
			baseFeePerGas: header.baseFeePerGas,
			blobGasUsed: header.blobGasUsed,
			excessBlobGas: header.excessBlobGas,
			blockHash: bytesToHex(this.hash()),
			prevRandao: header.mixHash,
			transactions,
			...withdrawalsArr,
			parentBeaconBlockRoot: header.parentBeaconBlockRoot,
			executionWitness: this.executionWitness,
		} as ExecutionPayload

		return executionPayload
	}

	/**
	 * Return a compact error string representation of the object
	 */
	public errorStr() {
		let hash = ''
		try {
			hash = bytesToHex(this.hash())
		} catch (e: any) {
			hash = 'error'
		}
		let hf = ''
		try {
			hf = this.common.ethjsCommon.hardfork()
		} catch (e: any) {
			hf = 'error'
		}
		let errorStr = `block number=${this.header.number} hash=${hash} `
		errorStr += `hf=${hf} baseFeePerGas=${this.header.baseFeePerGas ?? 'none'} `
		errorStr += `txs=${this.transactions.length} uncles=${this.uncleHeaders.length}`
		return errorStr
	}

	/**
	 * Internal helper function to create an annotated error message
	 *
	 * @param msg Base error message
	 * @hidden
	 */
	protected _errorMsg(msg: string) {
		return `${msg} (${this.errorStr()})`
	}
}
