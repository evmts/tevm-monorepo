import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Hex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthUninstallFilterJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethUninstallFilterJsonRpcProcedure } from './ethUninstallFilterProcedure.js'

let client: TevmNode
const filterId: Hex = '0x1'

beforeEach(() => {
	client = createTevmNode()

	client.getFilters().set(filterId, {
		id: filterId,
		type: 'Log',
		created: Date.now(),
		logs: [],
		tx: [],
		blocks: [],
		installed: {},
		err: undefined,
		registeredListeners: [() => {}],
	})
})

describe('ethUninstallFilterJsonRpcProcedure', () => {
	it('should uninstall an existing filter and return true', async () => {
		const request: EthUninstallFilterJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_uninstallFilter',
			id: 1,
			params: [filterId],
		}

		const response = await ethUninstallFilterJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(true)
		expect(response.method).toBe('eth_uninstallFilter')
		expect(response.id).toBe(request.id as any)
		expect(client.getFilters().has(filterId)).toBe(false)
	})

	it('should return false for non-existent filter', async () => {
		const nonExistentFilterId: Hex = '0x2'
		const request: EthUninstallFilterJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_uninstallFilter',
			id: 1,
			params: [nonExistentFilterId],
		}

		const response = await ethUninstallFilterJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(false)
		expect(response.method).toBe('eth_uninstallFilter')
		expect(response.id).toBe(request.id as any)
	})
	it('should handle requests without an id', async () => {
		const request: EthUninstallFilterJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_uninstallFilter',
			params: [filterId],
		}

		const response = await ethUninstallFilterJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(true)
		expect(response.method).toBe('eth_uninstallFilter')
		expect(response.id).toBeUndefined()
		expect(client.getFilters().has(filterId)).toBe(false)
	})
})
