import { ForkError, InternalError } from '@tevm/errors'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'

/**
 * @internal
 * Prepares the VM for a call given a block tag. This includes
 * - Cloning the VM
 * - Setting the state root
 * - Setting the fork transport if the block is in the past
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/block').Block} block
 * @returns {Promise<import('@tevm/vm').Vm | ForkError | InternalError>} VM or errors
 * @throws {never} returns errors as values
 */
export const cloneVmWithBlockTag = async (client, block) => {
	// 33-37,48-49
	try {
		client.logger.debug('Preparing vm to execute a call with block...')
		const originalVm = await client.getVm()
		if (client.forkTransport && !(await originalVm.stateManager.hasStateRoot(block.header.stateRoot))) {
			return await forkAndCacheBlock(client, block).catch((e) => {
				return new ForkError(e instanceof Error ? e.message : 'Unknown error', { cause: e })
			})
		}
		const vm = await originalVm.deepCopy()
		await vm.stateManager.setStateRoot(block.header.stateRoot)
		return vm
	} catch (e) {
		return new InternalError(e instanceof Error ? e.message : 'unknown error', {
			cause: /** @type {Error}*/ (e),
		})
	}
}
