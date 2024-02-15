import { createMemoryClient } from '@tevm/memory-client'
import { JsonRpcApiProvider } from 'ethers'

/**
 * An [ethers JsonRpcApiProvider](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider) using a tevm MemoryClient as it's backend
 *
 * ## TevmProvider
 *
 * The TevmProvider class is an instance of an ethers provider using Tevm as it's backend. The `createMemoryProvider` method can be used to create an in memory instance of tevm using a [memoryClient](../clients/) as it's backend.
 *
 * @example
 * ```typescript
 * import {TevmProvider} from '@tevm/ethers'
 *
 * const provider = await TevmProvider.createMemoryProvider({
 *   fork: {
 *     url: 'https://mainnet.optimism.io',
 *   },
 * })
 * ```
 *
 * ## Using with an http client
 *
 * The constructor takes any instance of tevm including the `httpClient`.
 *
 * @example
 * ```typescript
 * import {createHttpClient} from '@tevm/http-client'
 * const provider = new TevmProvider(createHttpClient({url: 'https://localhost:8080'}))
 * ```
 *
 * ## Ethers provider support
 *
 * You can use all the normal ethers apis to interact with tevm.
 *
 * @example
 * ```typescript
 * const provider = await TevmProvider.createMemoryProvider({
 *   fork: {
 *     url: 'https://mainnet.optimism.io',
 *   },
 * })
 *
 * console.log(
 *   await provider.getBlockNumber()
 * ) // 10
 * ```
 *
 * ## Tevm actions support
 *
 * The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.
 *
 * @example
 * ```typescript
 * import {TevmProvider} from '@tevm/ethers'
 * import {createScript} from 'tevm'
 *
 * const provider = await TevmProvider.createMemoryProvider({
 *   fork: {
 *     url: 'https://mainnet.optimism.io',
 *   },
 * })
 *
 * const addContract = createScript({
 *   name: 'AddContract',
 *   humanReadableAbi: [
 *     'function add(uint256 a, uint256 b) public pure returns (uint256)',
 *   ],
 *   deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
 *   bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
 * } as const)
 *
 * const result = await provider.tevm.script(addContract.read.add(390n, 30n))
 *
 * console.log(result)
 * //  createdAddresses: new Set(),
 * //  data: 420n,
 * //  executionGasUsed: 927n,
 * //  gas: 16776288n,
 * //  logs: [],
 * //  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
 * //  selfdestruct: new Set(),
 * ```
 *
 * ## Tevm JSON-RPC support
 *
 * An ethers TevmProvider supports the tevm [JSON-RPC methods](../json-rpc). For example you can use `tevm_account` to set account
 *
 * @example
 * ```typescript
 * await provider.send('tevm_setAccount', {
 *   address: `0x${'69'.repeat(20)}`,
 *   nonce: toHex(1n),
 *   balance: toHex(420n),
 * }),
 * console.log(await provider.send('tevm_getAccount', {
 *   address: `0x${'69'.repeat(20)}`,
 * }))
 * //	address: '0x6969696969696969696969696969696969696969',
 * //	balance: toHex(420n),
 * //	deployedBytecode: '0x00',
 * //	nonce: toHex(1n),
 * //	storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 * ```
 * @see {@link https://tevm.sh/learn/clients/ | Tevm Clients Docs}
 */
export class TevmProvider extends JsonRpcApiProvider {
	/**
	 * Creates a new TevmProvider instance with a TevmMemoryClient.
	 * @param {import('@tevm/base-client').BaseClientOptions} options - Options to create a new TevmProvider.
	 * @returns {Promise<TevmProvider>} A new TevmProvider instance.
	 * @readonly
	 * @see {@link https://tevm.sh/learn/clients/ | Tevm Clients Docs}
	 * @example
	 * ```ts
	 * import { TevmProvider } from '@tevm/ethers'
	 *
	 * const provider = await TevmProvider.createMemoryProvider()
	 *
	 * const blockNumber = await provider.getBlockNumber()
	 * ```
	 */
	static createMemoryProvider = async (options) => {
		return new TevmProvider(await createMemoryClient(options))
	}

	/**
	 * An instance of the TevmClient interface.
	 * @see [Tevm Client reference](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient/)
	 * @type {import('@tevm/client-types').TevmClient}
	 * ## Tevm actions support
	 *
	 * The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.
	 *
	 * @example
	 * ```typescript
	 * import {TevmProvider} from '@tevm/ethers'
	 * import {createScript} from 'tevm'
	 *
	 * const provider = await TevmProvider.createMemoryProvider({
	 *   fork: {
	 *     url: 'https://mainnet.optimism.io',
	 *   },
	 * })
	 *
	 * const addContract = createScript({
	 *   name: 'AddContract',
	 *   humanReadableAbi: [
	 *     'function add(uint256 a, uint256 b) public pure returns (uint256)',
	 *   ],
	 *   deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
	 *   bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
	 * } as const)
	 *
	 * const result = await provider.tevm.script(addContract.read.add(390n, 30n))
	 *
	 * console.log(result)
	 * //  createdAddresses: new Set(),
	 * //  data: 420n,
	 * //  executionGasUsed: 927n,
	 * //  gas: 16776288n,
	 * //  logs: [],
	 * //  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
	 * //  selfdestruct: new Set(),
	 * ```
	 */
	tevm

	/**
	 * @param {import('@tevm/client-types').TevmClient} tevm An instance of the Tevm interface.
	 */
	constructor(tevm) {
		super(undefined, {
			staticNetwork: true,
			batchMaxCount: 1,
			batchStallTime: 0,
			cacheTimeout: -1,
		})
		this.tevm = tevm
	}

	/**
	 *  Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.
	 *  @type {import('ethers').JsonRpcApiProvider['_send']}
	 */
	_send = async (payload) => {
		if (Array.isArray(payload)) {
			return /** @type {Promise<Array<import('ethers').JsonRpcResult | import('ethers').JsonRpcError>>}*/ (
				this.tevm.requestBulk(
					/** @type {Array<import('@tevm/procedures-types').TevmJsonRpcRequest | import('@tevm/procedures-types').EthJsonRpcRequest>}*/ (
						payload
					),
				)
			)
		} else {
			return /** @type {[import('ethers').JsonRpcResult | import('ethers').JsonRpcError]}*/ ([
				await this.tevm.request(
					/** @type {import('@tevm/procedures-types').TevmJsonRpcRequest | import('@tevm/procedures-types').EthJsonRpcRequest}*/ (
						payload
					),
				),
			])
		}
	}
}
