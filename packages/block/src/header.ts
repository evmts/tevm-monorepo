import { type Common, ConsensusAlgorithm, ConsensusType, tevmDefault } from '@tevm/common'
import { Rlp } from '@tevm/rlp'
import {
	EthjsAddress,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	bytesToBigInt,
	bytesToHex,
	bytesToUtf8,
	concatBytes,
	ecrecover,
	equalsBytes,
	hexToBytes,
	keccak256,
	numberToHex,
	toBytes,
} from '@tevm/utils'

import { CLIQUE_EXTRA_SEAL, CLIQUE_EXTRA_VANITY } from './clique.js'
import { fakeExponential, valuesArrayToHeaderData } from './helpers.js'
import { createAddressFromPublicKey, createZeroAddress, getSignatureV, safeToType, zeros } from './utils.js'

import type { CliqueConfig } from '@tevm/common'
import type { BlockHeaderBytes, BlockOptions, HeaderData, JsonHeader } from './types.js'

interface HeaderCache {
	hash: Uint8Array | undefined
}

const DEFAULT_GAS_LIMIT = BigInt('0xffffffffffffff')

const bigIntToUnpaddedBytes = (n: bigint) => {
	return toBytes(n).slice(2)
}
/**
 * An object that represents the block header.
 */
export class BlockHeader {
	public readonly parentHash: Uint8Array
	public readonly uncleHash: Uint8Array
	public readonly coinbase: EthjsAddress
	public readonly stateRoot: Uint8Array
	public readonly transactionsTrie: Uint8Array
	public readonly receiptTrie: Uint8Array
	public readonly logsBloom: Uint8Array
	public readonly difficulty: bigint
	public readonly number: bigint
	public readonly gasLimit: bigint
	public readonly gasUsed: bigint
	public readonly timestamp: bigint
	public readonly extraData: Uint8Array
	public readonly mixHash: Uint8Array
	public readonly nonce: Uint8Array
	public readonly baseFeePerGas?: bigint
	public readonly withdrawalsRoot?: Uint8Array
	public readonly blobGasUsed?: bigint
	public readonly excessBlobGas?: bigint
	public readonly parentBeaconBlockRoot?: Uint8Array
	public readonly requestsRoot?: Uint8Array

	public readonly common: Common

	protected keccakFunction: (msg: Uint8Array) => Uint8Array

	protected cache: HeaderCache = {
		hash: undefined,
	}

	/**
	 * EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`
	 */
	get prevRandao() {
		if (!this.common.ethjsCommon.isActivatedEIP(4399)) {
			const msg = this._errorMsg('The prevRandao parameter can only be accessed when EIP-4399 is activated')
			throw new Error(msg)
		}
		return this.mixHash
	}

	/**
	 * Static constructor to create a block header from a header data dictionary
	 *
	 * @param headerData
	 * @param opts
	 */
	public static fromHeaderData(headerData: HeaderData, opts: BlockOptions) {
		return new BlockHeader(headerData, opts)
	}

	/**
	 * Static constructor to create a block header from a RLP-serialized header
	 *
	 * @param serializedHeaderData
	 * @param opts
	 */
	public static fromRLPSerializedHeader(serializedHeaderData: Uint8Array, opts: BlockOptions) {
		const values = Rlp.decode(serializedHeaderData)
		if (!Array.isArray(values)) {
			throw new Error('Invalid serialized header input. Must be array')
		}
		return BlockHeader.fromValuesArray(values as Uint8Array[], opts)
	}

