import { describe, expect, test, vi } from 'vitest'

import { OffchainLookupExample } from '~test/contracts/generated.js'
import { baycContractConfig, usdcContractConfig } from '~test/src/abis.js'
import { createCcipServer } from '~test/src/ccip.js'
import { accounts, forkBlockNumber } from '~test/src/constants.js'
import {
	deployOffchainLookupExample,
	publicClient,
	publicClientMainnet,
	walletClientWithAccount,
} from '~test/src/utils.js'

import { aggregate3Signature } from '../../constants/contract.js'
import { BaseError } from '../../errors/base.js'
import { RawContractError } from '../../errors/contract.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { trim } from '../../utils/data/trim.js'
import { parseEther } from '../../utils/unit/parseEther.js'
import { parseGwei } from '../../utils/unit/parseGwei.js'
import { wait } from '../../utils/wait.js'

import { call, getRevertErrorData } from './call.js'

const wagmiContractAddress = '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2'
const name4bytes = '0x06fdde03'
const mint4bytes = '0x1249c58b'
const mintWithParams4bytes = '0xa0712d68'
const fourTwenty =
	'00000000000000000000000000000000000000000000000000000000000001a4'
const sixHundred =
	'0000000000000000000000000000000000000000000000000000000000000258'

const sourceAccount = accounts[0]

test('default', async () => {
	const { data } = await call(publicClient, {
		data: name4bytes,
		account: sourceAccount.address,
		to: wagmiContractAddress,
	})
	expect(data).toMatchInlineSnapshot(
		'"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000"',
	)
})

describe('ccip', () => {
	test('default', async () => {
		const server = await createCcipServer()
		const { contractAddress } = await deployOffchainLookupExample({
			urls: [`${server.url}/{sender}/{data}`],
		})

		const calldata = encodeFunctionData({
			abi: OffchainLookupExample.abi,
			functionName: 'getAddress',
			args: ['jxom.viem'],
		})

		const { data } = await call(publicClient, {
			data: calldata,
			to: contractAddress!,
		})

		expect(trim(data!)).toEqual(accounts[0].address)

		await server.close()
	})

	test('error: invalid signature', async () => {
		const server = await createCcipServer()
		const { contractAddress } = await deployOffchainLookupExample({
			urls: [`${server.url}/{sender}/{data}`],
		})

		const calldata = encodeFunctionData({
			abi: OffchainLookupExample.abi,
			functionName: 'getAddress',
			args: ['fake.viem'],
		})

		await expect(() =>
			call(publicClient, {
				data: calldata,
				to: contractAddress!,
			}),
		).rejects.toThrowError()

		await server.close()
	})
})

test('zero data', async () => {
	const { data } = await call(publicClient, {
		data: mint4bytes,
		account: sourceAccount.address,
		to: wagmiContractAddress,
	})
	expect(data).toMatchInlineSnapshot('undefined')
})

test('args: blockNumber', async () => {
	const { data } = await call(publicClient, {
		blockNumber: 15564164n,
		data: `${mintWithParams4bytes}${fourTwenty}`,
		account: sourceAccount.address,
		to: wagmiContractAddress,
	})
	expect(data).toMatchInlineSnapshot('undefined')
})

