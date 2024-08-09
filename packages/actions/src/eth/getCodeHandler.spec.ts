import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getCodeHandler } from './getCodeHandler.js'

const contract = SimpleContract.withAddress(createAddress(420420).toString())

describe(getCodeHandler.name, () => {
	it('should implement eth_getCode', async () => {
		const client = createTevmNode()

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
