import type { Abi } from 'abitype'
import type { RunScriptAction } from '../../actions/runScript/RunScriptAction.js'

export type TevmScriptRequest<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = {
  params: RunScriptAction<TAbi, TFunctionName>,
  jsonrpc: '2.0',
  method: 'tevm_script',
  id?: string | number | null,
}