	/**
	 * Static constructor to create a block header from an array of Bytes values
	 *
	 * @param values
	 * @param opts
	 */
	public static fromValuesArray(values: BlockHeaderBytes, opts: BlockOptions) {
		const headerData = valuesArrayToHeaderData(values)
		const { number, baseFeePerGas, excessBlobGas, blobGasUsed, parentBeaconBlockRoot, requestsRoot } = headerData
		const header = BlockHeader.fromHeaderData(headerData, opts)
		if (header.common.ethjsCommon.isActivatedEIP(1559) && baseFeePerGas === undefined) {
			const eip1559ActivationBlock = toBytes(header.common.ethjsCommon.eipBlock(1559) as bigint)
			if (eip1559ActivationBlock !== undefined && equalsBytes(eip1559ActivationBlock, number as Uint8Array)) {
				throw new Error('invalid header. baseFeePerGas should be provided')
			}
		}
		if (header.common.ethjsCommon.isActivatedEIP(4844)) {
			if (excessBlobGas === undefined) {
				throw new Error('invalid header. excessBlobGas should be provided')
			}
			if (blobGasUsed === undefined) {
				throw new Error('invalid header. blobGasUsed should be provided')
			}
		}
		if (header.common.ethjsCommon.isActivatedEIP(4788) && parentBeaconBlockRoot === undefined) {
			throw new Error('invalid header. parentBeaconBlockRoot should be provided')
		}

		if (header.common.ethjsCommon.isActivatedEIP(7685) && requestsRoot === undefined) {
			throw new Error('invalid header. requestsRoot should be provided')
		}
		return header
	}
	/**
	 * This constructor takes the values, validates them, assigns them and freezes the object.
	 *
	 * @deprecated Use the public static factory methods to assist in creating a Header object from
	 * varying data types. For a default empty header, use {@link BlockHeader.fromHeaderData}.
	 *
	 */
	constructor(headerData: HeaderData, opts: BlockOptions) {
		if (opts.common) {
			this.common = opts.common.copy()
		} else {
			this.common = tevmDefault.copy()
		}
		this.keccakFunction = this.common.ethjsCommon.customCrypto.keccak256 ?? ((value) => keccak256(value, 'bytes'))

		const skipValidateConsensusFormat = opts.skipConsensusFormatValidation ?? false

		const defaults = {
			parentHash: zeros(32),
			uncleHash: KECCAK256_RLP_ARRAY,
			coinbase: createZeroAddress(),
			stateRoot: zeros(32),
			transactionsTrie: KECCAK256_RLP,
			receiptTrie: KECCAK256_RLP,
			logsBloom: zeros(256),
			difficulty: 0n,
			number: 0n,
			gasLimit: DEFAULT_GAS_LIMIT,
			gasUsed: 0n,
			timestamp: 0n,
			extraData: new Uint8Array(0),
			mixHash: zeros(32),
			nonce: zeros(8),
		}

		const parentHash = safeToType(headerData.parentHash, 2) ?? defaults.parentHash
		const uncleHash = safeToType(headerData.uncleHash, 2) ?? defaults.uncleHash
		const coinbase = new EthjsAddress(safeToType(headerData.coinbase ?? defaults.coinbase, 2))
		const stateRoot = safeToType(headerData.stateRoot, 2) ?? defaults.stateRoot
		const transactionsTrie = safeToType(headerData.transactionsTrie, 2) ?? defaults.transactionsTrie
		const receiptTrie = safeToType(headerData.receiptTrie, 2) ?? defaults.receiptTrie
		const logsBloom = safeToType(headerData.logsBloom, 2) ?? defaults.logsBloom
		const difficulty = safeToType(headerData.difficulty, 1) ?? defaults.difficulty
		const number = safeToType(headerData.number, 1) ?? defaults.number
		const gasLimit = safeToType(headerData.gasLimit, 1) ?? defaults.gasLimit
		const gasUsed = safeToType(headerData.gasUsed, 1) ?? defaults.gasUsed
		const timestamp = safeToType(headerData.timestamp, 1) ?? defaults.timestamp
		const extraData = safeToType(headerData.extraData, 2) ?? defaults.extraData
		const mixHash = safeToType(headerData.mixHash, 2) ?? defaults.mixHash
		const nonce = safeToType(headerData.nonce, 2) ?? defaults.nonce

		const setHardfork = opts.setHardfork ?? false
		if (setHardfork === true) {
			this.common.ethjsCommon.setHardforkBy({
				blockNumber: number,
				timestamp,
			})
		} else if (typeof setHardfork !== 'boolean') {
			this.common.ethjsCommon.setHardforkBy({
				blockNumber: number,
				timestamp,
			})
		}

		// Hardfork defaults which couldn't be paired with earlier defaults
		const hardforkDefaults = {
			baseFeePerGas: this.common.ethjsCommon.isActivatedEIP(1559)
				? number === this.common.ethjsCommon.hardforkBlock('london')
					? this.common.ethjsCommon.param('initialBaseFee')
					: 7n
				: undefined,
			withdrawalsRoot: this.common.ethjsCommon.isActivatedEIP(4895) ? KECCAK256_RLP : undefined,
			blobGasUsed: this.common.ethjsCommon.isActivatedEIP(4844) ? 0n : undefined,
			excessBlobGas: this.common.ethjsCommon.isActivatedEIP(4844) ? 0n : undefined,
			parentBeaconBlockRoot: this.common.ethjsCommon.isActivatedEIP(4788) ? zeros(32) : undefined,
			requestsRoot: this.common.ethjsCommon.isActivatedEIP(7685) ? KECCAK256_RLP : undefined,
		}

		const baseFeePerGas = safeToType(headerData.baseFeePerGas, 1) ?? hardforkDefaults.baseFeePerGas
		const withdrawalsRoot = safeToType(headerData.withdrawalsRoot, 2) ?? hardforkDefaults.withdrawalsRoot
		const blobGasUsed = safeToType(headerData.blobGasUsed, 1) ?? hardforkDefaults.blobGasUsed
		const excessBlobGas = safeToType(headerData.excessBlobGas, 1) ?? hardforkDefaults.excessBlobGas
		const parentBeaconBlockRoot =
			safeToType(headerData.parentBeaconBlockRoot, 2) ?? hardforkDefaults.parentBeaconBlockRoot
		const requestsRoot = safeToType(headerData.requestsRoot, 2) ?? hardforkDefaults.requestsRoot

		if (!this.common.ethjsCommon.isActivatedEIP(1559) && baseFeePerGas !== undefined) {
			throw new Error('A base fee for a block can only be set with EIP1559 being activated')
		}

		if (!this.common.ethjsCommon.isActivatedEIP(4895) && withdrawalsRoot !== undefined) {
			throw new Error('A withdrawalsRoot for a header can only be provided with EIP4895 being activated')
		}

		if (!this.common.ethjsCommon.isActivatedEIP(4844)) {
			if (blobGasUsed !== undefined) {
				throw new Error('blob gas used can only be provided with EIP4844 activated')
			}

			if (excessBlobGas !== undefined) {
				throw new Error('excess blob gas can only be provided with EIP4844 activated')
			}
		}

		if (!this.common.ethjsCommon.isActivatedEIP(4788) && parentBeaconBlockRoot !== undefined) {
			throw new Error('A parentBeaconBlockRoot for a header can only be provided with EIP4788 being activated')
		}

		if (!this.common.ethjsCommon.isActivatedEIP(7685) && requestsRoot !== undefined) {
			throw new Error('requestsRoot can only be provided with EIP 7685 activated')
		}

		this.parentHash = parentHash
		this.uncleHash = uncleHash
		this.coinbase = coinbase
		this.stateRoot = stateRoot
		this.transactionsTrie = transactionsTrie
		this.receiptTrie = receiptTrie
		this.logsBloom = logsBloom
		this.difficulty = difficulty
		this.number = number
		this.gasLimit = gasLimit
		this.gasUsed = gasUsed
		this.timestamp = timestamp
		this.extraData = extraData
		this.mixHash = mixHash
		this.nonce = nonce
		this.baseFeePerGas = baseFeePerGas
		this.withdrawalsRoot = withdrawalsRoot
		this.blobGasUsed = blobGasUsed
		this.excessBlobGas = excessBlobGas
		this.parentBeaconBlockRoot = parentBeaconBlockRoot
		this.requestsRoot = requestsRoot
		this._genericFormatValidation()
		this._validateDAOExtraData()

		// Now we have set all the values of this Header, we possibly have set a dummy
		// `difficulty` value (defaults to 0). If we have a `calcDifficultyFromHeader`
		// block option parameter, we instead set difficulty to this value.
		if (opts.calcDifficultyFromHeader && this.common.ethjsCommon.consensusAlgorithm() === ConsensusAlgorithm.Ethash) {
			this.difficulty = this.ethashCanonicalDifficulty(opts.calcDifficultyFromHeader)
		}

		// If cliqueSigner is provided, seal block with provided privateKey.
		if (opts.cliqueSigner) {
			// Ensure extraData is at least length CLIQUE_EXTRA_VANITY + CLIQUE_EXTRA_SEAL
			const minExtraDataLength = CLIQUE_EXTRA_VANITY + CLIQUE_EXTRA_SEAL
			if (this.extraData.length < minExtraDataLength) {
				const remainingLength = minExtraDataLength - this.extraData.length
				this.extraData = concatBytes(this.extraData, new Uint8Array(remainingLength))
			}

			this.extraData = this.cliqueSealBlock(opts.cliqueSigner)
		}

		// Validate consensus format after block is sealed (if applicable) so extraData checks will pass
		if (skipValidateConsensusFormat === false) this._consensusFormatValidation()

		const freeze = opts?.freeze ?? true
		if (freeze) {
			Object.freeze(this)
		}
	}

