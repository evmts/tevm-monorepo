import { createChain } from '@tevm/blockchain'
import { InternalError } from '@tevm/errors'
import { createStateManager } from '@tevm/state'

// TODO this belongs in vm package actually but it's fine here for now

/**
 * Will fork a given block number and save the state roots to state manager
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/block').Block} block
 * @param {boolean} [executeBlock=false]
 * @returns {Promise<import('@tevm/vm').Vm>} A vm that forks the given block
 */
export const forkAndCacheBlock = async (client, block, executeBlock = false) => {
	client.logger.debug('Forking a new block based on block tag...')
	// if no state root fork the block with a fresh state manager
	const vm = await client.getVm().then((vm) => vm.deepCopy())
	// this can't happen making ts happy
	if (!client.forkTransport) {
		throw new InternalError('Cannot forkAndCacheBlock without a fork url')
	}

	vm.stateManager = createStateManager({
		...vm.evm.stateManager._baseState.options,
		fork: {
			transport: client.forkTransport,
			blockTag: block.header.number,
		},
	})
	vm.evm.stateManager = vm.stateManager

	vm.blockchain = await createChain({
		fork: {
			transport: client.forkTransport,
			blockTag: block.header.number,
		},
		common: vm.common,
		// TODO silent not being in this type is a bug
		loggingLevel: /** @type {any}*/ (client.logger.level),
	})
	vm.evm.blockchain = vm.blockchain

	await Promise.all([vm.stateManager.ready(), vm.blockchain.ready()])

	if (executeBlock) {
		const transactions = /** @type {import('@tevm/block').Block}*/ (block).transactions
		client.logger.debug({ count: transactions.length }, 'Processing transactions')
		await Promise.all(
			transactions.map(async (tx, i) => {
				client.logger.debug({ txNumber: i, tx }, 'Processing transaction')
				await vm.evm.shallowCopy().runCall(tx)
			}),
		)

		client.logger.debug('Finished processing block transactions and saving state root')
	}

	vm.stateManager.saveStateRoot(block.header.stateRoot, await vm.stateManager.dumpCanonicalGenesis())

	return vm
}
