import { encodeFunctionData, hexToBigInt, numberToHex } from 'viem'

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
		 * @type {import('@tevm/api').TevmClient['request']}
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
		 * @type {import('@tevm/api').TevmClient['script']}
		 */
		const script = async (params) => {
			return /** @type {any} */ (
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
		}

		/**
		 * @type {import('@tevm/api').TevmClient['account']}
		 */
		const account = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'tevm_account',
						jsonrpc: '2.0',
						params: {
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
					}),
				)
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
		 * @type {import('@tevm/api').TevmClient['call']}
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
		 * @type {import('@tevm/api').TevmClient['contract']}
		 */
		const contract = async (params) => {
			return /** @type {any} */ (
				call({
					...params,
					data: encodeFunctionData(
						/** @type any*/ ({
							abi: params.abi,
							functionName: params.functionName,
							args: params.args,
						}),
					),
				})
			)
		}

		return {
			tevm: {
				request,
				script,
				account,
				call,
				contract,
			},
		}
	}
}