	/**
	 * Validates correct buffer lengths, throws if invalid.
	 */
	protected _genericFormatValidation() {
		const { parentHash, stateRoot, transactionsTrie, receiptTrie, mixHash, nonce } = this

		if (parentHash.length !== 32) {
			const msg = this._errorMsg(`parentHash must be 32 bytes, received ${parentHash.length} bytes`)
			throw new Error(msg)
		}
		if (stateRoot.length !== 32) {
			const msg = this._errorMsg(`stateRoot must be 32 bytes, received ${stateRoot.length} bytes`)
			throw new Error(msg)
		}
		if (transactionsTrie.length !== 32) {
			const msg = this._errorMsg(`transactionsTrie must be 32 bytes, received ${transactionsTrie.length} bytes`)
			throw new Error(msg)
		}
		if (receiptTrie.length !== 32) {
			const msg = this._errorMsg(`receiptTrie must be 32 bytes, received ${receiptTrie.length} bytes`)
			throw new Error(msg)
		}
		if (mixHash.length !== 32) {
			const msg = this._errorMsg(`mixHash must be 32 bytes, received ${mixHash.length} bytes`)
			throw new Error(msg)
		}

		if (nonce.length !== 8) {
			const msg = this._errorMsg(`nonce must be 8 bytes, received ${nonce.length} bytes`)
			throw new Error(msg)
		}

		// check if the block used too much gas
		if (this.gasUsed > this.gasLimit) {
			const msg = this._errorMsg(`Invalid block: too much gas used. Used: ${this.gasUsed}, gas limit: ${this.gasLimit}`)
			throw new Error(msg)
		}

		// Validation for EIP-1559 blocks
		if (this.common.ethjsCommon.isActivatedEIP(1559)) {
			if (typeof this.baseFeePerGas !== 'bigint') {
				const msg = this._errorMsg('EIP1559 block has no base fee field')
				throw new Error(msg)
			}
			const londonHfBlock = this.common.ethjsCommon.hardforkBlock('london')
			if (typeof londonHfBlock === 'bigint' && londonHfBlock !== 0n && this.number === londonHfBlock) {
				const initialBaseFee = this.common.ethjsCommon.param('initialBaseFee')
				if (this.baseFeePerGas !== initialBaseFee) {
					const msg = this._errorMsg('Initial EIP1559 block does not have initial base fee')
					throw new Error(msg)
				}
			}
		}

		if (this.common.ethjsCommon.isActivatedEIP(4895)) {
			if (this.withdrawalsRoot === undefined) {
				const msg = this._errorMsg('EIP4895 block has no withdrawalsRoot field')
				throw new Error(msg)
			}
			if (this.withdrawalsRoot?.length !== 32) {
				const msg = this._errorMsg(`withdrawalsRoot must be 32 bytes, received ${this.withdrawalsRoot?.length} bytes`)
				throw new Error(msg)
			}
		}

		if (this.common.ethjsCommon.isActivatedEIP(4788)) {
			if (this.parentBeaconBlockRoot === undefined) {
				const msg = this._errorMsg('EIP4788 block has no parentBeaconBlockRoot field')
				throw new Error(msg)
			}
			if (this.parentBeaconBlockRoot?.length !== 32) {
				const msg = this._errorMsg(
					`parentBeaconBlockRoot must be 32 bytes, received ${this.parentBeaconBlockRoot?.length} bytes`,
				)
				throw new Error(msg)
			}
		}

		if (this.common.ethjsCommon.isActivatedEIP(7685) === true) {
			if (this.requestsRoot === undefined) {
				const msg = this._errorMsg('EIP7685 block has no requestsRoot field')
				throw new Error(msg)
			}
		}
	}

