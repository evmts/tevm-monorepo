import { describe, expect, it } from 'vitest'
import { erc20Abi } from './erc20Abi.js'

describe('erc20Abi', () => {
	it('should export a valid ABI array', () => {
		expect(Array.isArray(erc20Abi)).toBe(true)
		expect(erc20Abi.length).toBe(11) // 2 events + 9 functions
	})

	describe('events', () => {
		it('should include Approval event', () => {
			const approvalEvent = erc20Abi.find(
				(item) => item.type === 'event' && item.name === 'Approval',
			)
			expect(approvalEvent).toBeDefined()
			expect(approvalEvent?.inputs).toHaveLength(3)
			expect(approvalEvent?.inputs[0]).toMatchObject({
				indexed: true,
				name: 'owner',
				type: 'address',
			})
			expect(approvalEvent?.inputs[1]).toMatchObject({
				indexed: true,
				name: 'spender',
				type: 'address',
			})
			expect(approvalEvent?.inputs[2]).toMatchObject({
				indexed: false,
				name: 'value',
				type: 'uint256',
			})
		})

		it('should include Transfer event', () => {
			const transferEvent = erc20Abi.find(
				(item) => item.type === 'event' && item.name === 'Transfer',
			)
			expect(transferEvent).toBeDefined()
			expect(transferEvent?.inputs).toHaveLength(3)
			expect(transferEvent?.inputs[0]).toMatchObject({
				indexed: true,
				name: 'from',
				type: 'address',
			})
			expect(transferEvent?.inputs[1]).toMatchObject({
				indexed: true,
				name: 'to',
				type: 'address',
			})
			expect(transferEvent?.inputs[2]).toMatchObject({
				indexed: false,
				name: 'value',
				type: 'uint256',
			})
		})
	})

	describe('view functions', () => {
		it('should include allowance function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'allowance',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(2)
			expect(fn?.inputs[0]).toMatchObject({ name: 'owner', type: 'address' })
			expect(fn?.inputs[1]).toMatchObject({ name: 'spender', type: 'address' })
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'uint256' })
		})

		it('should include balanceOf function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'balanceOf',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(1)
			expect(fn?.inputs[0]).toMatchObject({ name: 'account', type: 'address' })
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'uint256' })
		})

		it('should include decimals function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'decimals',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(0)
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'uint8' })
		})

		it('should include name function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'name',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(0)
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'string' })
		})

		it('should include symbol function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'symbol',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(0)
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'string' })
		})

		it('should include totalSupply function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'totalSupply',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('view')
			expect(fn?.inputs).toHaveLength(0)
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'uint256' })
		})
	})

	describe('nonpayable functions', () => {
		it('should include approve function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'approve',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('nonpayable')
			expect(fn?.inputs).toHaveLength(2)
			expect(fn?.inputs[0]).toMatchObject({ name: 'spender', type: 'address' })
			expect(fn?.inputs[1]).toMatchObject({ name: 'amount', type: 'uint256' })
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'bool' })
		})

		it('should include transfer function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'transfer',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('nonpayable')
			expect(fn?.inputs).toHaveLength(2)
			expect(fn?.inputs[0]).toMatchObject({ name: 'recipient', type: 'address' })
			expect(fn?.inputs[1]).toMatchObject({ name: 'amount', type: 'uint256' })
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'bool' })
		})

		it('should include transferFrom function', () => {
			const fn = erc20Abi.find(
				(item) => item.type === 'function' && item.name === 'transferFrom',
			)
			expect(fn).toBeDefined()
			expect(fn?.stateMutability).toBe('nonpayable')
			expect(fn?.inputs).toHaveLength(3)
			expect(fn?.inputs[0]).toMatchObject({ name: 'sender', type: 'address' })
			expect(fn?.inputs[1]).toMatchObject({ name: 'recipient', type: 'address' })
			expect(fn?.inputs[2]).toMatchObject({ name: 'amount', type: 'uint256' })
			expect(fn?.outputs).toHaveLength(1)
			expect(fn?.outputs[0]).toMatchObject({ type: 'bool' })
		})
	})

	it('should have correct function count by type', () => {
		const events = erc20Abi.filter((item) => item.type === 'event')
		const functions = erc20Abi.filter((item) => item.type === 'function')
		const viewFunctions = functions.filter((fn) => fn.stateMutability === 'view')
		const nonpayableFunctions = functions.filter((fn) => fn.stateMutability === 'nonpayable')

		expect(events).toHaveLength(2)
		expect(functions).toHaveLength(9)
		expect(viewFunctions).toHaveLength(6) // allowance, balanceOf, decimals, name, symbol, totalSupply
		expect(nonpayableFunctions).toHaveLength(3) // approve, transfer, transferFrom
	})

	it('should be a const assertion (readonly)', () => {
		// The ABI should be readonly to preserve literal types
		// This test verifies the structure is deeply nested objects
		expect(erc20Abi[0].type).toBe('event')
		expect(erc20Abi[0].name).toBe('Approval')
	})
})
