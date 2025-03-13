// Define handler types directly in this file to avoid circular dependencies
type Handler<Params, Result> = (params: Params) => Promise<Result>

type EthBlockNumberHandler = Handler<any, any>
type EthCallHandler = Handler<any, any>
type EthChainIdHandler = Handler<any, any>
type EthGasPriceHandler = Handler<any, any>
type EthGetBalanceHandler = Handler<any, any>
type EthGetCodeHandler = Handler<any, any>
type EthGetStorageAtHandler = Handler<any, any>

/**
 * The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
 * These actions correspond 1:1 eith the public ethereum JSON-RPC api
 * @see {@link https://tevm.sh/learn/actions/}
 */
export type EthActionsApi = {
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
