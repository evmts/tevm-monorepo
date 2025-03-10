// this file is adapted from https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/service/txpool.ts and thus carries the same license
import {
	BlobEIP4844Transaction,
	Capability,
	isAccessListEIP2930Tx,
	isBlobEIP4844Tx,
	isFeeMarketEIP1559Tx,
	isLegacyTx,
} from '@tevm/tx'
import { EthjsAccount, EthjsAddress, bytesToHex, bytesToUnprefixedHex, equalsBytes } from '@tevm/utils'
import type { Vm } from '@tevm/vm'

import type { Block } from '@tevm/block'
import {
	type FeeMarketEIP1559Transaction,
	type ImpersonatedTx,
	type LegacyTransaction,
	type TypedTransaction,
} from '@tevm/tx'
import type QHeap from 'qheap'
import Heap from 'qheap'

// Configuration constants
const MIN_GAS_PRICE_BUMP_PERCENT = 10
const MIN_GAS_PRICE = BigInt(100000000) // .1 GWei
const TX_MAX_DATA_SIZE = 128 * 1024 // 128KB
const MAX_POOL_SIZE = 5000
const MAX_TXS_PER_ACCOUNT = 100

export interface TxPoolOptions {
	vm: Vm
}

type TxPoolObject = {
	tx: TypedTransaction | ImpersonatedTx
	hash: UnprefixedHash
	added: number
	error?: Error
}

type HandledObject = {
	address: UnprefixedAddress
	added: number
	error?: Error
}

type UnprefixedAddress = string
type UnprefixedHash = string

type GasPrice = {
	tip: bigint
	maxFee: bigint
}

/**
 * @module service
 */

/**
 * @experimental
 * Tx pool (mempool)
 * @memberof module:service
 */
export class TxPool {
	private vm: Vm

	private opened: boolean

	public running: boolean

	/* global NodeJS */
	private _cleanupInterval: Timer | undefined
	private _logInterval: Timer | undefined

	/**
	 * The central pool dataset.
	 *
	 * Maps an address to a `TxPoolObject`
	 */
	public pool: Map<UnprefixedAddress, TxPoolObject[]>

	/**
	 * Transactions in nonce order for all senders
	 */
	public txsInNonceOrder: Map<UnprefixedAddress, TypedTransaction[]> = new Map()

	/**
	 * Transactions by hash
	 */
	public txsByHash: Map<UnprefixedHash, TypedTransaction> = new Map()

	/**
	 * Transactions by account and nonce
	 */
	public txsByNonce: Map<UnprefixedAddress, Map<bigint, TypedTransaction>> = new Map()

	/**
	 * The number of txs currently in the pool
	 */
	public txsInPool: number

	/**
	 * Map for handled tx hashes
	 * (have been added to the pool at some point)
	 *
	 * This is meant to be a superset of the tx pool
	 * so at any point it time containing minimally
	 * all txs from the pool.
	 */
	private handled: Map<UnprefixedHash, HandledObject>

	/**
	 * Activate before chain head is reached to start
	 * tx pool preparation (sorting out included txs)
	 */
	public BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION = 20

	/**
	 * Number of minutes to keep txs in the pool
	 */
	public POOLED_STORAGE_TIME_LIMIT = 20

	/**
	 * Number of minutes to forget about handled
	 * txs (for cleanup/memory reasons)
	 */
	public HANDLED_CLEANUP_TIME_LIMIT = 60

	/**
	 * Create new tx pool
	 * @param options constructor parameters
	 */
	constructor({ vm }: TxPoolOptions) {
		this.vm = vm
		this.pool = new Map<UnprefixedAddress, TxPoolObject[]>()
		this.txsInPool = 0
		this.handled = new Map<UnprefixedHash, HandledObject>()

		this.opened = false
		this.running = true
	}

