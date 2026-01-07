import { describe, expect, it } from 'vitest'
import { Withdrawal, createWithdrawal, createWithdrawalFromBytesArray } from './withdrawal.js'
import { hexToBytes, bytesToHex } from './viem.js'

describe('Withdrawal', () => {
	describe('constructor', () => {
		it('should create a Withdrawal with correct properties', () => {
			const index = 1n
			const validatorIndex = 65535n
			const address = hexToBytes('0x0000000000000000000000000000000000000001')
			const amount = 1000000000n

			const withdrawal = new Withdrawal(index, validatorIndex, address, amount)

			expect(withdrawal.index).toBe(1n)
			expect(withdrawal.validatorIndex).toBe(65535n)
			expect(withdrawal.address).toEqual(address)
			expect(withdrawal.amount).toBe(1000000000n)
		})

		it('should handle zero values', () => {
			const withdrawal = new Withdrawal(0n, 0n, new Uint8Array(20), 0n)

			expect(withdrawal.index).toBe(0n)
			expect(withdrawal.validatorIndex).toBe(0n)
			expect(withdrawal.amount).toBe(0n)
		})
	})

	describe('raw', () => {
		it('should return correct byte arrays for RLP encoding', () => {
			const index = 1n
			const validatorIndex = 65535n
			const address = hexToBytes('0x0000000000000000000000000000000000000001')
			const amount = 1000000000n

			const withdrawal = new Withdrawal(index, validatorIndex, address, amount)
			const raw = withdrawal.raw()

			expect(raw).toHaveLength(4)
			expect(raw[0]).toEqual(hexToBytes('0x01')) // index
			expect(raw[1]).toEqual(hexToBytes('0xffff')) // validatorIndex
			expect(raw[2]).toEqual(address) // address
			expect(raw[3]).toEqual(hexToBytes('0x3b9aca00')) // amount (1000000000 in hex)
		})

		it('should return empty arrays for zero values', () => {
			const withdrawal = new Withdrawal(0n, 0n, new Uint8Array(20), 0n)
			const raw = withdrawal.raw()

			expect(raw[0]).toEqual(new Uint8Array()) // index 0 -> empty
			expect(raw[1]).toEqual(new Uint8Array()) // validatorIndex 0 -> empty
			expect(raw[2]).toEqual(new Uint8Array(20)) // address (20 zero bytes)
			expect(raw[3]).toEqual(new Uint8Array()) // amount 0 -> empty
		})
	})

	describe('toValue', () => {
		it('should return correct value object', () => {
			const index = 1n
			const validatorIndex = 65535n
			const address = hexToBytes('0x0000000000000000000000000000000000000001')
			const amount = 1000000000n

			const withdrawal = new Withdrawal(index, validatorIndex, address, amount)
			const value = withdrawal.toValue()

			expect(value.index).toBe(1n)
			expect(value.validatorIndex).toBe(65535n)
			expect(value.address).toEqual(address)
			expect(value.amount).toBe(1000000000n)
		})
	})

	describe('toJSON', () => {
		it('should return correct JSON-RPC format', () => {
			const index = 1n
			const validatorIndex = 65535n
			const address = hexToBytes('0x0000000000000000000000000000000000000001')
			const amount = 1000000000n

			const withdrawal = new Withdrawal(index, validatorIndex, address, amount)
			const json = withdrawal.toJSON()

			expect(json.index).toBe('0x1')
			expect(json.validatorIndex).toBe('0xffff')
			expect(json.address).toBe('0x0000000000000000000000000000000000000001')
			expect(json.amount).toBe('0x3b9aca00')
		})

		it('should handle zero values', () => {
			const withdrawal = new Withdrawal(0n, 0n, new Uint8Array(20), 0n)
			const json = withdrawal.toJSON()

			expect(json.index).toBe('0x0')
			expect(json.validatorIndex).toBe('0x0')
			expect(json.amount).toBe('0x0')
		})
	})
})

