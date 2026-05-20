import { hexToBigInt } from '@tevm/utils'

/**
 * @param {any} request
 * @param {string} message
 */
const invalidParams = (request, message) => ({
	...(request.id ? { id: request.id } : {}),
	method: request.method,
	jsonrpc: request.jsonrpc,
	error: { code: -32602, message },
})

/**
 * @param {any} request
 * @param {any} result
 */
const ok = (request, result) => ({
	...(request.id ? { id: request.id } : {}),
	method: request.method,
	jsonrpc: '2.0',
	result,
})

export const ethGetWorkJsonRpcProcedure =
	() =>
	/** @param {any} request */
	(request) =>
		ok(request, ['0x0', '0x0', '0x0'])
export const ethHashrateJsonRpcProcedure =
	() =>
	/** @param {any} request */
	(request) =>
		ok(request, '0x0')
export const ethSubmitHashrateJsonRpcProcedure =
	() =>
	/** @param {any} request */
	(request) =>
		ok(request, false)
export const ethSubmitWorkJsonRpcProcedure =
	() =>
	/** @param {any} request */
	(request) =>
		ok(request, false)
export const debugGetBadBlocksJsonRpcProcedure =
	() =>
	/** @param {any} request */
	(request) =>
		ok(request, [])

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetUncleCountByBlockHashJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		try {
			await (await client.getVm()).blockchain.getBlock(request.params[0])
		} catch {
			return ok(request, '0x0')
		}
		return ok(request, '0x0')
	}

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetUncleCountByBlockNumberJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		const blockTagOrNumber = request.params[0]
		const vm = await client.getVm()
		let block
		try {
			block = blockTagOrNumber.startsWith('0x')
				? await vm.blockchain.getBlock(hexToBigInt(blockTagOrNumber))
				: vm.blockchain.blocksByTag.get(blockTagOrNumber)
		} catch {
			block = undefined
		}
		if (!block) return invalidParams(request, `Invalid block tag ${blockTagOrNumber}`)
		return ok(request, '0x0')
	}

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetUncleByBlockHashAndIndexJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		try {
			await (await client.getVm()).blockchain.getBlock(request.params[0])
		} catch {
			return ok(request, null)
		}
		return ok(request, null)
	}

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetUncleByBlockNumberAndIndexJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		const blockTagOrNumber = request.params[0]
		const vm = await client.getVm()
		let block
		try {
			block = blockTagOrNumber.startsWith('0x')
				? await vm.blockchain.getBlock(hexToBigInt(blockTagOrNumber))
				: vm.blockchain.blocksByTag.get(blockTagOrNumber)
		} catch {
			block = undefined
		}
		if (!block) return invalidParams(request, `Invalid block tag ${blockTagOrNumber}`)
		return ok(request, null)
	}

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetBlockAccessListJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		const blockTagOrNumber = request.params[0]
		const vm = await client.getVm()
		let block
		try {
			block = blockTagOrNumber.startsWith('0x')
				? await vm.blockchain.getBlock(hexToBigInt(blockTagOrNumber))
				: vm.blockchain.blocksByTag.get(blockTagOrNumber)
		} catch {
			block = undefined
		}
		if (!block) return invalidParams(request, `Invalid block tag ${blockTagOrNumber}`)
		return ok(request, [])
	}

/**
 * @param {import('@tevm/node').TevmNode} client
 */
export const ethGetStorageValuesJsonRpcProcedure =
	(client) =>
	/** @param {any} request */
	async (request) => {
		const [pairs, tag] = request.params
		if (!Array.isArray(pairs)) return invalidParams(request, 'First param must be an array of [address, slots] pairs')
		const handler = await import('./getStorageAtHandler.js').then((m) => m.getStorageAtHandler(client))
		const out = []
		for (const pair of pairs) {
			if (!Array.isArray(pair) || pair.length !== 2 || !Array.isArray(pair[1])) {
				return invalidParams(request, 'Each item must be [address, slots]')
			}
			const [address, slots] = pair
			const values = []
			for (const slot of slots) {
				values.push(await handler({ address, position: slot, blockTag: tag }))
			}
			out.push(values)
		}
		return ok(request, out)
	}
