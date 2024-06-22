import { InternalError } from '@tevm/errors'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'

/**
 * @internal
 * Prepares the VM for a call given a block tag. This includes
 * - Cloning the VM
 * - Setting the state root
 * - Setting the fork transport if the block is in the past
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/block').Block} block
 * @returns {Promise<import('@tevm/vm').Vm | {errors: InternalError[]}>} VM or errors
 * @throws {never} returns errors as values
 */
export const cloneVmWithBlockTag = async (client, block) => {
	try {
		client.logger.debug('Cloning vm to execute a call...')
		const vm = await client.getVm().then((vm) => vm.deepCopy())

		// TODO why doesn't this type have stateRoot prop? It is always there.
		// Haven't looked into it so it might be a simple fix.
		/**
		 * @type {Uint8Array}
		 */
		const stateRoot = /** @type any*/ (block.header).stateRoot
		if (client.forkTransport && !(await vm.stateManager.hasStateRoot(stateRoot))) {
			forkAndCacheBlock(client, /** @type any*/ (block))
		}
		await vm.stateManager.setStateRoot(stateRoot)
		// if we are forking we need to update the block tag we are forking if the block is in past
		const forkBlock = vm.blockchain.blocksByTag.get('forked')
		if (client.forkTransport && forkBlock !== undefined && block.header.number < forkBlock.header.number) {
			vm.stateManager._baseState.options.fork = {
				transport: client.forkTransport,
				blockTag: block.header.number,
			}
			vm.blockchain.blocksByTag.set('forked', /** @type {any} */ (block))
		}
		return vm
	} catch (e) {
		return {
			errors: [
				new InternalError(
					typeof e === 'string'
						? e
						: e instanceof Error
							? e.message
							: typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string'
								? e.message
								: 'unknown error',

					{
						cause: /** @type {Error}*/ (e),
					},
				),
			],
		}
	}
}
