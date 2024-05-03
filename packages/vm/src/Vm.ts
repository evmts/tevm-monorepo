import type { BaseVm } from "./BaseVm.js"

export type Vm = BaseVm & {
  deepCopy: () => Promise<Vm>
}
