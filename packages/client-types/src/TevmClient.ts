import type {
	CallHandler,
	ContractHandler,
	DumpStateHandler,
	// ForkHandler,
	// DebugTraceCallHandler,
	// DebugTraceTransactionHandler,
	EthBlockNumberHandler,
	EthCallHandler,
	// EthCallHandler,
	EthChainIdHandler,
	EthGasPriceHandler,
	EthGetBalanceHandler,
	EthGetCodeHandler,
	EthGetStorageAtHandler,
	GetAccountHandler,
	LoadStateHandler,
	ScriptHandler,
	SetAccountHandler,
} from '@tevm/actions-types'
import type {
	TevmJsonRpcBulkRequestHandler,
	TevmJsonRpcRequestHandler,
} from '@tevm/procedures-types'
import type { HDAccount } from '@tevm/utils'

export type WalletTevmClient = {
	/**
	 * A list of viem accounts available to use on the vm. These are the same accounts `anvil` `ganache` and `hardhat` use
	 *
	 * Available Accounts
	 * ==================
	 *
	 * (0) "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" (10000 ETH)
	 * (1) "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" (10000 ETH)
	 * (2) "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" (10000 ETH)
	 * (3) "0x90F79bf6EB2c4f870365E785982E1f101E93b906" (10000 ETH)
	 * (4) "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" (10000 ETH)
	 * (5) "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" (10000 ETH)
	 * (6) "0x976EA74026E726554dB657fA54763abd0C3a0aa9" (10000 ETH)
	 * (7) "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955" (10000 ETH)
	 * (8) "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f" (10000 ETH)
	 * (9) "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" (10000 ETH)
	 *
	 * Private Keys
	 * ==================
	 *
	 * (0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
	 * (1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
	 * (2) 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
	 * (3) 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
	 * (4) 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
	 * (5) 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba
	 * (6) 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e
	 * (7) 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356
	 * (8) 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
	 * (9) 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
	 *
	 * Wallet
	 * ==================
	 * Mnemonic:          test test test test test test test test test test test junk
	 * Derivation path:   m/44'/60'/0'/0/
	 */
	accounts: [
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
		HDAccount,
	]
}

/**
 * A local EVM instance running in the browser, Bun, or Node.js. Akin to anvil or ganache. The TevmClient interface
 * is a unified interface that all Clients implement. This provides a consistent developer experience no matter how you are
 * using Tevm.
 *
 * @see {@link https://tevm.sh/learn/clients/ | TevmClient guide} for more documentation on clients
 *
 * #### JSON-RPC
 *
 * Tevm exposes a JSON-RPC interface for interacting with the EVM via the {@link TevmClient.request}
 *
 * @example
 * ```typescript
 * import {createMemoryClient, type Tevm} from 'tevm'
 *
 * const tevm: Tevm = createMemoryClient()
 *
 * await tevm.request({
 *   method: 'eth_blockNumber',
 *   params: [],
 *   id: 1,
 *   jsonrpc: '2.0',
 * }) // 0n
 * ```
 *
 * #### Actions
 *
 * TevmClient exposes a higher level `actions` based api similar to {@link https://viem.sh | viem} for interacting with TevmClient in a typesasafe
 * ergonomic way.
 *
 * @example
 * ```typescript
 * // same as eth_blockNumber example
 * const account = await tevm.account({address: `0x${'0'.repeat(40)}`})
 * console.log(account.balance) // 0n
 * ```
 *
 * #### Ethereum actions
 *
 * Ethereum actions are namespaced under {@link TevmClient.eth}
 *
 * @example
 * ```typescript
 * const blockNumber = await tevm.eth.blockNumber()
 * console.log(blockNumber) // 0n
 * ```
 *
 * #### Anvil hardhat and ganache compatibility
 *
 * Will have anvil_* ganache_* and hardhat_* JSON-RPC compatibility in future versions
 */
