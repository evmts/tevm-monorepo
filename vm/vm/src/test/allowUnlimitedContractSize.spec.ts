import { createTevm } from '../createTevm.js'
import { EVMErrorMessage } from '@ethereumjs/evm'
import { expect, test } from 'bun:test'

test('Should fail a evm call request if the file is too large', async () => {
	const tevm = await createTevm()
	const address1 = '0x1f420000000000000000000000000000000000ff'

	/*
		Simple bytecode to deploy a large contract
		`62` PUSH4, `FFFFFF` value being pushed, `60` PUSH1, `00` value, `F3` return
		https://github.com/ethereumjs/ethereumjs-monorepo/blob/a0ef459e26f6a843d67bb2142977b67359109839/packages/evm/test/runCall.spec.ts#L543
	*/
	const data = '0x62FFFFFF6000F3'

	const res = await tevm.request({
		id: 1,
		method: 'tevm_call',
		jsonrpc: '2.0',
		params: {
			caller: address1,
			data,
		},
	})
	expect('error' in res && res.error.code).toBe(
		EVMErrorMessage.CODESIZE_EXCEEDS_MAXIMUM,
	)
})

test('Should deploy large files if allowUnlimitedContractSize option is true', async () => {
	const tevm = await createTevm({
		allowUnlimitedContractSize: true,
	})
	const address1 = '0x1f420000000000000000000000000000000000ff'

	const data = '0x62FFFFFF6000F3'
	const res = await tevm.request({
		id: 1,
		method: 'tevm_call',
		jsonrpc: '2.0',
		params: {
			caller: address1,
			data,
		},
	})
	expect(res.jsonrpc).toBe('2.0')
	expect(res.id).toBe(1)
	expect(res.method).toBe('tevm_call')
	expect(res).not.toHaveProperty('error')
})