	/**
	 * Checks static parameters related to consensus algorithm
	 * @throws if any check fails
	 */
	protected _consensusFormatValidation() {
		const { nonce, uncleHash, difficulty, extraData, number } = this

		// Consensus type dependent checks
		if (this.common.ethjsCommon.consensusAlgorithm() === ConsensusAlgorithm.Ethash) {
			// PoW/Ethash
			if (number > 0n && this.extraData.length > this.common.ethjsCommon.param('maxExtraDataSize')) {
				// Check length of data on all post-genesis blocks
				const msg = this._errorMsg('invalid amount of extra data')
				throw new Error(msg)
			}
		}
		if (this.common.ethjsCommon.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
			// PoA/Clique
			const minLength = CLIQUE_EXTRA_VANITY + CLIQUE_EXTRA_SEAL
			if (!this.cliqueIsEpochTransition()) {
				// ExtraData length on epoch transition
				if (this.extraData.length !== minLength) {
					const msg = this._errorMsg(
						`extraData must be ${minLength} bytes on non-epoch transition blocks, received ${this.extraData.length} bytes`,
					)
					throw new Error(msg)
				}
			} else {
				const signerLength = this.extraData.length - minLength
				if (signerLength % 20 !== 0) {
					const msg = this._errorMsg(
						`invalid signer list length in extraData, received signer length of ${signerLength} (not divisible by 20)`,
					)
					throw new Error(msg)
				}
				// coinbase (beneficiary) on epoch transition
				if (!this.coinbase.isZero()) {
					const msg = this._errorMsg(
						`coinbase must be filled with zeros on epoch transition blocks, received ${this.coinbase}`,
					)
					throw new Error(msg)
				}
			}
			// MixHash format
			if (!equalsBytes(this.mixHash, new Uint8Array(32))) {
				const msg = this._errorMsg(`mixHash must be filled with zeros, received ${this.mixHash}`)
				throw new Error(msg)
			}
		}
		// Validation for PoS blocks (EIP-3675)
		if (this.common.ethjsCommon.consensusType() === ConsensusType.ProofOfStake) {
			let error = false
			let errorMsg = ''

			if (!equalsBytes(uncleHash, KECCAK256_RLP_ARRAY)) {
				errorMsg += `, uncleHash: ${bytesToHex(uncleHash)} (expected: ${bytesToHex(KECCAK256_RLP_ARRAY)})`
				error = true
			}
			if (number !== 0n) {
				// Skip difficulty, nonce, and extraData check for PoS genesis block as genesis block may have non-zero difficulty (if TD is > 0)
				if (difficulty !== 0n) {
					errorMsg += `, difficulty: ${difficulty} (expected: 0)`
					error = true
				}
				if (extraData.length > 32) {
					errorMsg += `, extraData: ${bytesToHex(extraData)} (cannot exceed 32 bytes length, received ${
						extraData.length
					} bytes)`
					error = true
				}
				if (!equalsBytes(nonce, zeros(8))) {
					errorMsg += `, nonce: ${bytesToHex(nonce)} (expected: ${bytesToHex(zeros(8))})`
					error = true
				}
			}
			if (error) {
				const msg = this._errorMsg(`Invalid PoS block: ${errorMsg}`)
				throw new Error(msg)
			}
		}
	}

