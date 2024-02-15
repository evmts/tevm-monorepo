import type { ScriptParams, ScriptResult } from '../index.js'
import type { Abi } from '@tevm/utils'
import type { ContractFunctionName } from '@tevm/utils'

// this handler is adapted from viem and purposefully matches the viem api (not exactly but close enough)

/**
 * Executes scripts against the Tevm EVM. By default the script is sandboxed
 * and the state is reset after each execution unless the `persist` option is set
 * to true.
 * @example
 * ```typescript
 * const res = tevm.script({
 *   deployedBytecode: '0x6080604...',
 *   abi: [...],
 *   function: 'run',
 *   args: ['hello world']
 * })
 * ```
 * Contract handlers provide a more ergonomic way to execute scripts
 * @example
 * ```typescript
 * ipmort {MyScript} from './MyScript.s.sol'
 *
 * const res = tevm.script(
 *    MyScript.read.run('hello world')
 * )
 * ```
 */
export type ScriptHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
>(
	params: ScriptParams<TAbi, TFunctionName>,
) => Promise<ScriptResult<TAbi, TFunctionName>>
