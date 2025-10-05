import { EvmError } from '@tevm/evm'
import { hexToBigInt } from '@tevm/utils'
import { describe, expect, test } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'

// These regressed from switching to stricter tx running within the VM.runTx function
// It's running up against the block limit
// We will just remove the option for now and revisit later
describe('allowUnlimitedContractSize option', () => {
	test.todo('Should fail a evm call request if the file is too large', async () => {
		const tevm = createMemoryClient()
		const address1 = '0x1f420000000000000000000000000000000000ff'

		/*
Simple bytecode to deploy a large contract
`62` PUSH4, `FFFFFF` value being pushed, `60` PUSH1, `00` value, `F3` return
https://github.com/ethereumjs/ethereumjs-monorepo/blob/a0ef459e26f6a843d67bb2142977b67359109839/packages/evm/test/runCall.spec.ts#L543
*/
		const data = '0x62FFFFFF6000F3'

		const res = await tevm.tevmCall({
			caller: address1,
			data,
			value: hexToBigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
			gas: hexToBigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
			skipBalance: true,
			throwOnFail: false,
		})
		expect(res.errors?.[0]?.name).toBe(EvmError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM)
	})

	test.todo('Should deploy large files if allowUnlimitedContractSize option is true', async () => {
		const tevm = createMemoryClient({
			allowUnlimitedContractSize: true,
		})
		const address1 = '0x1f420000000000000000000000000000000000ff'

		const data = '0x62FFFFFF6000F3'
		const res = await tevm.tevmCall({
			caller: address1,
			data,
			value: hexToBigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
			gas: hexToBigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
			skipBalance: true,
			throwOnFail: false,
		})
		expect(res).not.toHaveProperty('errors')
	})
})
