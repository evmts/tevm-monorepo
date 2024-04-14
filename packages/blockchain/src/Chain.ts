import { LevelDB } from './LevelDb.js'
import {
	Blockchain,
	CasperConsensus,
	CliqueConsensus,
	type Consensus,
	EthashConsensus,
} from '@ethereumjs/blockchain'
// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { Block, BlockHeader } from '@tevm/block'
import { Common, ConsensusAlgorithm } from '@tevm/common'
import {
	type Db,
	type DbObject,
	type GenesisState,
	equalsBytes,
} from '@tevm/utils'

import type { AbstractLevel } from 'abstract-level'

/**
 * The options that the Blockchain constructor can receive.
 */
export interface ChainOptions {
	/**
	 * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
	 */
	db?: AbstractLevel<
		string | Uint8Array,
		string | Uint8Array,
		string | Uint8Array
	>

	common: Common

	genesisState?: GenesisState

	genesisStateRoot?: Uint8Array
}

/**
 * Returns properties of the canonical blockchain.
 */
export interface ChainBlocks {
	/**
	 * The latest block in the chain
	 */
	latest: Block | null

	/**
	 * The block as signalled `finalized` in the fcU
	 * This corresponds to the last finalized beacon block
	 */
	finalized: Block | null

	/**
	 * The block as signalled `safe` in the fcU
	 * This corresponds to the last justified beacon block
	 */
	safe: Block | null

	/**
	 * The header signalled as `vm` head
	 * This corresponds to the last executed block in the canonical chain
	 */
	vm: Block | null

	/**
	 * The total difficulty of the blockchain
	 */
	td: bigint

	/**
	 * The height of the blockchain
	 */
	height: bigint
}

/**
 * Returns properties of the canonical headerchain.
 */
export interface ChainHeaders {
	/**
	 * The latest header in the chain
	 */
	latest: BlockHeader | null

	/**
	 * The header as signalled `finalized` in the fcU
	 * This corresponds to the last finalized beacon block
	 */
	finalized: BlockHeader | null

	/**
	 * The header as signalled `safe` in the fcU
	 * This corresponds to the last justified beacon block
	 */
	safe: BlockHeader | null

	/**
	 * The header signalled as `vm` head
	 * This corresponds to the last executed block in the canonical chain
	 */
	vm: BlockHeader | null

	/**
	 * The total difficulty of the headerchain
	 */
	td: bigint

	/**
	 * The height of the headerchain
	 */
	height: bigint
}