export type TevmClient = {
	/**
	 * @experimental
	 * Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
	 * Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
	 * sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
	 * will be added in the future.
	 *
	 * Currently is not very generic with regard to input and output types.
	 * @example
	 * ```typescript
	 * const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{
	 *  method: 'eth_blockNumber',
	 *  params: []
	 *  id: 1
	 *  jsonrpc: '2.0'
	 * }, {
	 *  method: 'eth_gasPrice',
	 *  params: []
	 *  id: 1
	 *  jsonrpc: '2.0'
	 * }])
	 * ```
	 *
	 * ### tevm_* methods
	 *
	 * #### tevm_call
	 *
	 * request - {@link CallJsonRpcRequest}
	 * response - {@link CallJsonRpcResponse}
	 *
	 * #### tevm_script
	 *
	 * request - {@link ScriptJsonRpcRequest}
	 * response - {@link ScriptJsonRpcResponse}
	 *
	 * #### tevm_getAccount
	 *
	 * request - {@link GetAccountJsonRpcRequest}
	 * response - {@link GetAccountJsonRpcResponse}
	 *
	 * #### tevm_setAccount
	 *
	 * request - {@link SetAccountJsonRpcRequest}
	 * response - {@link SetAccountJsonRpcResponse}
	 *
	 * #### tevm_fork
	 *
	 * request - {@link ForkJsonRpcRequest}
	 * response - {@link ForkJsonRpcResponse}
	 *
	 * ### debug_* methods
	 *
	 * #### debug_traceCall
	 *
	 * request - {@link DebugTraceCallJsonRpcRequest}
	 * response - {@link DebugTraceCallJsonRpcResponse}
	 *
	 * ### eth_* methods
	 *
	 * #### eth_blockNumber
	 *
	 * request - {@link EthBlockNumberJsonRpcRequest}
	 * response - {@link EthBlockNumberJsonRpcResponse}
	 *
	 * #### eth_chainId
	 *
	 * request - {@link EthChainIdJsonRpcRequest}
	 * response - {@link EthChainIdJsonRpcResponse}
	 *
	 * #### eth_getCode
	 *
	 * request - {@link EthGetCodeJsonRpcRequest}
	 * response - {@link EthGetCodeJsonRpcResponse}
	 *
	 * #### eth_getStorageAt
	 *
	 * request - {@link EthGetStorageAtJsonRpcRequest}
	 * response - {@link EthGetStorageAtJsonRpcResponse}
	 *
	 * #### eth_gasPrice
	 *
	 * request - {@link EthGasPriceJsonRpcRequest}
	 * response - {@link EthGasPriceJsonRpcResponse}
	 *
	 * #### eth_getBalance
	 *
	 * request - {@link EthGetBalanceJsonRpcRequest}
	 * response - {@link EthGetBalanceJsonRpcResponse}
	 */
	requestBulk: TevmJsonRpcBulkRequestHandler
	/**
	 * Request handler for JSON-RPC requests. Most users will want to use the [`actions` api](https://tevm.sh/learn/actions/)
	 * instead of this method directly
	 * @example
	 * ```typescript
	 * const blockNumberResponse = await tevm.request({
	 *   method: 'eth_blockNumber',
	 *   params: []
	 *   id: 1
	 *   jsonrpc: '2.0'
	 * })
	 * const accountResponse = await tevm.request({
	 *   method: 'tevm_getAccount',
	 *   params: [{address: '0x123...'}],
	 *   id: 1,
	 *   jsonrpc: '2.0',
	 * })
	 * ```
	 */
	request: TevmJsonRpcRequestHandler
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
	/**
	 * @experimental This is an unimplemented experimental feature
	 * Triggers a fork against the given fork config. If no config is provided it will fork the current state
	 * If the current state is not proxying to an RPC and is just a vanilla VM it will throw
	 *
	 * Block tag is optional and defaults to 'latest'
	 * @throws {@link import('@tevm/errors').ForkError}
	 * @example
	 * ```typescript
	 * const {errors} = await tevm.fork({
	 *   url: 'https://mainnet.infura.io/v3',
	 *   blockTag: 'earliest',
	 * })
	 * ```
	 */
	// Don't include this feature util someone asks for it with a reasonable use case!!!
	// For now we expect users to start cliets in fork or proxy mode in constructor and never change back and forth
	// In fugure we may implement ability to switch between fork and proxy
	// fork: ForkHandler
	/**
	 * Standard JSON-RPC methods for interacting with the VM
	 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
	 */
	eth: {
		/**
		 * Returns the current block number
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const blockNumber = await tevm.eth.blockNumber()
		 * console.log(blockNumber) // 0n
		 */
		blockNumber: EthBlockNumberHandler
		/**
		 * Executes a call without modifying the state
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const res = await tevm.eth.call({to: '0x123...', data: '0x123...'})
		 * console.log(res) // "0x..."
		 */
		call: EthCallHandler
		/**
		 * Returns the current chain id
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const chainId = await tevm.eth.chainId()
		 * console.log(chainId) // 10n
		 */
		chainId: EthChainIdHandler
		/**
		 * Returns code at a given address
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const code = await tevm.eth.getCode({address: '0x123...'})
		 */
		getCode: EthGetCodeHandler
		/**
		 * Returns storage at a given address and slot
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
		 */
		getStorageAt: EthGetStorageAtHandler
		/**
		 * Returns the current gas price
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const gasPrice = await tevm.eth.gasPrice()
		 * console.log(gasPrice) // 0n
		 */
		gasPrice: EthGasPriceHandler
		/**
		 * Returns the balance of a given address
		 * Set the `tag` to a block number or block hash to get the balance at that block
		 * Block tag defaults to 'pending' tag which is the optimistic state of the VM
		 * @see {@link https://ethereum.github.io/execution-apis/api-documentation/ | JSON-RPC}
		 * @example
		 * const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
		 * console.log(gasPrice) // 0n
		 */
		getBalance: EthGetBalanceHandler
	}
}
