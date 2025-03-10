import { describe, expect, it } from 'vitest'
import { TestContract } from '../../TestContract.js'

describe('TestContract', () => {
	it('should have read functions', () => {
		const contract = TestContract.read()
		expect(contract).toBeDefined()

		// Test balanceOf function
		const balanceOfResult = contract.balanceOf('0xAddress')
		expect(balanceOfResult).toMatchObject({
			abi: expect.any(Array),
			address: '0xTestContract',
			args: ['0xAddress'],
		})

		// Test totalSupply function
		const totalSupplyResult = contract.totalSupply()
		expect(totalSupplyResult).toMatchObject({
			abi: expect.any(Array),
			address: '0xTestContract',
			args: expect.any(Array),
		})

		// Test symbol function
		const symbolResult = contract.symbol()
		expect(symbolResult).toMatchObject({
			abi: expect.any(Array),
			address: '0xTestContract',
			args: expect.any(Array),
		})
	})
})
