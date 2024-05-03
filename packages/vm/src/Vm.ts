import type { BaseVm } from "./BaseVm.js"
import type { BuildBlock } from "./actions/buildBlock.js"
import type { RunBlock } from "./actions/runBlock.js"

export type Vm = BaseVm & {
  deepCopy: () => Promise<Vm>
  buildBlock: BuildBlock
  runBlock: RunBlock
}
