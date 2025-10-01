import type { CustomPrecompile } from '@tevm/node'
import { EthjsAddress, Hex, bytesToHex, hexToBytes } from '@tevm/utils'
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

		// Test with valid signature (generated with noble/curves p256, prehash: false)
		const validResult = await tevm.tevmCall({
			to: p256VerifyAddress,
			gas: BigInt(30000),
			data: ('0x' +
				'42cc3259a07ff17f7c35181e57688bf5954cb91f265f83e971f2525d9ae28732' + // r
				'13e0bcb7899bff163261f28d4665097e429937f7ed500ac93aef2875342b0ecd' + // s
				'5ef59bf56970fb35c0606f3c4a295b22afca864f4baf1da646af8ef0c0ba50dc' + // x
				'c2e11decac2b8561ddd38f68823c2379918a86e6289090edb8c24757dc10004a' + // y
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c') as Hex, // msgHash
			caller: sender,
		})

		expect(validResult.errors).toBeUndefined()
		expect(validResult.executionGasUsed).toEqual(3450n)

		// Should return 32-byte padded 1 for valid signature
		const expectedValid = bytesToHex(new Uint8Array(32).fill(0, 0, 31).fill(1, 31, 32))
		expect(validResult.rawData).toEqual(expectedValid)

		// Test with invalid signature (flipped last bit in s component)
		const invalidResult = await tevm.tevmCall({
			to: p256VerifyAddress,
			gas: BigInt(30000),
			data: ('0x' +
				'42cc3259a07ff17f7c35181e57688bf5954cb91f265f83e971f2525d9ae28732' + // r (same as valid)
				'13e0bcb7899bff163261f28d4665097e429937f7ed500ac93aef2875342b0ecc' + // s (flipped last bit: cd -> cc)
				'5ef59bf56970fb35c0606f3c4a295b22afca864f4baf1da646af8ef0c0ba50dc' + // x (same as valid)
				'c2e11decac2b8561ddd38f68823c2379918a86e6289090edb8c24757dc10004a' + // y (same as valid)
				'e928602caf3f7716ee83abc596147665d9adfe7154a05440555571cefbe9652c') as Hex, // msgHash (same as valid)
			caller: sender,
		})

		expect(invalidResult.errors).toBeUndefined()
		expect(invalidResult.executionGasUsed).toEqual(3450n)

		// Should return 32-byte padded 0 for invalid signature
		const expectedInvalid = bytesToHex(new Uint8Array(32))
		expect(invalidResult.rawData).toEqual(expectedInvalid)
	})
})