type BlockCache = {
	remoteBlocks: Map<String, Block>
	executedBlocks: Map<String, Block>
	invalidBlocks: Map<String, Error>
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
export class Chain implements Pick<
	Blockchain,
	| 'consensus'
	| 'db'
	| 'genesisBlock'
	| 'getCanonicalHeadHeader'
	| 'getIteratorHead'
	| 'getIteratorHeadSafe'
	| 'getCanonicalHeadBlock'
	| 'getCanonicalHeadHeader'
	| 'getParentTD'
	| 'getBlock'
	| 'getTotalDifficulty'
	| 'checkAndTransitionHardForkByNumber'
	| 'putBlock'
	| 'putHeader'
> {
	public readonly shallowCopy = (): Chain => {
		return new Chain({
			db: this.db.shallowCopy() as any,
			common: this.common,
			...(this._customGenesisState !== undefined ? { genesisState: this._customGenesisState } : {}),
			...(this._customGenesisStateRoot !== undefined ? { genesisStateRoot: this._customGenesisStateRoot } : {}),
		})
	}
	public common: Common
	public db: Db<string | Uint8Array, string | Uint8Array | DbObject>
	/**
	 * Validates a block header, throwing if invalid.
	 * @warning currently stubbed to noop
	 * @param header - header to be validated
	 * @param height - If this is an uncle header, this is the height of the block that is including it
	 */
	public async validateHeader() {
		// stub
	}
	consensus: Consensus
	public blockCache: BlockCache
	public _customGenesisState?: GenesisState | undefined
	public _customGenesisStateRoot?: Uint8Array | undefined

	public opened: boolean

	private _headers: ChainHeaders = {
		latest: null,
		finalized: null,
		safe: null,
		vm: null,
		td: BigInt(0),
		height: BigInt(0),
	}

	private _blocks: ChainBlocks = {
		latest: null,
		finalized: null,
		safe: null,
		vm: null,
		td: BigInt(0),
		height: BigInt(0),
	}

	/**
	 * Safe creation of a Chain object awaiting the initialization
	 * of the underlying Blockchain object.
	 *
	 * @param options
	 */
	public static async create(options: ChainOptions) {
		return new this(options)
	}

	/**
	 * Creates new chain
	 *
	 * Do not use directly but instead use the static async `create()` constructor
	 * for concurrency safe initialization.
	 *
	 * @param options
	 */
	protected constructor(options: ChainOptions) {
		this.common = options.common
		this.blockCache = {
			remoteBlocks: new Map(),
			executedBlocks: new Map(),
			invalidBlocks: new Map(),
		}
		this.db = new LevelDB(options.db)
		this._customGenesisState = options.genesisState
		this._customGenesisStateRoot = options.genesisStateRoot
		this.opened = false
		switch (this.common.consensusAlgorithm()) {
			case ConsensusAlgorithm.Casper:
				this.consensus = new CasperConsensus()
				break
			case ConsensusAlgorithm.Clique:
				this.consensus = new CliqueConsensus()
				break
			case ConsensusAlgorithm.Ethash:
				this.consensus = new EthashConsensus()
				break
			default:
				throw new Error(
					`consensus algorithm ${this.common.consensusAlgorithm()} not supported`,
				)
		}
	}
	checkAndTransitionHardForkByNumber(number: bigint, td?: bigint | undefined, timestamp?: bigint | undefined): Promise<void> {
		console.log(number, td, timestamp)
		throw new Error('Method not implemented.')
	}
	get genesisBlock(): Block {
		throw new Error('Method not implemented.')
	}
	getIteratorHead(name?: string | undefined): Promise<Block> {
		console.log(name)
		throw new Error('Method not implemented.')
	}
	getIteratorHeadSafe(name?: string | undefined): Promise<Block | undefined> {
		console.log(name)
		throw new Error('Method not implemented.')
	}
	getParentTD(header: BlockHeader): Promise<bigint> {
		console.log(header)
		throw new Error('Method not implemented.')
	}
	getTotalDifficulty(hash: Uint8Array, number?: bigint | undefined): Promise<bigint> {
		console.log(hash, number)
		throw new Error('Method not implemented.')
	}
	putBlock(block: Block): Promise<void> {
		console.log(block)
		throw new Error('Method not implemented.')
	}
	putHeader(header: BlockHeader): Promise<void> {
		console.log(header)
		throw new Error('Method not implemented.')
	}

	/**
	 * Resets _header, _blocks
	 */
	private reset() {
		this._headers = {
			latest: null,
			finalized: null,
			safe: null,
			vm: null,
			td: BigInt(0),
			height: BigInt(0),
		}
		this._blocks = {
			latest: null,
			finalized: null,
			safe: null,
			vm: null,
			td: BigInt(0),
			height: BigInt(0),
		}
	}

	/**
	 * Network ID
	 *ssj
	get networkId(): bigint {
		return this.common.networkId()
	}

	/**
	 * Genesis block for the chain
	 */
	get genesis() {
		return this.genesisBlock
	}

	/**
	 * Returns properties of the canonical headerchain.
	 */
	get headers(): ChainHeaders {
		return { ...this._headers }
	}

	/**
	 * Returns properties of the canonical blockchain.
	 */
	get blocks(): ChainBlocks {
		return { ...this._blocks }
	}

	/**
	 * Open blockchain and wait for database to load
	 * @returns false if chain is already open, otherwise void
	 */
	async open(): Promise<boolean | void> {
		if (this.opened) return false
		await this.db.open()
		this.opened = true
		await this.update()
	}

	/**
	 * Closes chain
	 * @returns false if chain is closed, otherwise void
	 */
	async close(): Promise<boolean | void> {
		if (!this.opened) return false
		this.reset()
		await (this.db as any)?.close?.()
		this.opened = false
	}

	/**
	 * Resets the chain to canonicalHead number
	 */
	async resetCanonicalHead(canonicalHead: bigint): Promise<void> {
		if (!this.opened) return
		await this.resetCanonicalHead(canonicalHead)
		this.update()
	}

	/**
	 * Update blockchain properties (latest block, td, height, etc...)
	 * @param emit Emit a `CHAIN_UPDATED` event
	 * @returns false if chain is closed, otherwise void
	 */
	async update(): Promise<boolean | void> {
		if (!this.opened) return false

		const headers: ChainHeaders = {
			latest: null,
			finalized: null,
			safe: null,
			vm: null,
			td: BigInt(0),
			height: BigInt(0),
		}
		const blocks: ChainBlocks = {
			latest: null,
			finalized: null,
			safe: null,
			vm: null,
			td: BigInt(0),
			height: BigInt(0),
		}

		blocks.latest = await this.getCanonicalHeadBlock()
		blocks.finalized = (await this.getCanonicalFinalizedBlock()) ?? null
		blocks.safe = (await this.getCanonicalSafeBlock()) ?? null
		blocks.vm = await this.getCanonicalVmHead()

		headers.latest = await this.getCanonicalHeadHeader()
		// finalized and safe are always blocks since they have to have valid execution
		// before they can be saved in chain
		headers.finalized = blocks.finalized?.header ?? null
		headers.safe = blocks.safe?.header ?? null
		headers.vm = blocks.vm.header

		headers.height = headers.latest.number
		blocks.height = blocks.latest.header.number

		headers.td = await this.getTd(headers.latest.hash(), headers.height)
		blocks.td = await this.getTd(blocks.latest.hash(), blocks.height)

		this._headers = headers
		this._blocks = blocks

		const parentTd = await this.getParentTD(headers.latest)
		this.common.setHardforkBy({
			blockNumber: headers.latest.number,
			td: parentTd,
			timestamp: headers.latest.timestamp,
		})
	}

	/**
	 * Get blocks from blockchain
	 * @param block hash or number to start from
	 * @param max maximum number of blocks to get
	 * @param skip number of blocks to skip
	 * @param reverse get blocks in reverse
	 * @returns an array of the blocks
	 */
	async getBlocks(
		block: Uint8Array | bigint,
		max = 1,
		skip = 0,
		reverse = false,
	): Promise<Block[]> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getBlocks(block, max, skip, reverse)
	}

	/**
	 * Get a block by its hash or number
	 * @param block block hash or number
	 * @throws if block is not found
	 */
	async hasBlock(block: Uint8Array | bigint): Promise<boolean> {
		if (!this.opened) throw new Error('Chain closed')
		return this
			.getBlock(block)
			.then(() => true)
			.catch(() => false)
	}

	/**
	 * Get a block by its hash or number
	 * @param block block hash or number
	 * @throws if block is not found
	 */
	async getBlock(block: Uint8Array | bigint): Promise<Block> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getBlock(block)
	}

	/**
	 * Insert new blocks into blockchain
	 * @param blocks list of blocks to add
	 * @param fromEngine pass true to process post-merge blocks, otherwise they will be skipped
	 */
	async putBlocks(blocks: Block[], fromEngine = false): Promise<void> {
		if (!this.opened) throw new Error('Chain closed')
		if (blocks.length === 0) return

		let numAdded = 0
		// filter out finalized blocks
		const newBlocks = []
		for (const block of blocks) {
			if (
				this.headers.finalized !== null &&
				block.header.number <= this.headers.finalized.number
			) {
				const canonicalBlock = await this.getBlock(block.header.number)
				if (!equalsBytes(canonicalBlock.hash(), block.hash())) {
					throw Error(
						`Invalid putBlock for block=${block.header.number} before finalized=${this.headers.finalized.number}`,
					)
				}
			} else {
				newBlocks.push(block)
			}
		}

		for (const [i, b] of newBlocks.entries()) {
			if (!fromEngine && this.common.gteHardfork('paris')) {
				if (i > 0) {
					// emitOnLast below won't be reached, so run an update here
					await this.update()
				}
				break
			}

			const td = await this.getParentTD(b.header)
			if (b.header.number <= this.headers.height) {
				await this.checkAndTransitionHardForkByNumber(
					b.header.number,
					td,
					b.header.timestamp,
				)
				await this.consensus.setup({ blockchain: this })
			}

			const block = Block.fromValuesArray(b.raw(), {
				common: this.common,
				setHardfork: td,
			})

			await this.putBlock(block)
			numAdded++
			await this.update()
		}
		return
	}

	/**
	 * Get headers from blockchain
	 * @param block hash or number to start from
	 * @param max maximum number of headers to get
	 * @param skip number of headers to skip
	 * @param reverse get headers in reverse
	 * @returns list of block headers
	 */
	async getHeaders(
		block: Uint8Array | bigint,
		max: number,
		skip: number,
		reverse: boolean,
	): Promise<BlockHeader[]> {
		const blocks = await this.getBlocks(block, max, skip, reverse)
		return blocks.map((b) => b.header)
	}

	/**
	 * Insert new headers into blockchain
	 * @param headers
	 * @param mergeIncludes skip adding headers after merge
	 * @returns number of headers added
	 */
	async putHeaders(
		headers: BlockHeader[],
		mergeIncludes = false,
	): Promise<void> {
		if (!this.opened) throw new Error('Chain closed')
		if (headers.length === 0) return

		let numAdded = 0
		for (const [i, h] of headers.entries()) {
			if (!mergeIncludes && this.common.gteHardfork('paris')) {
				if (i > 0) {
					// emitOnLast below won't be reached, so run an update here
					await this.update()
				}
				break
			}
			const header = BlockHeader.fromValuesArray(h.raw(), {
				common: this.common,
				setHardfork: this.headers.td,
			})
			await this.putHeader(header)
			numAdded++
			await this.update()
		}
		return
	}

	/**
	 * Gets the latest header in the canonical chain
	 */
	async getCanonicalHeadHeader(): Promise<BlockHeader> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getCanonicalHeadHeader()
	}

	/**
	 * Gets the latest block in the canonical chain
	 */
	async getCanonicalHeadBlock(): Promise<Block> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getCanonicalHeadBlock()
	}

	/**
	 * Gets the latest block in the canonical chain
	 */
	async getCanonicalSafeBlock(): Promise<Block | undefined> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getIteratorHeadSafe('safe')
	}

	/**
	 * Gets the latest block in the canonical chain
	 */
	async getCanonicalFinalizedBlock(): Promise<Block | undefined> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getIteratorHeadSafe('finalized')
	}

	/**
	 * Gets the latest block in the canonical chain
	 */
	async getCanonicalVmHead(): Promise<Block> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getIteratorHead()
	}

	/**
	 * Gets total difficulty for a block
	 * @param hash the block hash
	 * @param num the block number
	 * @returns the td
	 */
	async getTd(hash: Uint8Array, num: bigint): Promise<bigint> {
		if (!this.opened) throw new Error('Chain closed')
		return this.getTotalDifficulty(hash, num)
	}
}
