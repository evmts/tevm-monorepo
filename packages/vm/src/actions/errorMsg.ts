import type { Block } from '@tevm/block'
import type { BaseVm } from '../BaseVm.js'

/**
 * Internal helper function to create an annotated error message
 *
 * @param msg Base error message
 * @hidden
 */
export function errorMsg(msg: string, vm: BaseVm, block: Block) {
	const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'

	const errorMsg = `${msg} (${vm.common.vmConfig.hardfork.name} -> ${blockErrorStr})`
	return errorMsg
}
