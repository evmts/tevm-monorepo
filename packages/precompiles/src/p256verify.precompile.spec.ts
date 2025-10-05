import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'

describe('p256verify precompile (RIP-7212)', () => {
	const p256VerifyAddress = '0x0000000000000000000000000000000000000100'

	it('should return padded 1 for a valid signature', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()

		const result = await vm.evm.runCall({
			caller: createAddress('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: createAddress(p256VerifyAddress),
			data: hexToBytes(
				('0x' +
					'c368addceeafc8d94381705a8dee5858eb29b54939a93ccded6184fd586b1dec' + // r
					'566f984f97172cd52328a8aaf42ba1e01d1274bade8041db1a0e56ba3fed8d00' + // s
					'515c3d6eb9e396b904d3feca7f54fdcd0cc1e997bf375dca515ad0a6c3b4035f' + // x
					'4536be3a50f318fbf9a5475902a221502bef0d57e08c53b2cc0a56f17d9f9354' + // y
					'000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f') as `0x${
					string // msgHash
				}`,
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
			caller: createAddress('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: createAddress(p256VerifyAddress),
			data: hexToBytes(
				('0x' +
					'c74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
					'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be81' + // s (flipped last bit to make invalid)
					'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
					'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
					'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c') as `0x${
					string // msgHash
				}`,
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
			caller: createAddress('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: createAddress(p256VerifyAddress),
			data: hexToBytes(
				('0x' +
					'c74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
					'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be80' + // s
					'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
					'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
					'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652') as `0x${
					string // msgHash (missing 1 byte)
				}`,
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
			caller: createAddress('0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'),
			to: createAddress(p256VerifyAddress),
			data: new Uint8Array(160), // All zeros
		})

		// Should return 32-byte padded 0 for malformed data
		const expected = new Uint8Array(32)

		expect(result.execResult.returnValue).toEqual(expected)
		expect(result.execResult.executionGasUsed).toBe(3450n)
	})
})
