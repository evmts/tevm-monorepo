import { createStateManager } from '@tevm/state'

/**
 * Will fork a given block number and save the state roots to state manager
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/block').Block} block
 * @returns {Promise<void>}
 */
export const forkAndCacheBlock = async (client, block) => {
	client.logger.warn('Past blocks in forked mode is still experimental...')
	client.logger.warn(`Detected block tag for a call was set to a different block tag than the chain was forked from. 
Tevm can peform slowly when this happens from needing to process that blocks entire transaction list.
This will be fixed in future versions.`)
	client.logger.debug('Forking a new block based on block tag...')
	// if no state root fork the block with a fresh state manager
	const vm = await client.getVm()
	const evm = vm.evm.shallowCopy()
	// this can't happen making ts happy
	if (!client.forkUrl) {
		throw new Error('Cannot fork without a fork url')
	}
	const stateManager = createStateManager({
		...vm.evm.stateManager._baseState.options,
		fork: {
			url: client.forkUrl,
			blockTag: block.header.number,
		},
	})
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
	vm.stateManager.saveStateRoot(block.header.stateRoot, await stateManager.dumpCanonicalGenesis())
}
