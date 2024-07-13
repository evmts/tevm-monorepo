import { describe, expect, it } from 'bun:test'
import { createAddress } from '@tevm/address'
import { createBaseClient } from '@tevm/base-client'
import { SimpleContract } from '@tevm/test-utils'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getCodeHandler } from './getCodeHandler.js'

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