	/**
	 * Validates if the block gasLimit remains in the boundaries set by the protocol.
	 * Throws if out of bounds.
	 *
	 * @param parentBlockHeader - the header from the parent `Block` of this header
	 */
	validateGasLimit(parentBlockHeader: BlockHeader) {
		let parentGasLimit = parentBlockHeader.gasLimit
		// EIP-1559: assume double the parent gas limit on fork block
		// to adopt to the new gas target centered logic
		const londonHardforkBlock = this.common.ethjsCommon.hardforkBlock('london')
		if (typeof londonHardforkBlock === 'bigint' && londonHardforkBlock !== 0n && this.number === londonHardforkBlock) {
			const elasticity = this.common.ethjsCommon.param('elasticityMultiplier')
			parentGasLimit = parentGasLimit * elasticity
		}
		const gasLimit = this.gasLimit

		const a = parentGasLimit / this.common.ethjsCommon.param('gasLimitBoundDivisor')
		const maxGasLimit = parentGasLimit + a
		const minGasLimit = parentGasLimit - a

		if (gasLimit >= maxGasLimit) {
			const msg = this._errorMsg(`gas limit increased too much. Gas limit: ${gasLimit}, max gas limit: ${maxGasLimit}`)
			throw new Error(msg)
		}

		if (gasLimit <= minGasLimit) {
			const msg = this._errorMsg(`gas limit decreased too much. Gas limit: ${gasLimit}, min gas limit: ${minGasLimit}`)
			throw new Error(msg)
		}

		if (gasLimit < this.common.ethjsCommon.param('minGasLimit')) {
			const msg = this._errorMsg(
				`gas limit decreased below minimum gas limit. Gas limit: ${gasLimit}, minimum gas limit: ${this.common.ethjsCommon.param('minGasLimit')}`,
			)
			throw new Error(msg)
		}
	}

	/**
	 * Calculates the base fee for a potential next block
	 */
	public calcNextBaseFee(): bigint {
		if (!this.common.ethjsCommon.isActivatedEIP(1559)) {
			const msg = this._errorMsg('calcNextBaseFee() can only be called with EIP1559 being activated')
			throw new Error(msg)
		}
		let nextBaseFee: bigint
		const elasticity = this.common.ethjsCommon.param('elasticityMultiplier')
		const parentGasTarget = this.gasLimit / elasticity

		if (parentGasTarget === this.gasUsed) {
			nextBaseFee = this.baseFeePerGas as bigint
		} else if (this.gasUsed > parentGasTarget) {
			const gasUsedDelta = this.gasUsed - parentGasTarget
			const baseFeeMaxChangeDenominator = this.common.ethjsCommon.param('baseFeeMaxChangeDenominator')

			const calculatedDelta =
				((this.baseFeePerGas as bigint) * gasUsedDelta) / parentGasTarget / baseFeeMaxChangeDenominator
			nextBaseFee = (calculatedDelta > 1n ? calculatedDelta : 1n) + (this.baseFeePerGas as bigint)
		} else {
			const gasUsedDelta = parentGasTarget - this.gasUsed
			const baseFeeMaxChangeDenominator = this.common.ethjsCommon.param('baseFeeMaxChangeDenominator')

			const calculatedDelta =
				((this.baseFeePerGas as bigint) * gasUsedDelta) / parentGasTarget / baseFeeMaxChangeDenominator
			nextBaseFee =
				(this.baseFeePerGas as bigint) - calculatedDelta > 0n ? (this.baseFeePerGas as bigint) - calculatedDelta : 0n
		}
		return nextBaseFee
	}

	/**
	 * Returns the price per unit of blob gas for a blob transaction in the current/pending block
	 * @returns the price in gwei per unit of blob gas spent
	 */
	getBlobGasPrice(): bigint {
		if (this.excessBlobGas === undefined) {
			throw new Error('header must have excessBlobGas field populated')
		}
		return this._getBlobGasPrice(this.excessBlobGas)
	}

	/**
	 * Returns the blob gas price depending upon the `excessBlobGas` value
	 * @param excessBlobGas
	 */
	private _getBlobGasPrice(excessBlobGas: bigint) {
		return fakeExponential(
			this.common.ethjsCommon.param('minBlobGasPrice'),
			excessBlobGas,
			this.common.ethjsCommon.param('blobGasPriceUpdateFraction'),
		)
	}

	/**
	 * Returns the total fee for blob gas spent for including blobs in block.
	 *
	 * @param numBlobs number of blobs in the transaction/block
	 * @returns the total blob gas fee for numBlobs blobs
	 */
	calcDataFee(numBlobs: number): bigint {
		const blobGasPerBlob = this.common.ethjsCommon.param('blobGasPerBlob')
		const blobGasUsed = blobGasPerBlob * BigInt(numBlobs)

		const blobGasPrice = this.getBlobGasPrice()
		return blobGasUsed * blobGasPrice
	}

