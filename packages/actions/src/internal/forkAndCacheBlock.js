import { InternalError } from '@tevm/errors'
import { createStateManager } from '@tevm/state'

/**
 * Will fork a given block number and save the state roots to state manager
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/block').Block} block
 * @param {boolean} [executeBlock=false]
 * @returns {Promise<void>}
 */
export const forkAndCacheBlock = async (client, block, executeBlock = false) => {
	client.logger.debug('Forking a new block based on block tag...')
	// if no state root fork the block with a fresh state manager
	const vm = await client.getVm()
	// this can't happen making ts happy
	if (!client.forkTransport) {
		throw new InternalError('Cannot forkAndCacheBlock without a fork url')
	}
	const stateManager = createStateManager({
		...vm.evm.stateManager._baseState.options,
		fork: {
			transport: client.forkTransport,
			blockTag: block.header.number,
		},
	})
	if (executeBlock) {
		const evm = vm.evm.shallowCopy()
		// TODO this type is too narrow
		evm.stateManager = /** @type any*/ (stateManager)
		const transactions = /** @type {import('@tevm/block').Block}*/ (block).transactions
		client.logger.debug({ count: transactions.length }, 'Processing transactions')
		await Promise.all(
			transactions.map(async (tx, i) => {
				client.logger.debug({ txNumber: i, tx }, 'Processing transaction')
				await evm.runCall(tx)
			}),
		)
		client.logger.debug('Finished processing block transactions and saving state root')
	}
	vm.stateManager.saveStateRoot(block.header.stateRoot, await stateManager.dumpCanonicalGenesis())
}