describe('account hoisting', () => {
	test.skip('no account hoisted', async () => {
		await expect(
			call(publicClient, {
				data: `${mintWithParams4bytes}${sixHundred}`,
				to: wagmiContractAddress,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Execution reverted with reason: ERC721: mint to the zero address.

      Raw Call Arguments:
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d680000000000000000000000000000000000000000000000000000000000000258
      
      Details: execution reverted: ERC721: mint to the zero address
      Version: viem@1.0.2"
    `)
	})

	test('account hoisted', async () => {
		const { data } = await call(walletClientWithAccount, {
			data: `${mintWithParams4bytes}${sixHundred}`,
			to: wagmiContractAddress,
		})
		expect(data).toMatchInlineSnapshot('undefined')
	})
})

describe('errors', () => {
	test('fee cap too high', async () => {
		await expect(() =>
			call(publicClient, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account: sourceAccount.address,
				to: wagmiContractAddress,
				maxFeePerGas: 2n ** 256n - 1n + 1n,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The fee cap (\`maxFeePerGas\` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1).

      Raw Call Arguments:
        from:          0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:            0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:          0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4
        maxFeePerGas:  115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei

      Version: viem@1.0.2"
    `)
	})

	// TODO:  Waiting for Anvil fix – should fail with "gas too low" reason
	//        This test will fail when Anvil is fixed.
	test('gas too low', async () => {
		await expect(() =>
			call(publicClient, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account: sourceAccount.address,
				to: wagmiContractAddress,
				gas: 100n,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The amount of gas (100) provided for the transaction exceeds the limit allowed for the block.

      Raw Call Arguments:
        from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4
        gas:   100

      Details: intrinsic gas too high -- CallGasCostMoreThanGasLimit
      Version: viem@1.0.2"
    `)

		await expect(() =>
			call(publicClientMainnet, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account: sourceAccount.address,
				to: wagmiContractAddress,
				gas: 100n,
			}),
		).rejects.toThrowError('intrinsic gas too low')
	})

	// TODO:  Waiting for Anvil fix – should fail with "gas too high" reason
	//        This test will fail when Anvil is fixed.
	test('gas too high', async () => {
		expect(
			await call(publicClient, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: 1n,
				gas: 100_000_000_000_000_000n,
			}),
		).toBeDefined()
	})

	// TODO:  Waiting for Anvil fix – should fail with "gas fee less than block base fee" reason
	//        This test will fail when Anvil is fixed.
	test('gas fee is less than block base fee', async () => {
		expect(
			await call(publicClient, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: 1n,
				maxFeePerGas: 1n,
			}),
		).toBeDefined()

		await expect(() =>
			call(publicClientMainnet, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: 1n,
				maxFeePerGas: 1n,
			}),
		).rejects.toThrowError('cannot be lower than the block base fee')
	})

	test('nonce too low', async () => {
		await expect(() =>
			call(publicClient, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: 1n,
				nonce: 0,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Nonce provided for the transaction is lower than the current nonce of the account.
      Try increasing the nonce or find the latest nonce with \`getTransactionCount\`.

      Raw Call Arguments:
        from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:     0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        value:  0.000000000000000001 ETH
        nonce:  0

      Details: nonce too low
      Version: viem@1.0.2"
    `)
	})

	test('insufficient funds', async () => {
		await expect(() =>
			call(publicClient, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: parseEther('100000'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.

      This error could arise when the account does not have enough funds to:
       - pay for the total gas fee,
       - pay for the value to send.
       
      The cost of the transaction is calculated as \`gas * gas fee + value\`, where:
       - \`gas\` is the amount of gas needed for transaction to execute,
       - \`gas fee\` is the gas fee,
       - \`value\` is the amount of ether to send to the recipient.
       
      Raw Call Arguments:
        from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:     0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        value:  100000 ETH

      Details: Insufficient funds for gas * price + value
      Version: viem@1.0.2"
    `)

		await expect(() =>
			call(publicClientMainnet, {
				account: sourceAccount.address,
				to: accounts[0].address,
				value: parseEther('100000'),
			}),
		).rejects.toThrowError('insufficient funds for gas * price + value')
	})

	test('maxFeePerGas less than maxPriorityFeePerGas', async () => {
		await expect(
			call(publicClient, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account: sourceAccount.address,
				to: wagmiContractAddress,
				maxFeePerGas: parseGwei('20'),
				maxPriorityFeePerGas: parseGwei('22'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "The provided tip (\`maxPriorityFeePerGas\` = 22 gwei) cannot be higher than the fee cap (\`maxFeePerGas\` = 20 gwei).

      Raw Call Arguments:
        from:                  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:                    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:                  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4
        maxFeePerGas:          20 gwei
        maxPriorityFeePerGas:  22 gwei

      Version: viem@1.0.2"
    `)
	})

	test('contract revert (contract error)', async () => {
		await expect(
			call(publicClient, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account: sourceAccount.address,
				to: wagmiContractAddress,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			`
      "Execution reverted with reason: Token ID is taken.

      Raw Call Arguments:
        from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4

      Details: execution reverted: Token ID is taken
      Version: viem@1.0.2"
    `,
		)
	})

	test('contract revert (insufficient params)', async () => {
		await expect(
			call(publicClient, {
				data: mintWithParams4bytes,
				account: sourceAccount.address,
				to: wagmiContractAddress,
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Execution reverted for an unknown reason.

      Raw Call Arguments:
        from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d68

      Details: execution reverted
      Version: viem@1.0.2"
    `)
	})
})

describe('batch call', () => {
	test('default', async () => {
		publicClient.batch = { multicall: true }

		const spy = vi.spyOn(publicClient, 'request')

		const p = []
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		await wait(50)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)

		const results = await Promise.all(p)

		expect(spy).toBeCalledTimes(4)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
      ]
    `)
	})

	test('args: blockNumber', async () => {
		publicClient.batch = { multicall: true }

		const spy = vi.spyOn(publicClient, 'request')

		const p = []
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
				blockNumber: forkBlockNumber,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
				blockNumber: forkBlockNumber + 1n,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
				blockNumber: forkBlockNumber,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		await wait(50)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)

		const results = await Promise.all(p)

		expect(spy).toBeCalledTimes(6)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
      ]
    `)
	})

	test('args: no address, no data, aggregate3 sig, other properties', async () => {
		publicClient.batch = { multicall: true }

		const spy = vi.spyOn(publicClient, 'request')

		const p = []
		p.push(
			call(publicClient, {
				data: name4bytes,
			}),
		)
		p.push(
			call(publicClient, {
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(publicClient, {
				data: aggregate3Signature,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
				maxFeePerGas: 1n,
			}),
		)

		try {
			await Promise.all(p)
		} catch {}

		expect(spy).toBeCalledTimes(4)
	})

	test('contract revert', async () => {
		const spy = vi.spyOn(publicClient, 'request')

		const p = []
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(publicClient, {
				data: `${mintWithParams4bytes}${fourTwenty}`,
				to: wagmiContractAddress,
			}),
		)

		const results = await Promise.allSettled(p)

		expect(spy).toBeCalledTimes(1)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "status": "fulfilled",
          "value": {
            "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
          },
        },
        {
          "reason": [CallExecutionError: Execution reverted for an unknown reason.

      Raw Call Arguments:
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4

      Version: viem@1.0.2],
          "status": "rejected",
        },
      ]
    `)
	})

	test('client config', async () => {
		publicClient.batch = {
			multicall: {
				batchSize: 1024,
				wait: 16,
			},
		}

		const spy = vi.spyOn(publicClient, 'request')

		const p = []
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)
		await wait(1)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		await wait(50)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		p.push(
			call(publicClient, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)

		const results = await Promise.all(p)

		expect(spy).toBeCalledTimes(2)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
      ]
    `)
	})

	test('no chain on client', async () => {
		const client = publicClient

		// @ts-expect-error
		client.chain = undefined
		client.batch = { multicall: true }

		const spy = vi.spyOn(client, 'request')

		const p = []
		p.push(
			call(client, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(client, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		p.push(
			call(client, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)

		const results = await Promise.all(p)

		expect(spy).toBeCalledTimes(3)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
      ]
    `)
	})

	test('chain not configured with multicall', async () => {
		const client = publicClient

		client.batch = { multicall: true }
		client.chain = {
			...client.chain,
			contracts: {
				// @ts-expect-error
				multicall3: undefined,
			},
		}

		const spy = vi.spyOn(client, 'request')

		const p = []
		p.push(
			call(client, {
				data: name4bytes,
				to: wagmiContractAddress,
			}),
		)
		p.push(
			call(client, {
				data: name4bytes,
				to: usdcContractConfig.address,
			}),
		)
		p.push(
			call(client, {
				data: name4bytes,
				to: baycContractConfig.address,
			}),
		)

		const results = await Promise.all(p)

		expect(spy).toBeCalledTimes(3)
		expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000855534420436f696e000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011426f7265644170655961636874436c7562000000000000000000000000000000",
        },
      ]
    `)
	})
})

describe('getRevertErrorData', () => {
	test('default', () => {
		expect(getRevertErrorData(new Error('lol'))).toBe(undefined)
		expect(getRevertErrorData(new BaseError('lol'))).toBe(undefined)
		expect(
			getRevertErrorData(
				new BaseError('error', {
					cause: new RawContractError({ data: '0xdeadbeef' }),
				}),
			),
		).toBe('0xdeadbeef')
		expect(
			getRevertErrorData(
				new BaseError('error', {
					cause: new RawContractError({ data: '0x556f1830' }),
				}),
			),
		).toBe('0x556f1830')
		expect(
			getRevertErrorData(
				new BaseError('error', {
					cause: new RawContractError({ data: { data: '0x556f1830' } }),
				}),
			),
		).toBe('0x556f1830')
	})
})
