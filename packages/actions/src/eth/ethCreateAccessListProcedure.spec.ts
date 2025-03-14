import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethCreateAccessListProcedure } from './ethCreateAccessListProcedure.js'

const erc20 = TestERC20.withAddress(createAddress(420420).toString())

describe('createAccessListHandler', () => {
	it('should create access list for contract call', async () => {
		const client = createTevmNode()
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: erc20.address,
					deployedBytecode: erc20.deployedBytecode,
				})
			).errors,
		).toBeUndefined()

		// test createAccessList with JSON-RPC format
		const result = await ethCreateAccessListProcedure(client)({
			method: 'eth_createAccessList',
			params: [
				{
					data: encodeFunctionData({
						abi: erc20.abi,
						functionName: 'balanceOf',
						args: [erc20.address],
					}),
					to: erc20.address,
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_createAccessList",
  "result": {
    "accessList": [
      {
        "address": "0x0000000000000000000000000000000000066a44",
        "storageKeys": [
          "0xf1accc61b11ca39f2c1d4ba4a393d616196b642a5f638560763cb25d022dff56",
        ],
      },
    ],
    "gasUsed": "0x5e0f",
  },
}
`)
	})
})
