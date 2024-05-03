import { buildBlock } from './actions/buildBlock.js'
import { deepCopy } from './actions/deepCopy.js'
import { runBlock } from './actions/runBlock.js'
import { runTx } from './actions/runTx.js'
import { createBaseVm } from './createBaseVm.js'

/**
 * @param {import("./VmOpts.js").VmOpts} opts
 * @returns {import("./Vm.js").Vm}
 */
export const createVm = (opts) => {
	const baseVm = createBaseVm(opts)

	/**
	 * @param {import("./BaseVm.js").BaseVm} baseVm
	 */
	const decorate = (baseVm) => {
		return {
			...baseVm,
			deepCopy: () => deepCopy(baseVm)().then((baseVm) => decorate(baseVm)),
			buildBlock: buildBlock(baseVm),
			runBlock: runBlock(baseVm),
			runTx: runTx(baseVm),
		}
	}

	return decorate(baseVm)
}
