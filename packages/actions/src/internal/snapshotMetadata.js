import { createMapDb } from '@evmts/zevm/receipt-manager'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {import('@evmts/zevm/txpool').TxPool} txPool
 */
export const clearTxPool = async (txPool) => {
	if (typeof txPool.clear === 'function') {
		await txPool.clear()
	} else {
		const txs = await txPool.txsByPriceAndNonce()
		for (const tx of txs) {
			txPool.removeByHash(bytesToHex(tx.hash()))
		}
	}
	const txPoolAny = /** @type {any} */ (txPool)
	txPoolAny.handled?.clear?.()
}

/**
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/vm').Vm} vm
 * @returns {Promise<import('@tevm/node').SnapshotMetadata>}
 */
export const captureSnapshotMetadata = async (client, vm) => {
	const txPool = await client.getTxPool()
	const txs =
		typeof txPool.getPendingTransactions === 'function'
			? await txPool.getPendingTransactions()
			: await txPool.txsByPriceAndNonce()
	const receiptManager = await client.getReceiptsManager()
	const receiptEntries = [.../** @type {Map<any, any>} */ (receiptManager.mapDb?._cache ?? new Map()).entries()]
	/** @type {import('@tevm/node').SnapshotMetadata} */
	const metadata = {
		version: 1,
		autoImpersonate: client.getAutoImpersonate(),
		blockchain: {
			blocks: [.../** @type {Map<any, any>} */ (vm.blockchain.blocks ?? new Map()).entries()],
			blocksByNumber: [.../** @type {Map<any, any>} */ (vm.blockchain.blocksByNumber ?? new Map()).entries()],
			blocksByTag: [.../** @type {Map<any, any>} */ (vm.blockchain.blocksByTag ?? new Map()).entries()],
		},
		miningConfig: client.miningConfig,
		receiptEntries,
		txHashes: txs.map((tx) => bytesToHex(tx.hash())),
		txPoolTransactions: txs,
	}
	const impersonatedAccount = client.getImpersonatedAccount()
	if (impersonatedAccount !== undefined) metadata.impersonatedAccount = impersonatedAccount
	const nextBlockTimestamp = client.getNextBlockTimestamp()
	if (nextBlockTimestamp !== undefined) metadata.nextBlockTimestamp = nextBlockTimestamp
	const nextBlockGasLimit = client.getNextBlockGasLimit()
	if (nextBlockGasLimit !== undefined) metadata.nextBlockGasLimit = nextBlockGasLimit
	const nextBlockBaseFeePerGas = client.getNextBlockBaseFeePerGas()
	if (nextBlockBaseFeePerGas !== undefined) metadata.nextBlockBaseFeePerGas = nextBlockBaseFeePerGas
	const nextBlockPrevRandao = client.getNextBlockPrevRandao()
	if (nextBlockPrevRandao !== undefined) metadata.nextBlockPrevRandao = nextBlockPrevRandao
	const minGasPrice = client.getMinGasPrice()
	if (minGasPrice !== undefined) metadata.minGasPrice = minGasPrice
	const blockTimestampInterval = client.getBlockTimestampInterval()
	if (blockTimestampInterval !== undefined) metadata.blockTimestampInterval = blockTimestampInterval
	return metadata
}

/**
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/node').TevmSnapshot} snapshot
 * @param {import('@tevm/vm').Vm} vm
 */
export const restoreSnapshotState = async (client, snapshot, vm) => {
	const snapshotStateRoot =
		typeof snapshot.stateRoot === 'string'
			? snapshot.stateRoot
			: bytesToHex(/** @type {Uint8Array} */ (snapshot.stateRoot ?? new Uint8Array()))
	if (!snapshot.state || typeof snapshotStateRoot !== 'string' || !snapshotStateRoot.startsWith('0x')) {
		throw new Error('Invalid snapshot payload')
	}

	vm.stateManager.saveStateRoot(
		/** @type {any} */ (Uint8Array.from(Buffer.from(snapshotStateRoot.slice(2), 'hex'))),
		snapshot.state,
	)
	await vm.stateManager.setStateRoot(
		/** @type {any} */ (Uint8Array.from(Buffer.from(snapshotStateRoot.slice(2), 'hex'))),
	)

	if (snapshot.blockchain !== undefined) {
		const blockchain = /** @type {any} */ (vm.blockchain)
		blockchain.blocks = new Map(snapshot.blockchain.blocks)
		blockchain.blocksByNumber = new Map(snapshot.blockchain.blocksByNumber)
		blockchain.blocksByTag = new Map(snapshot.blockchain.blocksByTag)
	}

	if (snapshot.impersonatedAccount) {
		client.setImpersonatedAccount(snapshot.impersonatedAccount)
	} else {
		client.setImpersonatedAccount(undefined)
	}
	client.setAutoImpersonate(Boolean(snapshot.autoImpersonate))
	client.miningConfig = snapshot.miningConfig ?? client.miningConfig
	client.setNextBlockTimestamp(
		snapshot.nextBlockTimestamp !== undefined ? BigInt(snapshot.nextBlockTimestamp) : undefined,
	)
	client.setNextBlockGasLimit(snapshot.nextBlockGasLimit !== undefined ? BigInt(snapshot.nextBlockGasLimit) : undefined)
	client.setNextBlockBaseFeePerGas(
		snapshot.nextBlockBaseFeePerGas !== undefined ? BigInt(snapshot.nextBlockBaseFeePerGas) : undefined,
	)
	client.setNextBlockPrevRandao(
		snapshot.nextBlockPrevRandao !== undefined ? BigInt(snapshot.nextBlockPrevRandao) : undefined,
	)
	client.setMinGasPrice(snapshot.minGasPrice !== undefined ? BigInt(snapshot.minGasPrice) : undefined)
	client.setBlockTimestampInterval(
		snapshot.blockTimestampInterval !== undefined ? BigInt(snapshot.blockTimestampInterval) : undefined,
	)

	const txPool = await client.getTxPool()
	await clearTxPool(txPool)
	for (const tx of snapshot.txPoolTransactions ?? []) {
		await txPool.addUnverified(/** @type {any} */ (tx))
	}

	const receiptManager = /** @type {any} */ (await client.getReceiptsManager())
	const receiptCache = /** @type {Map<`0x${string}`, Uint8Array>} */ (new Map(snapshot.receiptEntries ?? []))
	/** @type {any} */
	receiptManager.mapDb = createMapDb({ cache: receiptCache })
	if (snapshot.blockchain !== undefined) {
		/** @type {any} */
		receiptManager.chain = vm.blockchain
	}
}
