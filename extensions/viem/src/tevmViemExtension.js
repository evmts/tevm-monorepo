import {
	decodeFunctionResult,
	encodeFunctionData,
	hexToBigInt,
	numberToHex,
} from 'viem'

/**
 * @param {import('@tevm/actions-types').BlockParam|undefined} blockTag
 * @returns {import('@tevm/actions-types').BlockTag | import('@tevm/actions-types').Hex}
 */
const formatBlockTag = (blockTag) => {
	if (blockTag === undefined) {
		return 'pending'
	}
	if (typeof blockTag === 'bigint') {
		return numberToHex(blockTag)
	}
	return blockTag
}

/**
 * Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/) with tevm
 * specif actions namspaced under `client.tevm`
 * It is used together with [tevmTransport](https://tevm.sh/generated/tevm/tevmTransport) 
 * @type {import('./ViemTevmExtension.js').ViemTevmExtension}
 * @example 
 * ```js
 * import { tevmViemExtension, tevmTransport } from 'tevm/viem'
 * import { createPublicClient } from 'viem'
 *
 * const client = createPublicClient({
 *   'https://mainnet.optimism.io'
 * }).extend(tevmViemExtension())
 * ```
 * ## With a backend server
 *
 * This decorator can also be used with a [@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) 
 * @example
 * ```typescript
 * // Server code
 * import { createServer } from '@tevm/server'
 *
 * const server = createServer({
 *  fork: {
 *    url: 'https://mainnet.optimism.io'
 *  }
 * })
 *
 * server.listen(8545)
 * 
 * // Client code
 * import { tevmViemExtension } from 'tevm/viem'
 * import { createPublicClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   transport: http('http://localhost:8545'),
 *   chain: optimism,
 * })
 * ```
 *
 * ## client.tevm.call
 *
 * A low level call to tevm backend similar to [client.call](https://viem.sh/docs/clients/public.html#call) but with advanced tevm specific parameters
 * Unlike a normal call one can optionally chose to create a transaction on the blockchain with the call
 * Tevm also supports geth style `stateOverrideSet` and `blockOverrideSet` parameters
 * @example
 * ```typescript
 * client.tevm.call({
 *   to: `0x${'2'.repeat(40)}`,
 *   // Will create a transaction in the tevm blockchain based on call
 *   createTransaction: true,
 *   // Skip balance will automatically mint msg.value if account has less than msg.value
 *   skipBalance: true,
 *   // You can arbitrarily set the caller and origin
 *   caller: `0x${'1'.repeat(40)}`,
 *   origin: `0x${'2'.repeat(40)}`,
 *   // You can customize the call depth
 *   depth: 0,
 * })
 * ```
 *
 * ## client.tevm.contract
 *
 * A `call` like method for executing contract code with tevm backend similar to [client.readContract](https://viem.sh/docs/clients/public.html#readContract) but with advanced tevm specific parameters
 * It can create transactions just like writeContract as well iwth `createTransaction`
 * See `client.tevm.call` for more details on the custom options
 * @example
 * ```typescript
 * client.tevm.contract({
 *   // Takes params similar to readContract and writeContract
 *   abi: parseAbi(['function balanceOf(address): uint256']),
 *   functionName: 'balanceOf',
 *   args: [address]
 *   to: erc20Address,
 * })
 * ```
 *
 * ## client.tevm.script
 *
 * Another `call` like method for executing arbitrary contract bytecode in the evm.
 * Unlike `client.tevm.contract` it does not require the contract to already be deployed
 * Similar to `client.tevm.call` it can create transactions with `createTransaction`
 * See `client.tevm.call` for more details on the custom options
 * @example
 * ```typescript
 * client.tevm.script({
 *  // Takes params similar to readContract and writeContract
 *  abi: parseAbi(['function foo(address): uint256']),
 *  functionName: 'foo',
 *  args: [address],
 *  deployedBytecode: '0x1234...',
 *  to: '0x
 * })
 * ```
 *
 * ## client.tevm.getAccount
 *
 * A method for getting the account state of an address
 * It can optionally also return contract storage
 * @example
 * ```typescript
 * const account = await client.tevm.getAccount({
 *  address: `0x${'2'.repeat(40)}`,
 * })
 * console.log(account) // { balance: 0n, nonce: 0n, storageRoot: '0x0', codeHash: '0x0',... }
 * ```
 *
 * ## client.tevm.setAccount
 *
 * A method for setting the account state of an address
 * It can optionally also set contract storage
 * @example
 * ```typescript
 * const account = await client.tevm.setAccount({
 * address: `0x${'2'.repeat(40)}`,
 * balance: 100n,
 * nonce: 0n,
 * storageRoot: '0x0',
 * codeHash: '0x0',
 * deployedBytecode: '0x0',
 * })
 * ```
 *
 * ## client.tevm.dumpState
 *
 * Dumps the entire tevm state into a JSON-serializable object
 * @example
 * ```typescript
 * const state = await client.tevm.dumpState()
 * ```
 *
 * ## client.tevm.loadState
 *
 * Loads a tevm state generated with `client.tevm.dumpState` into the tevm state
 * @example
 * ```typescript
 * await client.tevm.loadState(state)
 * ```
 */
