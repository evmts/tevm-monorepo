import { decodeFunctionResult, encodeFunctionData, hexToBigInt, numberToHex } from 'viem'
import { testAccounts } from './testAccounts.js'

/**
 * @param {import('@tevm/actions').BlockParam|undefined} blockTag
 * @returns {import('@tevm/actions').BlockTag | import('@tevm/actions').Hex}
 */
const formatBlockTag = (blockTag) => {
	if (blockTag === undefined) {
		return 'latest'
	}
	if (typeof blockTag === 'bigint') {
		return numberToHex(blockTag)
	}
	return blockTag
}

/**
 * @param {import('@tevm/actions').CallParams['stateOverrideSet']} stateOverrideSet
 */
const formatStateOverrideSet = (stateOverrideSet) =>
	stateOverrideSet === undefined
		? undefined
		: Object.fromEntries(
				Object.entries(stateOverrideSet).map(([address, state]) => [
					address,
					{
						...(state.balance !== undefined ? { balance: numberToHex(state.balance) } : {}),
						...(state.nonce !== undefined ? { nonce: numberToHex(state.nonce) } : {}),
						...(state.code !== undefined ? { code: state.code } : {}),
						...(state.state !== undefined ? { state: state.state } : {}),
						...(state.stateDiff !== undefined ? { stateDiff: state.stateDiff } : {}),
					},
				]),
			)

/**
 * @param {import('@tevm/actions').CallParams['blockOverrideSet']} blockOverrideSet
 */
const formatBlockOverrideSet = (blockOverrideSet) =>
	blockOverrideSet === undefined
		? undefined
		: {
				...(blockOverrideSet.blobBaseFee !== undefined ? { blobBaseFee: numberToHex(blockOverrideSet.blobBaseFee) } : {}),
				...(blockOverrideSet.baseFee !== undefined ? { baseFee: numberToHex(blockOverrideSet.baseFee) } : {}),
				...(blockOverrideSet.gasLimit !== undefined ? { gasLimit: numberToHex(blockOverrideSet.gasLimit) } : {}),
				...(blockOverrideSet.coinbase !== undefined ? { coinbase: blockOverrideSet.coinbase } : {}),
				...(blockOverrideSet.time !== undefined ? { time: numberToHex(blockOverrideSet.time) } : {}),
				...(blockOverrideSet.number !== undefined ? { number: numberToHex(blockOverrideSet.number) } : {}),
			}

