import { createChain } from '@tevm/blockchain'
import { createStateManager } from '@tevm/state'
import { bytesToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/block').Block} block
 * @returns {import('@tevm/utils').Hex}
 */
const getBlockHash = (block) => {
	const jsonRpcHash = /** @type {{ __tevmJsonRpcBlockHash?: unknown }} */ (block).__tevmJsonRpcBlockHash
	return typeof jsonRpcHash === 'string' ? /** @type {import('@tevm/utils').Hex} */ (jsonRpcHash) : bytesToHex(block.hash())
}

/**
 * Rebuilds fork-backed blockchain and state manager data after a fork reset or URL change.
 * @param {import('@tevm/node').TevmNode} node
 * @param {import('@tevm/utils').BlockTag | bigint} [blockTag]
 * @returns {Promise<{ vm: import('@tevm/vm').Vm, blockchain: import('@tevm/blockchain').Chain } | undefined>}
 */
export const resetForkState = async (node, blockTag) => {
	if (!node.forkTransport) {
		return undefined
	}
	const vm = await node.getVm()
	const currentFork = vm.stateManager._baseState.options.fork ?? vm.blockchain.options.fork
	if (!currentFork?.transport) {
		return undefined
	}

	const currentForkedBlock = vm.blockchain.blocksByTag.get('forked')
	const forkBlockTag = blockTag ?? (currentForkedBlock ? getBlockHash(currentForkedBlock) : currentFork.blockTag ?? 'latest')
	const blockchain = await createChain({
		common: vm.common,
		loggingLevel: /** @type {any} */ (node.logger.level),
		fork: {
			...currentFork,
			transport: node.forkTransport,
			blockTag: forkBlockTag,
		},
	})
	await blockchain.ready()

	const forkedBlock = /** @type {import('@tevm/block').Block} */ (
		blockchain.blocksByTag.get('forked') ?? (await blockchain.getCanonicalHeadBlock())
	)
	const stateRoot = bytesToHex(forkedBlock.header.stateRoot)
	const oldOptions = vm.stateManager._baseState.options
	const genesisState = oldOptions.genesisState ?? {}
	const stateManager = createStateManager({
		...oldOptions,
		currentStateRoot: stateRoot,
		stateRoots: new Map([[stateRoot, genesisState]]),
		genesisState,
		fork: {
			...currentFork,
			transport: node.forkTransport,
			blockTag: forkedBlock.header.number,
			blockHash: getBlockHash(forkedBlock),
		},
	})
	await stateManager.ready()

	vm.stateManager = /** @type {any} */ (stateManager)
	vm.evm.stateManager = /** @type {any} */ (stateManager)
	vm.blockchain = blockchain
	vm.evm.blockchain = blockchain

	return { vm, blockchain }
}
