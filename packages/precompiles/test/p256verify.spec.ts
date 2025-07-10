import { base } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { describe, it, expect } from 'vitest'

describe('p256verify precompile (RIP-7212)', () => {
	const p256VerifyAddress = '0x0000000000000000000000000000000000000100'

	it('should return padded 1 for a valid signature', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()

		const result = await vm.evm.runCall({
			caller: hexToBytes('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: hexToBytes(p256VerifyAddress),
			data: hexToBytes(
				'c74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
				'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be80' + // s
				'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
				'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c'   // msgHash
			),
		})

		// Should return 32-byte padded 1 for valid signature
		const expected = new Uint8Array(32)
		expected[31] = 1
		
		expect(result.execResult.returnValue).toEqual(expected)
		expect(result.execResult.executionGasUsed).toBe(3450n)
	})

	it('should return padded 0 for an invalid signature', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()

		const result = await vm.evm.runCall({
			caller: hexToBytes('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: hexToBytes(p256VerifyAddress),
			data: hexToBytes(
				'c74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
				'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be81' + // s (flipped last bit to make invalid)
				'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
				'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c'   // msgHash
			),
		})

		// Should return 32-byte padded 0 for invalid signature
		const expected = new Uint8Array(32)
		
		expect(result.execResult.returnValue).toEqual(expected)
		expect(result.execResult.executionGasUsed).toBe(3450n)
	})

	it('should return padded 0 for incorrect input length', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()

		// 159 bytes instead of 160
		const result = await vm.evm.runCall({
			caller: hexToBytes('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: hexToBytes(p256VerifyAddress),
			data: hexToBytes(
				'c74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
				'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be80' + // s
				'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
				'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652' // msgHash (missing 1 byte)
			),
		})

		// Should return 32-byte padded 0 for incorrect input length
		const expected = new Uint8Array(32)
		
		expect(result.execResult.returnValue).toEqual(expected)
		expect(result.execResult.executionGasUsed).toBe(3450n)
	})

	it('should return padded 0 for malformed data', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()

		// All zeros (160 bytes)
		const result = await vm.evm.runCall({
			caller: hexToBytes('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: hexToBytes(p256VerifyAddress),
			data: new Uint8Array(160), // All zeros
		})

		// Should return 32-byte padded 0 for malformed data
		const expected = new Uint8Array(32)
		
		expect(result.execResult.returnValue).toEqual(expected)
		expect(result.execResult.executionGasUsed).toBe(3450n)
	})
})