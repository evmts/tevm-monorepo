import type {
	CallHandler,
	ContractHandler,
	DumpStateHandler,
	GetAccountHandler,
	LoadStateHandler,
	ScriptHandler,
	SetAccountHandler,
} from '@tevm/actions-types'

/**
 * The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
 * @see {@link https://tevm.sh/learn/actions/}
 */
export type TevmActionsApi = {
	// Tevm Handlers
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
	script: ScriptHandler
	/**
	 * Sets the state of a specific ethereum address
	 * @example
	 * import {parseEther} from 'tevm'
	 *
	 * await tevm.setAccount({
	 *  address: '0x123...',
	 *  deployedBytecode: '0x6080604...',
	 *  balance: parseEther('1.0')
	 * })
	 */
	setAccount: SetAccountHandler
	/**
	 * Gets the state of a specific ethereum address
	 * @example
	 * const res = tevm.getAccount({address: '0x123...'})
	 * console.log(res.deployedBytecode)
	 * console.log(res.nonce)
	 * console.log(res.balance)
	 */
	getAccount: GetAccountHandler
	/**
	 * Executes a call against the VM. It is similar to `eth_call` but has more
	 * options for controlling the execution environment
	 *
	 * By default it does not modify the state after the call is complete but this can be configured.
	 * @example
	 * const res = tevm.call({
	 *   to: '0x123...',
	 *   data: '0x123...',
	 *   from: '0x123...',
	 *   gas: 1000000,
	 *   gasPrice: 1n,
	 *   skipBalance: true,
	 * }
	 *
	 */
	call: CallHandler
	/**
	 * Executes a contract call against the VM. It is similar to `eth_call` but has more
	 * options for controlling the execution environment along with a typesafe API
	 * for creating the call via the contract abi.
	 *
	 * The contract must already be deployed. Otherwise see `script` which executes calls
	 * against undeployed contracts
	 *
	 * @example
	 * const res = await tevm.contract({
	 *   to: '0x123...',
	 *   abi: [...],
	 *   function: 'run',
	 *   args: ['world']
	 *   from: '0x123...',
	 *   gas: 1000000,
	 *   gasPrice: 1n,
	 *   skipBalance: true,
	 * }
	 * console.log(res.data) // "hello"
	 */
	contract: ContractHandler
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
	dumpState: DumpStateHandler
	/**
	 * Loads a previously dumped state into the VM
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
	loadState: LoadStateHandler
}
