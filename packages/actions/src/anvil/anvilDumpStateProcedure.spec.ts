import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { anvilSetBalanceJsonRpcProcedure } from './anvilSetBalanceProcedure.js'
import { anvilDumpStateJsonRpcProcedure } from './anvilDumpStateProcedure.js'

describe('anvilDumpStateJsonRpcProcedure', () => {
	it('should dump state correctly', async () => {
		const node = createTevmNode()
		const procedure = anvilDumpStateJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_dumpState',
			// TODO this is actually a bug we need to provide params
			params: [{}],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_dumpState')
		expect(result.result).toMatchSnapshot()
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		const procedure = anvilDumpStateJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_dumpState',
			params: [{}],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})

	it('emits deterministic account order', async () => {
		const node = createTevmNode()
		const dump = anvilDumpStateJsonRpcProcedure(node)
		const setBalance = anvilSetBalanceJsonRpcProcedure(node)
		await setBalance({
			method: 'anvil_setBalance',
			params: ['0xff00000000000000000000000000000000000000', numberToHex(parseEther('1'))],
			jsonrpc: '2.0',
			id: 2,
		})
		await setBalance({
			method: 'anvil_setBalance',
			params: ['0x1100000000000000000000000000000000000000', numberToHex(parseEther('1'))],
			jsonrpc: '2.0',
			id: 3,
		})
		const result = await dump({ method: 'anvil_dumpState', params: [{}], jsonrpc: '2.0' })
		const keys = Object.keys(result.result.state)
		const sorted = [...keys].sort((a, b) => a.localeCompare(b))
		expect(keys).toEqual(sorted)
	})
})