	/**
	 * Calculates the excess blob gas for next (hopefully) post EIP 4844 block.
	 */
	public calcNextExcessBlobGas(): bigint {
		// The validation of the fields and 4844 activation is already taken care in BlockHeader constructor
		const targetGasConsumed = (this.excessBlobGas ?? 0n) + (this.blobGasUsed ?? 0n)
		const targetBlobGasPerBlock = this.common.ethjsCommon.param('targetBlobGasPerBlock')

		if (targetGasConsumed <= targetBlobGasPerBlock) {
			return 0n
		}
		return targetGasConsumed - targetBlobGasPerBlock
	}

	/**
	 * Calculate the blob gas price of the block built on top of this one
	 * @returns The blob gas price
	 */
	public calcNextBlobGasPrice(): bigint {
		return this._getBlobGasPrice(this.calcNextExcessBlobGas())
	}

	/**
	 * Returns a Uint8Array Array of the raw Bytes in this header, in order.
	 */
	raw(): BlockHeaderBytes {
		const rawItems = [
			this.parentHash,
			this.uncleHash,
			this.coinbase.bytes,
			this.stateRoot,
			this.transactionsTrie,
			this.receiptTrie,
			this.logsBloom,
			bigIntToUnpaddedBytes(this.difficulty),
			bigIntToUnpaddedBytes(this.number),
			bigIntToUnpaddedBytes(this.gasLimit),
			bigIntToUnpaddedBytes(this.gasUsed),
			bigIntToUnpaddedBytes(this.timestamp ?? 0n),
			this.extraData,
			this.mixHash,
			this.nonce,
		]

		if (this.common.ethjsCommon.isActivatedEIP(1559)) {
			rawItems.push(bigIntToUnpaddedBytes(this.baseFeePerGas as bigint))
		}

		if (this.common.ethjsCommon.isActivatedEIP(4895)) {
			rawItems.push(this.withdrawalsRoot as Uint8Array)
		}

		// in kaunstinen 2 verkle is scheduled after withdrawals, will eventually be post deneb hopefully
		if (this.common.ethjsCommon.isActivatedEIP(6800)) {
			// execution witness is not mandatory part of the the block so nothing to push here
			// but keep this comment segment for clarity regarding the same and move it according as per the
			// HF sequence eventually planned
		}

		if (this.common.ethjsCommon.isActivatedEIP(4844)) {
			rawItems.push(bigIntToUnpaddedBytes(this.blobGasUsed as bigint))
			rawItems.push(bigIntToUnpaddedBytes(this.excessBlobGas as bigint))
		}
		if (this.common.ethjsCommon.isActivatedEIP(4788)) {
			rawItems.push(this.parentBeaconBlockRoot as Uint8Array)
		}
		if (this.common.ethjsCommon.isActivatedEIP(7685) === true) {
			rawItems.push(this.requestsRoot as Uint8Array)
		}

		return rawItems
	}

	/**
	 * Returns the hash of the block header.
	 */
	hash(): Uint8Array {
		if (Object.isFrozen(this)) {
			if (!this.cache.hash) {
				this.cache.hash = this.keccakFunction(Rlp.encode(this.raw())) as Uint8Array
			}
			return this.cache.hash
		}
		return this.keccakFunction(Rlp.encode(this.raw()))
	}

	/**
	 * Checks if the block header is a genesis header.
	 */
	isGenesis(): boolean {
		return this.number === 0n
	}

	protected _requireClique(name: string) {
		if (this.common.ethjsCommon.consensusAlgorithm() !== ConsensusAlgorithm.Clique) {
			const msg = this._errorMsg(`BlockHeader.${name}() call only supported for clique PoA networks`)
			throw new Error(msg)
		}
	}

