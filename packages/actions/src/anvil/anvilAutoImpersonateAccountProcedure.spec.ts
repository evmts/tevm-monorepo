import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { anvilAutoImpersonateAccountJsonRpcProcedure } from './anvilAutoImpersonateAccountProcedure.js'

describe('anvilAutoImpersonateAccountJsonRpcProcedure', () => {
	let node: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		node = createTevmNode()
	})

	it('should successfully enable auto-impersonation', async () => {
		// Verify auto-impersonation is initially disabled
		expect(node.getAutoImpersonate()).toBe(false)

		const procedure = anvilAutoImpersonateAccountJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [true],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_autoImpersonateAccount',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify auto-impersonation is now enabled
		expect(node.getAutoImpersonate()).toBe(true)
	})

	it('should successfully disable auto-impersonation', async () => {
		// Enable auto-impersonation first
		node.setAutoImpersonate(true)
		expect(node.getAutoImpersonate()).toBe(true)

		const procedure = anvilAutoImpersonateAccountJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [false],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_autoImpersonateAccount',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify auto-impersonation is now disabled
		expect(node.getAutoImpersonate()).toBe(false)
	})

	it('should handle requests with id', async () => {
		const procedure = anvilAutoImpersonateAccountJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [true],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result).toEqual({
			method: 'anvil_autoImpersonateAccount',
			jsonrpc: '2.0',
			result: null,
			id: 1,
		})
	})

	it('should toggle auto-impersonation multiple times', async () => {
		const procedure = anvilAutoImpersonateAccountJsonRpcProcedure(node)

		// Enable
		await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [true],
			jsonrpc: '2.0',
		})
		expect(node.getAutoImpersonate()).toBe(true)

		// Disable
		await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [false],
			jsonrpc: '2.0',
		})
		expect(node.getAutoImpersonate()).toBe(false)

		// Enable again
		await procedure({
			method: 'anvil_autoImpersonateAccount',
			params: [true],
			jsonrpc: '2.0',
		})
		expect(node.getAutoImpersonate()).toBe(true)
	})
})