	deepCopy(opt: TxPoolOptions): TxPool {
		const newTxPool = new TxPool(opt)
		newTxPool.pool = new Map(this.pool)
		newTxPool.txsInPool = this.txsInPool
		newTxPool.handled = new Map(this.handled)
		newTxPool.opened = this.opened
		newTxPool.running = this.running
		return newTxPool
	}

	/**
	 * Open pool
	 */
	open(): boolean {
		if (this.opened) {
			return false
		}
		this.opened = true

		return true
	}

	/**
	 * Start tx processing
	 */
	start(): boolean {
		if (this.running) {
			return false
		}
		this._cleanupInterval = setInterval(this.cleanup.bind(this), this.POOLED_STORAGE_TIME_LIMIT * 1000 * 60)

		this.running = true
		return true
	}

	private validateTxGasBump(existingTx: TypedTransaction | ImpersonatedTx, addedTx: TypedTransaction | ImpersonatedTx) {
		const existingTxGasPrice = this.txGasPrice(existingTx)
		const newGasPrice = this.txGasPrice(addedTx)
		const minTipCap =
			existingTxGasPrice.tip + (existingTxGasPrice.tip * BigInt(MIN_GAS_PRICE_BUMP_PERCENT)) / BigInt(100)

		const minFeeCap =
			existingTxGasPrice.maxFee + (existingTxGasPrice.maxFee * BigInt(MIN_GAS_PRICE_BUMP_PERCENT)) / BigInt(100)
		if (newGasPrice.tip < minTipCap || newGasPrice.maxFee < minFeeCap) {
			throw new Error(
				`replacement gas too low, got tip ${newGasPrice.tip}, min: ${minTipCap}, got fee ${newGasPrice.maxFee}, min: ${minFeeCap}`,
			)
		}

		if (addedTx instanceof BlobEIP4844Transaction && existingTx instanceof BlobEIP4844Transaction) {
			const minblobGasFee =
				existingTx.maxFeePerBlobGas + (existingTx.maxFeePerBlobGas * BigInt(MIN_GAS_PRICE_BUMP_PERCENT)) / BigInt(100)
			if (addedTx.maxFeePerBlobGas < minblobGasFee) {
				throw new Error(`replacement blob gas too low, got: ${addedTx.maxFeePerBlobGas}, min: ${minblobGasFee}`)
			}
		}
	}