	/**
	 * Returns the canonical difficulty for this block.
	 *
	 * @param parentBlockHeader - the header from the parent `Block` of this header
	 */
	ethashCanonicalDifficulty(parentBlockHeader: BlockHeader): bigint {
		if (this.common.ethjsCommon.consensusType() !== ConsensusType.ProofOfWork) {
			const msg = this._errorMsg('difficulty calculation is only supported on PoW chains')
			throw new Error(msg)
		}
		if (this.common.ethjsCommon.consensusAlgorithm() !== ConsensusAlgorithm.Ethash) {
			const msg = this._errorMsg('difficulty calculation currently only supports the ethash algorithm')
			throw new Error(msg)
		}
		const blockTs = this.timestamp
		const { timestamp: parentTs, difficulty: parentDif } = parentBlockHeader
		const minimumDifficulty = this.common.ethjsCommon.param('minimumDifficulty')
		const offset = parentDif / this.common.ethjsCommon.param('difficultyBoundDivisor')
		let num = this.number

		// We use a ! here as TS cannot follow this hardfork-dependent logic, but it always gets assigned
		let dif!: bigint

		if (this.common.ethjsCommon.gteHardfork('byzantium') === true) {
			// max((2 if len(parent.uncles) else 1) - ((timestamp - parent.timestamp) // 9), -99) (EIP100)
			const uncleAddend = equalsBytes(parentBlockHeader.uncleHash, KECCAK256_RLP_ARRAY) ? 1 : 2
			let a = BigInt(uncleAddend) - (blockTs - parentTs) / BigInt(9)
			const cutoff = BigInt(-99)
			// MAX(cutoff, a)
			if (cutoff > a) {
				a = cutoff
			}
			dif = parentDif + offset * a
		}

		if (this.common.ethjsCommon.gteHardfork('byzantium') === true) {
			// Get delay as parameter from common
			num = num - this.common.ethjsCommon.param('difficultyBombDelay')
			if (num < 0n) {
				num = 0n
			}
		} else if (this.common.ethjsCommon.gteHardfork('homestead') === true) {
			// 1 - (block_timestamp - parent_timestamp) // 10
			let a = 1n - (blockTs - parentTs) / BigInt(10)
			const cutoff = BigInt(-99)
			// MAX(cutoff, a)
			if (cutoff > a) {
				a = cutoff
			}
			dif = parentDif + offset * a
		} else {
			// pre-homestead
			if (parentTs + this.common.ethjsCommon.param('durationLimit') > blockTs) {
				dif = offset + parentDif
			} else {
				dif = parentDif - offset
			}
		}

		const exp = num / BigInt(100000) - 2n
		if (exp >= 0) {
			dif = dif + 2n ** exp
		}

		if (dif < minimumDifficulty) {
			dif = minimumDifficulty
		}

		return dif
	}

	/**
	 * PoA clique signature hash without the seal.
	 */
	cliqueSigHash() {
		this._requireClique('cliqueSigHash')
		const raw = this.raw()
		raw[12] = this.extraData.subarray(0, this.extraData.length - CLIQUE_EXTRA_SEAL)
		return this.keccakFunction(Rlp.encode(raw))
	}

	/**
	 * Checks if the block header is an epoch transition
	 * header (only clique PoA, throws otherwise)
	 */
	cliqueIsEpochTransition(): boolean {
		this._requireClique('cliqueIsEpochTransition')
		const epoch = BigInt((this.common.ethjsCommon.consensusConfig() as CliqueConfig).epoch)
		// Epoch transition block if the block number has no
		// remainder on the division by the epoch length
		return this.number % epoch === 0n
	}

	/**
	 * Returns extra vanity data
	 * (only clique PoA, throws otherwise)
	 */
	cliqueExtraVanity(): Uint8Array {
		this._requireClique('cliqueExtraVanity')
		return this.extraData.subarray(0, CLIQUE_EXTRA_VANITY)
	}

	/**
	 * Returns extra seal data
	 * (only clique PoA, throws otherwise)
	 */
	cliqueExtraSeal(): Uint8Array {
		this._requireClique('cliqueExtraSeal')
		return this.extraData.subarray(-CLIQUE_EXTRA_SEAL)
	}

	/**
	 * Seal block with the provided signer.
	 * Returns the final extraData field to be assigned to `this.extraData`.
	 * @hidden
	 */
	private cliqueSealBlock(privateKey: Uint8Array) {
		this._requireClique('cliqueSealBlock')

		// Use custom ecsign if provided, otherwise we can't sign in this sync context
		const ecSignFunction = this.common.ethjsCommon.customCrypto?.ecsign
		if (!ecSignFunction) {
			throw new Error('ecsign function must be provided in customCrypto for clique signing')
		}
		const signature = ecSignFunction(this.cliqueSigHash(), privateKey)
		const v = getSignatureV(signature)
		const vBytes = new Uint8Array([Number(v - 27n)])
		// Convert signature r and s to Uint8Array
		const rBytes = toBytes(signature.r)
		const sBytes = toBytes(signature.s)
		const signatureB = concatBytes(rBytes, sBytes, vBytes)

		const extraDataWithoutSeal = this.extraData.subarray(0, this.extraData.length - CLIQUE_EXTRA_SEAL)
		const extraData = concatBytes(extraDataWithoutSeal, signatureB)
		return extraData
	}

	/**
	 * Returns a list of signers
	 * (only clique PoA, throws otherwise)
	 *
	 * This function throws if not called on an epoch
	 * transition block and should therefore be used
	 * in conjunction with {@link BlockHeader.cliqueIsEpochTransition}
	 */
	cliqueEpochTransitionSigners(): EthjsAddress[] {
		this._requireClique('cliqueEpochTransitionSigners')
		if (!this.cliqueIsEpochTransition()) {
			const msg = this._errorMsg('Signers are only included in epoch transition blocks (clique)')
			throw new Error(msg)
		}

		const start = CLIQUE_EXTRA_VANITY
		const end = this.extraData.length - CLIQUE_EXTRA_SEAL
		const signerBytes = this.extraData.subarray(start, end)

		const signerList: Uint8Array[] = []
		const signerLength = 20
		for (let start = 0; start <= signerBytes.length - signerLength; start += signerLength) {
			signerList.push(signerBytes.subarray(start, start + signerLength))
		}
		return signerList.map((buf) => new EthjsAddress(buf))
	}