/**
 * Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
 * @type {import('./ViemTevmExtension.js').ViemTevmExtension}
 * @example
 * ```js
 * import { createClient, parseEth } from 'viem'
 * import { tevmViemExtension } from '@tevm/viem-extension'
 *
 * const client = createClient('https://mainnet.optimism.io')
 *   .extend(tevmViemExtension())
 *
 * await client.transport.tevm.account({
 *   address: `0x${'12'.repeat(20)}`,
 *   balance: parseEth('420'),
 * })
 * ```
 * @see [@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver) for documentation on creating a tevm backend
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
				const result = await client.request(/** @type any*/ (req))
				return /** @type any */ ({
					jsonrpc: '2.0',
					method: req.method,
					...(req.id === undefined ? {} : { id: req.id }),
					result,
				})
			} catch (e) {
				return /** @type any*/ ({
					jsonrpc: '2.0',
					...(req.id === undefined ? {} : { id: req.id }),
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
		 * @type {import('@tevm/client-types').TevmClient['requestBulk']}
		 */
		const requestBulk = async () => {
			// TODO implement this when we refactor the tevm client to using fetch instead of viem
			throw new Error('Bulk json rpc requests are not yet implemented')
		}

		/**
		 * @type {import('@tevm/actions').GetAccountHandler}
		 */
		const getAccount = async (params) => {
			return formatResult(
				await request(/** @type {import('@tevm/actions').GetAccountJsonRpcRequest} */ ({
					method: 'tevm_getAccount',
					jsonrpc: '2.0',
					params: [
						{
							...params,
							...(params.blockTag !== undefined ? { blockTag: formatBlockTag(params.blockTag) } : {}),
						},
					],
				})),
			)
		}

		/**
		 * @type {import('@tevm/actions').SetAccountHandler}
		 */
		const setAccount = async (params) => {
			return formatResult(
				await request({
					method: 'tevm_setAccount',
					jsonrpc: '2.0',
					params: [
						{
							address: params.address,
							...(params.balance !== undefined ? { balance: numberToHex(params.balance) } : {}),
							...(params.nonce !== undefined ? { nonce: numberToHex(params.nonce) } : {}),
							...(params.storageRoot ? { storageRoot: params.storageRoot } : {}),
							...(params.deployedBytecode ? { deployedBytecode: params.deployedBytecode } : {}),
							...(params.state !== undefined ? { state: params.state } : {}),
							...(params.stateDiff !== undefined ? { stateDiff: params.stateDiff } : {}),
						},
					],
				}),
			)
		}

		/**
		 * @param {import('@tevm/actions').CallParams} params
		 */
		const getCallArgs = (params) => {
			return {
				...(params.code !== undefined ? { code: params.code } : {}),
				...(params.deployedBytecode !== undefined ? { deployedBytecode: params.deployedBytecode } : {}),
				...(params.blobVersionedHashes !== undefined ? { blobVersionedHashes: params.blobVersionedHashes } : {}),
				...(params.caller !== undefined ? { caller: params.caller } : {}),
				...(params.data !== undefined ? { data: params.data } : {}),
				...(params.depth !== undefined ? { depth: params.depth } : {}),
				...(params.gas !== undefined ? { gas: numberToHex(params.gas) } : {}),
				...(params.gasPrice !== undefined ? { gasPrice: numberToHex(params.gasPrice) } : {}),
				...(params.gasRefund !== undefined ? { gasRefund: numberToHex(params.gasRefund) } : {}),
				...(params.origin !== undefined ? { origin: params.origin } : {}),
				...(params.salt !== undefined ? { salt: params.salt } : {}),
				...(params.selfdestruct !== undefined ? { selfdestruct: [...params.selfdestruct] } : {}),
				...(params.skipBalance !== undefined ? { skipBalance: params.skipBalance } : {}),
				...(params.blockTag !== undefined ? { blockTag: formatBlockTag(params.blockTag) } : {}),
				...(params.to !== undefined ? { to: params.to } : {}),
				...(params.value !== undefined ? { value: numberToHex(params.value) } : {}),
				...(params.createTransaction !== undefined ? { createTransaction: params.createTransaction } : {}),
				...(params.addToMempool !== undefined ? { addToMempool: params.addToMempool } : {}),
				...(params.addToBlockchain !== undefined ? { addToBlockchain: params.addToBlockchain } : {}),
				...(params.createTrace !== undefined ? { createTrace: params.createTrace } : {}),
				...(params.createAccessList !== undefined ? { createAccessList: params.createAccessList } : {}),
				...(params.from !== undefined ? { from: params.from } : {}),
				...(params.maxFeePerGas !== undefined ? { maxFeePerGas: numberToHex(params.maxFeePerGas) } : {}),
				...(params.maxPriorityFeePerGas !== undefined
					? { maxPriorityFeePerGas: numberToHex(params.maxPriorityFeePerGas) }
					: {}),
				...(params.nonce !== undefined ? { nonce: numberToHex(params.nonce) } : {}),
			}
		}

		/**
		 * @type {import('@tevm/actions').CallHandler}
		 */
		const call = async (params) => {
			const stateOverrideSet = formatStateOverrideSet(params.stateOverrideSet)
			const blockOverrideSet = formatBlockOverrideSet(params.blockOverrideSet)
			const rpcParams = /** @type {any[]} */ ([getCallArgs(params)])
			if (stateOverrideSet !== undefined || blockOverrideSet !== undefined) {
				rpcParams.push(stateOverrideSet ?? {})
			}
			if (blockOverrideSet !== undefined) {
				rpcParams.push(blockOverrideSet)
			}
			const response = await request({
				method: 'tevm_call',
				jsonrpc: '2.0',
				params: /** @type {any} */ (rpcParams),
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
		 * @param {import('@tevm/actions').CallJsonRpcResponse} response
		 */
		const parseCallResponse = (response) => {
			if ('error' in response) {
				console.error(response.error)
				throw new Error('No result in response')
			}
			const { result } = response
			const accessList =
				result.accessList !== undefined
					? Object.fromEntries(Object.entries(result.accessList).map(([address, slots]) => [address, new Set(slots)]))
					: undefined
			const trace =
				result.trace !== undefined
					? {
							...result.trace,
							gas: hexToBigInt(result.trace.gas),
							structLogs: result.trace.structLogs.map((log) => ({
								...log,
								gas: hexToBigInt(log.gas),
								gasCost: hexToBigInt(log.gasCost),
							})),
						}
					: undefined
			return {
				executionGasUsed: hexToBigInt(result.executionGasUsed),
				rawData: result.rawData,
				...(result.selfdestruct ? { selfdestruct: new Set(result.selfdestruct) } : {}),
				...(result.gasRefund ? { gasRefund: hexToBigInt(result.gasRefund) } : {}),
				...(result.gas ? { gas: hexToBigInt(result.gas) } : {}),
				...(result.logs ? { logs: result.logs } : {}),
				...(result.txHash ? { txHash: result.txHash } : {}),
				...(result.status ? { status: result.status } : {}),
				...(result.blobGasUsed ? { blobGasUsed: hexToBigInt(result.blobGasUsed) } : {}),
				...(accessList !== undefined ? { accessList } : {}),
				...(result.preimages ? { preimages: result.preimages } : {}),
				...(result.l1Fee ? { l1Fee: hexToBigInt(result.l1Fee) } : {}),
				...(result.l1BaseFee ? { l1BaseFee: hexToBigInt(result.l1BaseFee) } : {}),
				...(result.l1BlobFee ? { l1BlobFee: hexToBigInt(result.l1BlobFee) } : {}),
				...(result.l1GasUsed ? { l1GasUsed: hexToBigInt(result.l1GasUsed) } : {}),
				...(result.amountSpent ? { amountSpent: hexToBigInt(result.amountSpent) } : {}),
				...(result.baseFee ? { baseFee: hexToBigInt(result.baseFee) } : {}),
				...(result.totalGasSpent ? { totalGasSpent: hexToBigInt(result.totalGasSpent) } : {}),
				...(trace !== undefined ? { trace } : {}),
				...(result.createdAddress ? { createdAddress: result.createdAddress } : {}),
				...(result.createdAddresses ? { createdAddresses: new Set(result.createdAddresses) } : {}),
			}
		}

		/**
		 * @type {import('@tevm/actions').ContractHandler}
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
			/**
			 * @type {any}
			 */
			let data
			try {
				data = decodeFunctionResult(
					/** @type any*/ ({
						data: out.rawData,
						abi: params.abi,
						functionName: params.functionName,
						args: params.args,
					}),
				)
			} catch (e) {
				if (out.rawData === '0x') {
					console.error('UnexpectedError: data is 0x')
				}
				throw e
			}
			return /** @type any*/ ({
				...out,
				rawData: out.rawData,
				data: /**@type any*/ (data),
			})
		}

		/**
		 * @type {import('@tevm/actions').EthBlockNumberHandler}
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
		 * @type {import('@tevm/actions').EthCallHandler}
		 */
		const ethCall = async ({ blockTag = 'latest', to, gas, data, from = `0x${'0'.repeat(40)}`, value, gasPrice }) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'eth_call',
						jsonrpc: '2.0',
						params: [
							{
								from,
								...(gas ? { gas: numberToHex(gas) } : {}),
								...(gasPrice ? { gasPrice: numberToHex(gasPrice) } : {}),
								...(to ? { to } : {}),
								...(value ? { value: numberToHex(value) } : {}),
								...(data ? { data } : {}),
							},
							formatBlockTag(blockTag),
						],
					}),
				)
			)
		}

		/**
		 * @type {import('@tevm/actions').DumpStateHandler}
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
		 * @type {import('@tevm/actions').EthChainIdHandler}
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
		 * @type {import('@tevm/actions').LoadStateHandler}
		 */
		const loadState = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'tevm_loadState',
						jsonrpc: '2.0',
						params: [{ state: params.state }],
					}),
				)
			)
		}
		/**
		 * @type {import('@tevm/actions').EthGasPriceHandler}
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
		 * @type {import('@tevm/actions').EthGetBalanceHandler}
		 */
		const getBalance = async (params) => {
			return hexToBigInt(
				formatResult(
					await request({
						method: 'eth_getBalance',
						jsonrpc: '2.0',
						params: [params.address, formatBlockTag(params.blockTag)],
					}),
				),
			)
		}

		/**
		 * @type {import('@tevm/actions').EthGetCodeHandler}
		 */
		const getCode = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'eth_getCode',
						jsonrpc: '2.0',
						params: [params.address, formatBlockTag(params.blockTag)],
					}),
				)
			)
		}

		/**
		 * @type {import('@tevm/actions').EthGetStorageAtHandler}
		 */
		const getStorageAt = async (params) => {
			return /** @type {any} */ (
				formatResult(
					await request({
						method: 'eth_getStorageAt',
						jsonrpc: '2.0',
						params: [params.address, params.position, formatBlockTag(params.blockTag)],
					}),
				)
			)
		}

		return {
			tevm: {
				eth: {
					call: ethCall,
					blockNumber,
					chainId,
					gasPrice,
					getBalance,
					getCode,
					getStorageAt,
				},
				accounts: testAccounts,
				request,
				requestBulk,
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
