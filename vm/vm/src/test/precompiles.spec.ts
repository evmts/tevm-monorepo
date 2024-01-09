import { type CustomPrecompile } from '../CustomPrecompile.js'
import { createTevm } from '../createTevm.js'
import { Address } from '@ethereumjs/util'
import { describe, expect, it } from 'bun:test'
import { bytesToHex, hexToBytes } from 'viem'

describe('precompiles option', () => {
	it('should be able to add custom precompiles', async () => {
		const address = '0xff420000000000000000000000000000000000ff'
		const sender = '0x1f420000000000000000000000000000000000ff'
		const expectedReturn = hexToBytes('0x420')
		const expectedGas = BigInt(69)

		const precompile: CustomPrecompile = {
			// TODO modify the api to take a hex address instead of ethjs address
			address: new Address(hexToBytes(address)),
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

		const tevm = await createTevm({ customPrecompiles: [precompile] })
		expect(tevm._evm.getPrecompile(new Address(hexToBytes(address)))).toEqual(
			precompile.function,
		)
		const result = await tevm.call({
			to: address,
			gasLimit: BigInt(30000),
			data: '0x0',
			caller: sender,
		})
		expect(result.errors).toBeUndefined()
		expect(result.rawData).toEqual(bytesToHex(expectedReturn))
		expect(result.executionGasUsed).toEqual(expectedGas)
	})
})
