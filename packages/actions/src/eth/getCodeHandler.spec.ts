import { describe, expect, it } from 'bun:test'
import { getCodeHandler } from './getCodeHandler.js'
import { createBaseClient } from '@tevm/base-client'
import { SimpleContract } from '@tevm/test-utils'
import { createAddress } from '@tevm/address'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

const contract = SimpleContract.withAddress(createAddress(420420).toString())

describe(getCodeHandler.name, () => {
	it('should implement eth_getCode', async () => {
		const client = createBaseClient()

		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		expect(
			await getCodeHandler(client)({
				address: contract.address,
			}),
		).toBe(contract.deployedBytecode)
	})
})
