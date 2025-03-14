import type {
	AnvilDealHandler,
	CallHandler,
	ContractHandler,
	DeployHandler,
	DumpStateHandler,
	GetAccountHandler,
	LoadStateHandler,
	MineHandler,
	SetAccountHandler,
	SimulateCallHandler,
} from '@tevm/actions'

/**
 * The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
 * @see {@link https://tevm.sh/learn/actions/}
 */
export type TevmActionsApi = {
	// Tevm Handlers
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
	/**
	 * Mines 1 or more blocks
	 */
	mine: MineHandler
	/**
	 * Creates a transaction to deploys a contract to tevm
	 */
	deploy: DeployHandler
	/**
	 * Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)
	 * @example
	 * ```typescript
	 * await tevm.deal({
	 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Optional: USDC address
	 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	 *   amount: 1000000n // 1 USDC (6 decimals)
	 * })
	 * ```
	 */
	deal: AnvilDealHandler
	/**
	 * Simulates a call in the context of a specific block, with the option to simulate after
	 * specific transactions in the block.
	 *
	 * This is similar to `debug_traceTransaction` but allows more flexibility in specifying
	 * the target transaction and block, as well as customizing the transaction parameters.
	 * @example
	 * ```typescript
	 * // Simulate a call on a specific block after a specific transaction
	 * const res = await tevm.simulateCall({
	 *   blockNumber: 1000000n,
	 *   transactionIndex: 2, // simulate after 3rd transaction (0-indexed)
	 *   to: '0x123...',
	 *   value: 420n,
	 *   skipBalance: true,
	 * })
	 *
	 * // Or override a specific transaction's parameters
	 * const res2 = await tevm.simulateCall({
	 *   blockHash: '0xabcdef...',
	 *   transactionHash: '0x123456...',
	 *   value: 1000n, // override the original transaction's value
	 * })
	 * ```
	 */
	simulateCall: SimulateCallHandler
}