export const tevmViemExtension = () => {
	return (client) => {
		/**
		 * @param {import('@tevm/jsonrpc').JsonRpcResponse<any, any, any>} response
		 * @returns {any}
		 */
		const formatResult = (response) => {
			if ('error' in response) {
				return {
					errors: [
						{
							_tag: response.error.code,
							name: response.error.code,
							message: response.error.message,
						},
					],
				}
			}
			return response.result
		}

		/**
		 * @type {import('@tevm/client-types').TevmClient['request']}
		 */
		const request = async (req) => {
			try {
				const result = await client.request(/** @type any*/(req))
				return /** @type any */ ({
					jsonrpc: '2.0',
					method: req.method,
					...(req.id ? { id: req.id } : {}),
					result,
				})
			} catch (e) {
				return /** @type any*/ ({
					jsonrpc: '2.0',
					...(req.id ? { id: req.id } : {}),
					method: req.method,
					error: {
						code: /** @type Error */ (e).name,
						message: /** @type {Error}*/ (e).message,
					},
					errors: [
						{
							_tag: /** @type Error */ (e).name,
							message: /** @type {Error}*/ (e).message,
							name: /** @type {Error}*/ (e).name,
						},
					],
				})
			}
		}

		/**
		 * @type {import('@tevm/actions-types').ScriptHandler}
		 */
		const script = async (params) => {
			const out = /** @type {any} */ (
				parseCallResponse(
					await request({
						method: 'tevm_script',
						jsonrpc: '2.0',
						params: [
							{
								...getCallArgs(params),
								deployedBytecode: params.deployedBytecode,
								data: encodeFunctionData(
									/** @type any*/({
										abi: params.abi,
										functionName: params.functionName,
										args: params.args,
									}),
								),
							},
						],
					}),
				)
			)
			out.data = decodeFunctionResult(
				/** @type any*/({
					data: out.rawData,
					abi: params.abi,
					functionName: params.functionName,
					args: params.args,
				}),
			)
			return out
		}

		/**
		 * @type {import('@tevm/actions-types').GetAccountHandler}
		 */
		const getAccount = async (params) => {
			return formatResult(
				await request({
					method: 'tevm_setAccount',
					jsonrpc: '2.0',
					params: [params],
				}),
			)
		}

		/**
		 * @type {import('@tevm/actions-types').SetAccountHandler}
		 */
		const setAccount = async (params) => {
			return formatResult(
				await request({
					method: 'tevm_setAccount',
					jsonrpc: '2.0',
					params: [
						{
							address: params.address,
							...(params.balance
								? { balance: numberToHex(params.balance) }
								: {}),
							...(params.nonce ? { nonce: numberToHex(params.nonce) } : {}),
							...(params.storageRoot
								? { storageRoot: params.storageRoot }
								: {}),
							...(params.deployedBytecode
								? { deployedBytecode: params.deployedBytecode }
								: {}),
						},
					],
				}),
			)
		}

		/**
		 * @param {import('@tevm/actions-types').CallParams | import('@tevm/actions-types').ScriptParams} params
		 */
		const getCallArgs = (params) => {
			return {
				...(params.deployedBytecode
					? { deployedBytecode: params.deployedBytecode }
					: {}),
				...(params.blobVersionedHashes
					? { blobVersionedHashes: params.blobVersionedHashes }
					: {}),
				...(params.caller ? { caller: params.caller } : {}),
				...('data' in params && params.data ? { data: params.data } : {}),
				...(params.depth ? { depth: params.depth } : {}),
				...(params.gas ? { gas: numberToHex(params.gas) } : {}),
				...(params.gasPrice ? { gasPrice: numberToHex(params.gasPrice) } : {}),
				...(params.gasRefund
					? { gasRefund: numberToHex(params.gasRefund) }
					: {}),
				...(params.origin ? { origin: params.origin } : {}),
				...('salt' in params && params.salt ? { salt: params.salt } : {}),
				...(params.selfdestruct
					? { selfdestruct: [...params.selfdestruct] }
					: {}),
				...(params.skipBalance ? { skipBalance: params.skipBalance } : {}),
				...(params.blockTag
					? { blockTag: formatBlockTag(params.blockTag) }
					: {}),
				...(params.to ? { to: params.to } : {}),
				...(params.value ? { value: numberToHex(params.value) } : {}),
			}
		}

		/**
		 * @type {import('@tevm/actions-types').CallHandler}
		 */
		const call = async (params) => {
			const response = await request({
				method: 'tevm_call',
				jsonrpc: '2.0',
				params: [getCallArgs(params)],
			})
			if ('error' in response) {
				// TODO make this type match
				return /** @type any*/ ({
					errors: [
						{
							_tag: response.error.code,
							message: response.error.message,
							name: response.error.code,
						},
					],
				})
			}
			return parseCallResponse(response)
		}

		/**
		 * @param {import('@tevm/procedures-types').CallJsonRpcResponse | import('@tevm/procedures-types').ScriptJsonRpcResponse} response
		 */
		const parseCallResponse = (response) => {
			if ('error' in response) {
				throw new Error('No result in response')
			}
			const { result } = response
			return {
				executionGasUsed: hexToBigInt(result.executionGasUsed),
				rawData: result.rawData,
				...(result.selfdestruct
					? { selfdestruct: new Set(result.selfdestruct) }
					: {}),
				...(result.gasRefund
					? { gasRefund: hexToBigInt(result.gasRefund) }
					: {}),
				...(result.gas ? { gas: hexToBigInt(result.gas) } : {}),
				...(result.logs ? { logs: result.logs } : {}),
				...(result.blobGasUsed
					? { blobGasUsed: hexToBigInt(result.blobGasUsed) }
					: {}),
				...(result.createdAddress
					? { createdAddress: result.createdAddress }
					: {}),
				...(result.createdAddresses
					? { createdAddresses: new Set(result.createdAddresses) }
					: {}),
			}
		}

		/**
		 * @type {import('@tevm/actions-types').ContractHandler}
		 */
		const contract = async (params) => {
			const out = await call({
				...params,
				data: encodeFunctionData(
					/** @type any*/({
						abi: params.abi,
						functionName: params.functionName,
						args: params.args,
					}),
				),
			})

			const data = decodeFunctionResult(
				/** @type any*/({
					data: out.rawData,
					abi: params.abi,
					functionName: params.functionName,
					args: params.args,
				}),
			)
			return /** @type any*/ ({
				...out,
				rawData: out.rawData,
				data: /**@type any*/ (data),
			})
		}

		/**
		 * @type {import('@tevm/actions-types').DumpStateHandler}
		 */
		const dumpState = async () => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'tevm_dumpState',
						jsonrpc: '2.0',
						params: [],
					}),
				)
			)
		}

		/**
		 * @type {import('@tevm/actions-types').LoadStateHandler}
		 */
		const loadState = async (params) => {
			/**
			 * @type {import('@tevm/state').ParameterizedTevmState}
			 */
			const encodedState = {}

			for (const [k, v] of Object.entries(params.state)) {
				const { nonce, balance, storageRoot, codeHash } = v
				//turn all bigints to hex strings
				const account = {
					...v,
					nonce: numberToHex(nonce),
					balance: numberToHex(balance),
					storageRoot: storageRoot,
					codeHash: codeHash,
				}

				encodedState[k] = account
			}

			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'tevm_loadState',
						jsonrpc: '2.0',
						params: [{ state: encodedState }],
					}),
				)
			)
		}

		return {
			tevm: {
				request,
				script,
				getAccount,
				setAccount,
				call,
				contract,
				dumpState,
				loadState,
			},
		}
	}
}