	/**
	 * Validates a transaction against the pool and other constraints
	 * @param tx The tx to validate
	 */
	private async validate(
		tx: TypedTransaction | ImpersonatedTx,
		isLocalTransaction = false,
		requireSignature = true,
		skipBalance = false,
	) {
		if (requireSignature && !tx.isSigned()) {
			throw new Error('Attempting to add tx to txpool which is not signed')
		}
		if (tx.data.length > TX_MAX_DATA_SIZE) {
			throw new Error(
				`Tx is too large (${tx.data.length} bytes) and exceeds the max data size of ${TX_MAX_DATA_SIZE} bytes`,
			)
		}
		const currentGasPrice = this.txGasPrice(tx)
		// This is the tip which the miner receives: miner does not want
		// to mine underpriced txs where miner gets almost no fees
		const currentTip = currentGasPrice.tip
		if (!isLocalTransaction) {
			const txsInPool = this.txsInPool
			if (txsInPool >= MAX_POOL_SIZE) {
				throw new Error('Cannot add tx: pool is full')
			}
			// Local txs are not checked against MIN_GAS_PRICE
			if (currentTip < MIN_GAS_PRICE) {
				throw new Error(`Tx does not pay the minimum gas price of ${MIN_GAS_PRICE}`)
			}
		}
		const senderAddress = tx.getSenderAddress()
		const sender: UnprefixedAddress = senderAddress.toString().slice(2).toLowerCase()
		const inPool = this.pool.get(sender)
		if (inPool) {
			if (!isLocalTransaction && inPool.length >= MAX_TXS_PER_ACCOUNT) {
				throw new Error(`Cannot add tx for ${senderAddress}: already have max amount of txs for this account`)
			}
			// Replace pooled txs with the same nonce
			const existingTxn = inPool.find((poolObj) => poolObj.tx.nonce === tx.nonce)
			if (existingTxn) {
				if (equalsBytes(existingTxn.tx.hash(), tx.hash())) {
					throw new Error(`${bytesToHex(tx.hash())}: this transaction is already in the TxPool`)
				}
				this.validateTxGasBump(existingTxn.tx, tx)
			}
		}
		// TODO
		const block = await this.vm.blockchain.getCanonicalHeadBlock()
		if (typeof block.header.baseFeePerGas === 'bigint' && block.header.baseFeePerGas !== 0n) {
			if (currentGasPrice.maxFee < block.header.baseFeePerGas / 2n && !isLocalTransaction) {
				throw new Error(
					`Tx cannot pay basefee of ${block.header.baseFeePerGas}, have ${currentGasPrice.maxFee} (not within 50% range of current basefee)`,
				)
			}
		}
		if (tx.gasLimit > block.header.gasLimit) {
			throw new Error(
				`Tx gaslimit of ${tx.gasLimit} exceeds block gas limit of ${block.header.gasLimit} (exceeds last block gas limit)`,
			)
		}

		// Copy VM in order to not overwrite the state root of the VMExecution module which may be concurrently running blocks
		const vmCopy = await this.vm.deepCopy()
		// TODO We should set state root to latest block so that account balance is correct when doing balance check
		// This should be fixed via abstracting chain history wrt state and blockchain in the new `chain` object
		// await vmCopy.stateManager.setStateRoot(block.stateRoot)
		let account = await vmCopy.stateManager.getAccount(senderAddress)
		if (account === undefined) {
			account = new EthjsAccount()
		}
		if (account.nonce > tx.nonce) {
			throw new Error(
				`0x${sender} tries to send a tx with nonce ${tx.nonce}, but account has nonce ${account.nonce} (tx nonce too low)`,
			)
		}
		const minimumBalance = tx.value + currentGasPrice.maxFee * tx.gasLimit
		if (!skipBalance && account.balance < minimumBalance) {
			throw new Error(
				`0x${sender} does not have enough balance to cover transaction costs, need ${minimumBalance}, but have ${account.balance} (insufficient balance)`,
			)
		}
	}

	/**
	 * Adds a tx to the pool without validating it.
	 *
	 * If there is a tx in the pool with the same address and
	 * nonce it will be replaced by the new tx, if it has a sufficient gas bump.
	 * This also verifies certain constraints, if these are not met, tx will not be added to the pool.
	 * @param tx Transaction
	 * @param isLocalTransaction if this is a local transaction (loosens some constraints) (default: false)
	 */
	async addUnverified(tx: TypedTransaction | ImpersonatedTx) {
		const hash: UnprefixedHash = bytesToUnprefixedHex(tx.hash())
		const added = Date.now()
		const address: UnprefixedAddress = tx.getSenderAddress().toString().slice(2).toLowerCase()
		try {
			let add: TxPoolObject[] = this.pool.get(address) ?? []
			const inPool = this.pool.get(address)
			if (inPool) {
				// Replace pooled txs with the same nonce
				add = inPool.filter((poolObj) => poolObj.tx.nonce !== tx.nonce)
			}
			add.push({ tx, added, hash })
			this.pool.set(address, add)
			this.handled.set(hash, { address, added })
			this.txsInPool++
		} catch (e) {
			this.handled.set(hash, { address, added, error: e as Error })
			throw e
		}
	}