describe('createWithdrawal', () => {
	it('should create Withdrawal from bigint values', () => {
		const withdrawal = createWithdrawal({
			index: 1n,
			validatorIndex: 65535n,
			address: '0x0000000000000000000000000000000000000001',
			amount: 1000000000n,
		})

		expect(withdrawal.index).toBe(1n)
		expect(withdrawal.validatorIndex).toBe(65535n)
		expect(withdrawal.amount).toBe(1000000000n)
	})

	it('should create Withdrawal from hex string values', () => {
		const withdrawal = createWithdrawal({
			index: '0x1',
			validatorIndex: '0xffff',
			address: '0x0000000000000000000000000000000000000001',
			amount: '0x3b9aca00',
		})

		expect(withdrawal.index).toBe(1n)
		expect(withdrawal.validatorIndex).toBe(65535n)
		expect(withdrawal.amount).toBe(1000000000n)
	})

	it('should create Withdrawal from number values', () => {
		const withdrawal = createWithdrawal({
			index: 1,
			validatorIndex: 65535,
			address: '0x0000000000000000000000000000000000000001',
			amount: 1000000000,
		})

		expect(withdrawal.index).toBe(1n)
		expect(withdrawal.validatorIndex).toBe(65535n)
		expect(withdrawal.amount).toBe(1000000000n)
	})

	it('should accept Uint8Array address', () => {
		const address = hexToBytes('0x0000000000000000000000000000000000000001')
		const withdrawal = createWithdrawal({
			index: 1n,
			validatorIndex: 65535n,
			address,
			amount: 1000000000n,
		})

		expect(withdrawal.address).toEqual(address)
	})

	it('should throw for invalid address type', () => {
		expect(() =>
			createWithdrawal({
				index: 1n,
				validatorIndex: 65535n,
				// @ts-expect-error - testing invalid type
				address: 12345,
				amount: 1000000000n,
			}),
		).toThrow('Invalid address type')
	})
})

describe('createWithdrawalFromBytesArray', () => {
	it('should create Withdrawal from byte arrays', () => {
		const bytesArray: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
			hexToBytes('0x01'), // index
			hexToBytes('0xffff'), // validatorIndex
			hexToBytes('0x0000000000000000000000000000000000000001'), // address
			hexToBytes('0x3b9aca00'), // amount
		]

		const withdrawal = createWithdrawalFromBytesArray(bytesArray)

		expect(withdrawal.index).toBe(1n)
		expect(withdrawal.validatorIndex).toBe(65535n)
		expect(withdrawal.amount).toBe(1000000000n)
	})

	it('should throw for invalid array length', () => {
		expect(() =>
			// @ts-expect-error - testing invalid length
			createWithdrawalFromBytesArray([new Uint8Array(), new Uint8Array(), new Uint8Array()]),
		).toThrow('Invalid withdrawalArray length expected=4 actual=3')
	})

	it('should handle empty byte arrays for zero values', () => {
		const bytesArray: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
			new Uint8Array(), // index 0
			new Uint8Array(), // validatorIndex 0
			new Uint8Array(20), // address
			new Uint8Array(), // amount 0
		]

		const withdrawal = createWithdrawalFromBytesArray(bytesArray)

		expect(withdrawal.index).toBe(0n)
		expect(withdrawal.validatorIndex).toBe(0n)
		expect(withdrawal.amount).toBe(0n)
	})
})

describe('round-trip conversion', () => {
	it('should maintain values through raw -> createFromBytesArray cycle', () => {
		const original = createWithdrawal({
			index: 12345n,
			validatorIndex: 67890n,
			address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			amount: 999999999n,
		})

		const raw = original.raw()
		const recreated = createWithdrawalFromBytesArray(raw)

		expect(recreated.index).toBe(original.index)
		expect(recreated.validatorIndex).toBe(original.validatorIndex)
		expect(bytesToHex(recreated.address)).toBe(bytesToHex(original.address))
		expect(recreated.amount).toBe(original.amount)
	})

	it('should maintain values through toJSON -> createWithdrawal cycle', () => {
		const original = createWithdrawal({
			index: 12345n,
			validatorIndex: 67890n,
			address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			amount: 999999999n,
		})

		const json = original.toJSON()
		const recreated = createWithdrawal({
			index: json.index,
			validatorIndex: json.validatorIndex,
			address: json.address,
			amount: json.amount,
		})

		expect(recreated.index).toBe(original.index)
		expect(recreated.validatorIndex).toBe(original.validatorIndex)
		expect(bytesToHex(recreated.address)).toBe(bytesToHex(original.address))
		expect(recreated.amount).toBe(original.amount)
	})
})
