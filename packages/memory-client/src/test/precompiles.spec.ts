import type { CustomPrecompile } from '@tevm/node'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'

describe('precompiles option', () => {
	it('should be able to add custom precompiles', async () => {
		const address = '0xff420000000000000000000000000000000000ff'
		const sender = '0x1f420000000000000000000000000000000000ff'
		const expectedReturn = hexToBytes('0x420')
		const expectedGas = BigInt(69)

		const precompile: CustomPrecompile = {
			// TODO modify the api to take a hex address instead of ethjs address
			address: new EthjsAddress(hexToBytes(address)),
			// Note ethereumjs fails if you don't include the args here because it checks code.length for some reason
			// code.length returns the number of arguments in the case of a function
			// see https://github.com/ethereumjs/ethereumjs-monorepo/pull/3158/files
			function: (_) => {
				return {
					executionGasUsed: expectedGas,
					returnValue: expectedReturn,
				}
			},
		}

		const tevm = createMemoryClient({ customPrecompiles: [precompile] })
		expect(
			((await tevm.transport.tevm.getVm()).evm as any).getPrecompile(new EthjsAddress(hexToBytes(address))),
		).toEqual(precompile.function)
		const result = await tevm.tevmCall({
			to: address,
			gas: BigInt(30000),
			data: '0x0',
			caller: sender,
		})
		expect(result.errors).toBeUndefined()
		expect(result.rawData).toEqual(bytesToHex(expectedReturn))
		expect(result.executionGasUsed).toEqual(expectedGas)
	})

	it('should have p256verify precompile (RIP-7212) available by default', async () => {
		const p256VerifyAddress = '0x0000000000000000000000000000000000000100'
		const sender = '0x2a6c7bb649234ee2656550e163c8aaaed7318dcb'

		const tevm = createMemoryClient()
		
		// Test with valid signature
		const validResult = await tevm.tevmCall({
			to: p256VerifyAddress,
			gas: BigInt(30000),
			data: 
				'0xc74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
				'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be80' + // s
				'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
				'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c',  // msgHash
			caller: sender,
		})
		
		expect(validResult.errors).toBeUndefined()
		expect(validResult.executionGasUsed).toEqual(3450n)
		
		// Should return 32-byte padded 1 for valid signature
		const expectedValid = bytesToHex(new Uint8Array(32).fill(0, 0, 31).fill(1, 31, 32))
		expect(validResult.rawData).toEqual(expectedValid)

		// Test with invalid signature (flipped bit in s component)
		const invalidResult = await tevm.tevmCall({
			to: p256VerifyAddress,
			gas: BigInt(30000),
			data: 
				'0xc74ace4c2ccdb912b6876fa178a4a7adb6ea0916bfa73aa2c73fb4df5ce133a6' + // r
				'ae85d3657b170fb227cd404e3ae80e1974e885d6c0999094aad732979040be81' + // s (flipped last bit)
				'2c795862878f462f200a403b062c1b24e7de207f0c16f3e4d98d4c221c5e653b' + // x
				'2bd4817b59b8bdc0157af76bd95077d68a96c53a15c84fbd568c8759364aa1bf' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c',  // msgHash
			caller: sender,
		})
		
		expect(invalidResult.errors).toBeUndefined()
		expect(invalidResult.executionGasUsed).toEqual(3450n)
		
		// Should return 32-byte padded 0 for invalid signature
		const expectedInvalid = bytesToHex(new Uint8Array(32))
		expect(invalidResult.rawData).toEqual(expectedInvalid)
	})
})