	/**
	 * Adds a tx to the pool.
	 *
	 * If there is a tx in the pool with the same address and
	 * nonce it will be replaced by the new tx, if it has a sufficient gas bump.
	 * This also verifies certain constraints, if these are not met, tx will not be added to the pool.
	 * @param tx Transaction
	 * @param isLocalTransaction if this is a local transaction (loosens some constraints) (default: false)
	 */
	async add(tx: TypedTransaction | ImpersonatedTx, requireSignature = true, skipBalance = false) {
		await this.validate(tx, true, requireSignature, skipBalance)
		return this.addUnverified(tx)
	}

	/**
	 * Returns the available txs from the pool
	 * @param txHashes
	 * @returns Array with tx objects
	 */
	getByHash(txHashes: ReadonlyArray<Uint8Array> | string): Array<TypedTransaction | ImpersonatedTx> | TypedTransaction | ImpersonatedTx | null {
		if (typeof txHashes === 'string') {
			// Single hash case
			const txHashStr = txHashes.startsWith('0x') ? txHashes.slice(2).toLowerCase() : txHashes.toLowerCase()
			const handled = this.handled.get(txHashStr)
			if (!handled) return null
			const inPool = this.pool.get(handled.address)?.filter((poolObj) => poolObj.hash === txHashStr)
			if (inPool && inPool.length === 1) {
				if (!inPool[0]) {
					throw new Error('Expected element to exist in pool')
				}
				return inPool[0].tx
			}
			return null
		} else {
			// Array of hashes case
			const found = []
			for (const txHash of txHashes) {
				const txHashStr = bytesToUnprefixedHex(txHash)
				const handled = this.handled.get(txHashStr)
				if (!handled) continue
				const inPool = this.pool.get(handled.address)?.filter((poolObj) => poolObj.hash === txHashStr)
				if (inPool && inPool.length === 1) {
					if (!inPool[0]) {
						throw new Error('Expected element to exist in pool')
					}
					found.push(inPool[0].tx)
				}
			}
			return found
		}
	}

	/**
	 * Removes the given tx from the pool
	 * @param txHash Hash of the transaction
	 */
	removeByHash(txHash: UnprefixedHash) {
		const handled = this.handled.get(txHash)
		if (!handled) return
		const { address } = handled
		const poolObjects = this.pool.get(address)
		if (!poolObjects) return
		const newPoolObjects = poolObjects.filter((poolObj) => poolObj.hash !== txHash)
		this.txsInPool--
		if (newPoolObjects.length === 0) {
			// List of txs for address is now empty, can delete
			this.pool.delete(address)
		} else {
			// There are more txs from this address
			this.pool.set(address, newPoolObjects)
		}
	}

	/**
	 * Remove txs included in the latest blocks from the tx pool
	 */
	removeNewBlockTxs(newBlocks: Block[]) {
		if (!this.running) return
		for (const block of newBlocks) {
			for (const tx of block.transactions) {
				const txHash: UnprefixedHash = bytesToUnprefixedHex(tx.hash())
				this.removeByHash(txHash)
			}
		}
	}

	/**
	 * Regular tx pool cleanup
	 */
	cleanup() {
		// Remove txs older than POOLED_STORAGE_TIME_LIMIT from the pool
		let compDate = Date.now() - this.POOLED_STORAGE_TIME_LIMIT * 1000 * 60
		for (const [i, mapToClean] of [this.pool].entries()) {
			for (const [key, objects] of mapToClean) {
				const updatedObjects = objects.filter((obj) => obj.added >= compDate)
				if (updatedObjects.length < objects.length) {
					if (i === 0) this.txsInPool -= objects.length - updatedObjects.length
					if (updatedObjects.length === 0) {
						mapToClean.delete(key)
					} else {
						mapToClean.set(key, updatedObjects)
					}
				}
			}
		}

		// Cleanup handled txs
		compDate = Date.now() - this.HANDLED_CLEANUP_TIME_LIMIT * 1000 * 60
		for (const [address, handleObj] of this.handled) {
			if (handleObj.added < compDate) {
				this.handled.delete(address)
			}
		}
	}

