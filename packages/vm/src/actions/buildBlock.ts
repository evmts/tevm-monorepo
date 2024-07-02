import type { BaseVm } from '../BaseVm.js'
import type { BuildBlockOpts } from '../utils/index.js'
import { BlockBuilder } from './BlockBuilder.js'

export type BuildBlock = (opts: BuildBlockOpts) => Promise<BlockBuilder>

export const buildBlock =
	(vm: BaseVm): BuildBlock =>
	async (opts) => {
		await vm.ready()
		const blockBuilder = new BlockBuilder(vm, opts)
		await blockBuilder.initState()
		return blockBuilder
	}
