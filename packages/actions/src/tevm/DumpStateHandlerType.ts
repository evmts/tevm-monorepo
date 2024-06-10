import type { BaseParams } from "./BaseParams.js";
import type { DumpStateResult } from "./DumpStateResult.js";

/**
* Dumps the current state of the VM into a JSON-seralizable object
*
* State can be dumped as follows
* @example
* ```typescript
* const {state} = await tevm.dumpState()
* fs.writeFileSync('state.json', JSON.stringify(state))
* ```
*
* And then loaded as follows
* @example
* ```typescript
* const state = JSON.parse(fs.readFileSync('state.json'))
* await tevm.loadState({state})
* ```
*/
export type DumpStateHandler = (params?: BaseParams) => Promise<DumpStateResult>