	/**
	 * Helper to return a normalized gas price across different
	 * transaction types. Providing the baseFee param returns the
	 * priority tip, and omitting it returns the max total fee.
	 * @param tx The tx
	 * @param baseFee Provide a baseFee to subtract from the legacy
	 * gasPrice to determine the leftover priority tip.
	 */
	private normalizedGasPrice(tx: TypedTransaction | ImpersonatedTx, baseFee?: bigint) {
		const supports1559 = tx.supports(Capability.EIP1559FeeMarket)
		if (typeof baseFee === 'bigint' && baseFee !== 0n) {
			if (supports1559) {
				return (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
			}
			return (tx as LegacyTransaction).gasPrice - baseFee
		}
		if (supports1559) {
			return (tx as FeeMarketEIP1559Transaction).maxFeePerGas
		}
		return (tx as LegacyTransaction).gasPrice
	}
	/**
	 * Returns the GasPrice object to provide information of the tx' gas prices
	 * @param tx Tx to use
	 * @returns Gas price (both tip and max fee)
	 */
	private txGasPrice(tx: TypedTransaction | ImpersonatedTx): GasPrice {
		if ('isImpersonated' in tx && tx.isImpersonated) {
			return {
				maxFee: tx.maxFeePerGas,
				tip: tx.maxPriorityFeePerGas,
			}
		}
		if (isLegacyTx(tx)) {
			return {
				maxFee: tx.gasPrice,
				tip: tx.gasPrice,
			}
		}

		if (isAccessListEIP2930Tx(tx)) {
			return {
				maxFee: tx.gasPrice,
				tip: tx.gasPrice,
			}
		}

		if (isFeeMarketEIP1559Tx(tx) || isBlobEIP4844Tx(tx)) {
			return {
				maxFee: tx.maxFeePerGas,
				tip: tx.maxPriorityFeePerGas,
			}
		}
		throw new Error(`tx of type ${(tx as TypedTransaction).type} unknown`)
	}

	async getBySenderAddress(address: EthjsAddress): Promise<Array<TxPoolObject>> {
		const unprefixedAddress = address.toString().slice(2).toLowerCase()
		return this.pool.get(unprefixedAddress) ?? []
	}

	/**
	 * Returns eligible txs to be mined sorted by price in such a way that the
	 * nonce orderings within a single account are maintained.
	 *
	 * Note, this is not as trivial as it seems from the first look as there are three
	 * different criteria that need to be taken into account (price, nonce, account
	 * match), which cannot be done with any plain sorting method, as certain items
	 * cannot be compared without context.
	 *
	 * This method first sorts the separates the list of transactions into individual
	 * sender accounts and sorts them by nonce. After the account nonce ordering is
	 * satisfied, the results are merged back together by price, always comparing only
	 * the head transaction from each account. This is done via a heap to keep it fast.
	 *
	 * @param baseFee Provide a baseFee to exclude txs with a lower gasPrice
	 */
	async txsByPriceAndNonce({ baseFee, allowedBlobs }: { baseFee?: bigint; allowedBlobs?: number } = {}) {
		const txs: Array<TypedTransaction | ImpersonatedTx> = []
		// Separate the transactions by account and sort by nonce
		const byNonce = new Map<string, Array<TypedTransaction | ImpersonatedTx>>()
		const skippedStats = { byNonce: 0, byPrice: 0, byBlobsLimit: 0 }
		for (const [address, poolObjects] of this.pool) {
			let txsSortedByNonce = poolObjects.map((obj) => obj.tx).sort((a, b) => Number(a.nonce - b.nonce))
			// TODO we should be checking this but removing for now works
			// Check if the account nonce matches the lowest known tx nonce
			// let account = await vm.stateManager.getAccount(new EthjsAddress(hexToBytes(`0x${address}`)))
			// if (account === undefined) {
			// account = new EthjsAccount()
			// }
			// const { nonce } = account
			// if (txsSortedByNonce[0]?.nonce !== nonce) {
			// Account nonce does not match the lowest known tx nonce,
			// therefore no txs from this address are currently executable
			// skippedStats.byNonce += txsSortedByNonce.length
			// console.log('skipped', txsSortedByNonce[0]?.nonce, nonce)
			// continue
			// }
			if (typeof baseFee === 'bigint' && baseFee !== 0n) {
				// If any tx has an insufficient gasPrice,
				// remove all txs after that since they cannot be executed
				const found = txsSortedByNonce.findIndex((tx) => this.normalizedGasPrice(tx) < baseFee)
				if (found > -1) {
					skippedStats.byPrice += found + 1
					txsSortedByNonce = txsSortedByNonce.slice(0, found)
				}
			}
			byNonce.set(address, txsSortedByNonce)
		}
		// Initialize a price based heap with the head transactions
		const byPrice = new Heap({
			comparBefore: (a: TypedTransaction, b: TypedTransaction) =>
				this.normalizedGasPrice(b, baseFee) - this.normalizedGasPrice(a, baseFee) < 0n,
		}) as QHeap<TypedTransaction | ImpersonatedTx>
		for (const [address, txs] of byNonce) {
			if (!txs[0]) {
				continue
			}
			byPrice.insert(txs[0])
			byNonce.set(address, txs.slice(1))
		}
		// Merge by replacing the best with the next from the same account
		let blobsCount = 0
		while (byPrice.length > 0) {
			// Retrieve the next best transaction by price
			const best = byPrice.remove()
			if (best === undefined) break

			// Push in its place the next transaction from the same account
			const address = best.getSenderAddress().toString().slice(2).toLowerCase()
			const accTxs = byNonce.get(address)

			if (!accTxs) {
				throw new Error('Expected accTxs to be defined')
			}

			// Insert the best tx into byPrice if
			//   i) this is not a blob tx,
			//   ii) or there is no blobs limit provided
			//   iii) or blobs are still within limit if this best tx's blobs are included
			if (
				!(best instanceof BlobEIP4844Transaction) ||
				allowedBlobs === undefined ||
				((best as BlobEIP4844Transaction).blobs ?? []).length + blobsCount <= allowedBlobs
			) {
				if (accTxs.length > 0) {
					if (!accTxs[0]) {
						throw new Error('Expected accTxs to be defined')
					}
					byPrice.insert(accTxs[0])
					byNonce.set(address, accTxs.slice(1))
				}
				// Accumulate the best priced transaction and increment blobs count
				txs.push(best)
				if (best instanceof BlobEIP4844Transaction) {
					blobsCount += ((best as BlobEIP4844Transaction).blobs ?? []).length
				}
			} else {
				// Since no more blobs can fit in the block, not only skip inserting in byPrice but also remove all other
				// txs (blobs or not) of this sender address from further consideration
				skippedStats.byBlobsLimit += 1 + accTxs.length
				byNonce.set(address, [])
			}
		}
		return txs
	}

	/**
	 * Stop pool execution
	 */
	stop(): boolean {
		if (!this.running) return false
		clearInterval(this._cleanupInterval as NodeJS.Timeout)
		clearInterval(this._logInterval as NodeJS.Timeout)
		this.running = false
		return true
	}

	/**
	 * Close pool
	 */
	close() {
		this.pool.clear()
		this.handled.clear()
		this.txsInPool = 0
		this.opened = false
	}

	_logPoolStats() {
		let broadcasts = 0
		let broadcasterrors = 0
		if (this.txsInPool > 0) {
			broadcasts = broadcasts / this.txsInPool
			broadcasterrors = broadcasterrors / this.txsInPool
		}

		let handledadds = 0
		let handlederrors = 0
		for (const handledobject of this.handled.values()) {
			if (handledobject.error === undefined) {
				handledadds++
			} else {
				handlederrors++
			}
		}
	}
}
