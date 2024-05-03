import type { BaseVm } from "./BaseVm.js"
import type { BuildBlock } from "./actions/buildBlock.js"
import type { DeepCopy } from "./actions/deepCopy.js"
import type { RunBlock } from "./actions/runBlock.js"

export type Vm = BaseVm & {
  deepCopy: DeepCopy
  buildBlock: BuildBlock
  runBlock: RunBlock
}
