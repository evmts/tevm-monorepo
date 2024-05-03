import { deepCopy } from "./actions/deepCopy.js"
import { createBaseVm } from "./createBaseVm.js"

/**
 * @param {import("./VmOpts.js").VmOpts} opts
 * @returns {Vm}
 */
export const createVm = (opts) => {
  const baseVm = createBaseVm(opts)

  /**
   * @param {import("./actions/deepCopy.js").BaseVm} baseVm
   */
  const decorate = (baseVm) => {
    return {
      ...baseVm,
      deepCopy: deepCopy(baseVm),
    }
  }

  return decorate(baseVm)
}