	/**
	 * Verifies the signature of the block (last 65 bytes of extraData field)
	 * (only clique PoA, throws otherwise)
	 *
	 *  Method throws if signature is invalid
	 */
	cliqueVerifySignature(signerList: EthjsAddress[]): boolean {
		this._requireClique('cliqueVerifySignature')
		const signerAddress = this.cliqueSigner()
		const signerFound = signerList.find((signer) => {
			return signer.equals(signerAddress)
		})
		return !!signerFound
	}

	/**
	 * Returns the signer address
	 */
	cliqueSigner(): EthjsAddress {
		this._requireClique('cliqueSigner')
		const extraSeal = this.cliqueExtraSeal()
		// Reasonable default for default blocks
		if (extraSeal.length === 0 || equalsBytes(extraSeal, new Uint8Array(65))) {
			return createZeroAddress()
		}
		const r = extraSeal.subarray(0, 32)
		const s = extraSeal.subarray(32, 64)
		const v = bytesToBigInt(extraSeal.subarray(64, 65)) + 27n
		const pubKey = ecrecover(this.cliqueSigHash(), v, r, s)
		return createAddressFromPublicKey(pubKey)
	}

	/**
	 * Returns the rlp encoding of the block header.
	 */
	serialize(): Uint8Array {
		return Rlp.encode(this.raw())
	}

	/**
	 * Returns the block header in JSON format.
	 */
	toJSON(): JsonHeader {
		const withdrawalAttr = this.withdrawalsRoot ? { withdrawalsRoot: bytesToHex(this.withdrawalsRoot) } : {}
		const jsonDict: JsonHeader = {
			parentHash: bytesToHex(this.parentHash),
			uncleHash: bytesToHex(this.uncleHash),
			coinbase: this.coinbase.toString(),
			stateRoot: bytesToHex(this.stateRoot),
			transactionsTrie: bytesToHex(this.transactionsTrie),
			...withdrawalAttr,
			receiptTrie: bytesToHex(this.receiptTrie),
			logsBloom: bytesToHex(this.logsBloom),
			difficulty: numberToHex(this.difficulty),
			number: numberToHex(this.number),
			gasLimit: numberToHex(this.gasLimit),
			gasUsed: numberToHex(this.gasUsed),
			timestamp: numberToHex(this.timestamp),
			extraData: bytesToHex(this.extraData),
			mixHash: bytesToHex(this.mixHash),
			nonce: bytesToHex(this.nonce),
		}
		if (this.common.ethjsCommon.isActivatedEIP(1559)) {
			jsonDict.baseFeePerGas = numberToHex(this.baseFeePerGas as bigint)
		}
		if (this.common.ethjsCommon.isActivatedEIP(4844)) {
			jsonDict.blobGasUsed = numberToHex(this.blobGasUsed as bigint)
			jsonDict.excessBlobGas = numberToHex(this.excessBlobGas as bigint)
		}
		if (this.common.ethjsCommon.isActivatedEIP(4788)) {
			jsonDict.parentBeaconBlockRoot = bytesToHex(this.parentBeaconBlockRoot as Uint8Array)
		}
		if (this.common.ethjsCommon.isActivatedEIP(7685)) {
			jsonDict.requestsRoot = bytesToHex(this.requestsRoot as Uint8Array)
		}
		return jsonDict
	}

	/**
	 * Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
	 * activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)
	 */
	protected _validateDAOExtraData() {
		if (this.common.ethjsCommon.hardforkIsActiveOnBlock('dao', this.number) === false) {
			return
		}
		const DAOActivationBlock = this.common.ethjsCommon.hardforkBlock('dao')
		if (DAOActivationBlock === null || this.number < DAOActivationBlock) {
			return
		}
		const DAO_ExtraData = hexToBytes('0x64616f2d686172642d666f726b')
		const DAO_ForceExtraDataRange = BigInt(9)
		const drift = this.number - DAOActivationBlock
		if (drift <= DAO_ForceExtraDataRange && !equalsBytes(this.extraData, DAO_ExtraData)) {
			const msg = this._errorMsg(
				`extraData should be 'dao-hard-fork', got ${bytesToUtf8(this.extraData)} (hex: ${bytesToHex(this.extraData)})`,
			)
			throw new Error(msg)
		}
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
		let errorStr = `block header number=${this.number} hash=${hash} `
		errorStr += `hf=${hf} baseFeePerGas=${this.baseFeePerGas ?? 'none'}`
		return errorStr
	}

	/**
	 * Helper function to create an annotated error message
	 *
	 * @param msg Base error message
	 * @hidden
	 */
	protected _errorMsg(msg: string) {
		return `${msg} (${this.errorStr()})`
	}
}
