import {
	decodeFunctionResult,
	encodeFunctionData,
	hexToBigInt,
	numberToHex,
} from 'viem'

/**
 * @type {import('./ViemTevmExtension.js').ViemTevmExtension}
 */
export const tevmViemExtension = () => {
	return (client) => {
		/**
		 * @param {import('@tevm/api').JsonRpcResponse<any, any, any>} response
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
		 * @type {import('@tevm/api').Tevm['request']}
		 */
		const request = async (req) => {
			try {
				const result = await client.request(/** @type any*/ (req))
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
		 * @type {import('@tevm/api').ScriptHandler}
		 */
		const script = async (params) => {
			const out = /** @type {any} */ (
				parseCallResponse(
					await request({
						method: 'tevm_script',
						jsonrpc: '2.0',
						params: {
							...getCallArgs(params),
							deployedBytecode: params.deployedBytecode,
							data: encodeFunctionData(
								/** @type any*/ ({
									abi: params.abi,
									functionName: params.functionName,
									args: params.args,
								}),
							),
						},
					}),
				)
			)
			out.data = decodeFunctionResult(
				/** @type any*/ ({
					data: out.rawData,
					abi: params.abi,
					functionName: params.functionName,
					args: params.args,
				}),
			)
			return out
		}

		/**
		 * @type {import('@tevm/api').GetAccountHandler}
		 */
		const getAccount = async (params) => {
			return formatResult(
				await request({
					method: 'tevm_setAccount',
					jsonrpc: '2.0',
					params,
				}),
			)
		}

		/**
		 * @type {import('@tevm/api').SetAccountHandler}
		 */
		const setAccount = async (params) => {
			return formatResult(
				await request({
					method: 'tevm_setAccount',
					jsonrpc: '2.0',
					params: {
						address: params.address,
						...(params.balance ? { balance: numberToHex(params.balance) } : {}),
						...(params.nonce ? { nonce: numberToHex(params.nonce) } : {}),
						...(params.storageRoot ? { storageRoot: params.storageRoot } : {}),
						...(params.deployedBytecode
							? { deployedBytecode: params.deployedBytecode }
							: {}),
					},
				}),
			)
		}

		/**
		 * @param {import('@tevm/api').CallParams | import('@tevm/api').ScriptParams} params
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
				...(params.gasLimit ? { gasLimit: numberToHex(params.gasLimit) } : {}),
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
				...(params.to ? { to: params.to } : {}),
				...(params.value ? { value: numberToHex(params.value) } : {}),
				...(params.block
					? {
							...(params.block.gasLimit
								? { gasLimit: numberToHex(params.block.gasLimit) }
								: {}),
							...(params.block.baseFeePerGas
								? { baseFeePerGas: numberToHex(params.block.baseFeePerGas) }
								: {}),
							...(params.block.blobGasPrice
								? { blobGasPrice: numberToHex(params.block.blobGasPrice) }
								: {}),
							...(params.block.difficulty
								? { difficulty: numberToHex(params.block.difficulty) }
								: {}),
							...(params.block.number
								? { number: numberToHex(params.block.number) }
								: {}),
							...(params.block.timestamp
								? { timestamp: numberToHex(params.block.timestamp) }
								: {}),
					  }
					: {}),
			}
		}

		/**
		 * @type {import('@tevm/api').CallHandler}
		 */
		const call = async (params) => {
			const response = await request({
				method: 'tevm_call',
				jsonrpc: '2.0',
				params: getCallArgs(params),
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
		 * @param {import('@tevm/api').CallJsonRpcResponse | import('@tevm/api').ScriptJsonRpcResponse} response
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
		 * @type {import('@tevm/api').ContractHandler}
		 */
		const contract = async (params) => {
			const out = await call({
				...params,
				data: encodeFunctionData(
					/** @type any*/ ({
						abi: params.abi,
						functionName: params.functionName,
						args: params.args,
					}),
				),
			})

			const data = decodeFunctionResult(
				/** @type any*/ ({
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
		 * @type {import('@tevm/api').EthBlockNumberHandler}
		 */
		const blockNumber = async () => {
			return hexToBigInt(
				formatResult(
					await request({
						method: 'eth_blockNumber',
						jsonrpc: '2.0',
						params: [],
					}),
				),
			)
		}

		/**
		 * @type {import('@tevm/api').DumpStateHandler}
		 */
		const dumpState = async () => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'tevm_dumpState',
						jsonrpc: '2.0',
						params: {},
					}),
				)
			)
		}

		/**
		 * @type {import('@tevm/api').EthChainIdHandler}
		 */
		const chainId = async () => {
			return hexToBigInt(
				formatResult(
					await request({
						method: 'eth_chainId',
						jsonrpc: '2.0',
						params: [],
					}),
				),
			)
		}

		/**
		 * @type {import('@tevm/api').LoadStateHandler}
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
						params: { state: encodedState },
					}),
				)
			)
		}
		/**
		 * @type {import('@tevm/api').EthGasPriceHandler}
		 */
		const gasPrice = async () => {
			return hexToBigInt(
				formatResult(
					await request({
						method: 'eth_gasPrice',
						jsonrpc: '2.0',
						params: [],
					}),
				),
			)
		}

		/**
		 * @type {import('@tevm/api').EthGetBalanceHandler}
		 */
		const getBalance = async (params) => {
			return hexToBigInt(
				formatResult(
					await request({
						method: 'eth_getBalance',
						jsonrpc: '2.0',
						params: [params.address, params.blockTag ?? 'pending'],
					}),
				),
			)
		}

		/**
		 * @type {import('@tevm/api').EthGetCodeHandler}
		 */
		const getCode = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'eth_getCode',
						jsonrpc: '2.0',
						params: [params.address, params.tag ?? 'pending'],
					}),
				)
			)
		}

		/**
		 * @type {import('@tevm/api').EthGetStorageAtHandler}
		 */
		const getStorageAt = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'eth_getStorageAt',
						jsonrpc: '2.0',
						params: [params.address, params.position, params.tag ?? 'pending'],
					}),
				)
			)
		}

		return {
			tevm: {
				eth: {
					blockNumber,
					chainId,
					gasPrice,
					getBalance,
					getCode,
					getStorageAt,
				},
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
