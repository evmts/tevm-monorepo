import { createContract } from '@tevm/contract'
import { ERC20 } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { encodeDeployData, toHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { TevmProvider } from './TevmProvider.js'
import { Interface } from './contract/index.js'

describe(TevmProvider.name, () => {
	let provider: TevmProvider

	beforeEach(async () => {
		provider = await TevmProvider.createMemoryProvider({
			fork: {
				transport: transports.optimism,
				blockTag: 'latest',
			},
		})
	})

	it('should be able to use like a normal JsonRpcProvider', async () => {
		expect(await provider.send('eth_chainId', [])).toBe('0xa')
	})

	describe('should be able to do tevm specific requests', async () => {
		it(
			'provider.send',
			async () => {
				expect(
					await provider.send('tevm_setAccount', [
						{
							address: `0x${'69'.repeat(20)}`,
							nonce: toHex(1n),
							balance: toHex(420n),
						},
					]),
				).toMatchObject({})
				expect(
					await provider.send('tevm_getAccount', [
						{
							address: `0x${'69'.repeat(20)}`,
						},
					]),
				).toMatchObject({
					address: '0x6969696969696969696969696969696969696969',
					balance: toHex(420n),
					deployedBytecode: '0x',
					nonce: toHex(1n),
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					storage: undefined,
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					isContract: false,
					isEmpty: false,
				})
			},
			{ timeout: 15_000 },
		)

		it(
			'provider.tevm.script',
			async () => {
				const result = await provider.tevm.contract(
					ERC20.withCode(encodeDeployData(ERC20.deploy('name', 'SYMBOL'))).read.balanceOf(`0x${'69'.repeat(20)}`),
				)
				expect(result).toMatchObject({
					executionGasUsed: 2851n,
					totalGasSpent: 24283n,
					createdAddresses: new Set(),
					data: 0n,
					logs: [],
					rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
					selfdestruct: new Set(),
				})
			},
			{ timeout: 15_000 },
		)

		it(
			'provider.tevm.setAccount',
			async () => {
				const result = await provider.tevm.setAccount({
					address: `0x${'69'.repeat(20)}`,
					balance: 420n,
				})
				if ('errors' in result || result.errors) {
					throw new Error('should not have errors')
				}
				expect(result).toMatchObject({})
			},
			{ timeout: 15_000 },
		)

		it(
			'provider.tevm.call',
			async () => {
				const daiContract = createContract({
					name: 'Dai',
					humanReadableAbi: ['function balanceOf(address account) public view returns (uint256)'],
				} as const)
				const iface = new Interface(daiContract.abi)
				const data = iface.encodeFunctionData('balanceOf', [`0x${'69'.repeat(20)}`]) as `0x${string}`
				const result = await provider.tevm.call({
					to: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
					data,
					caller: `0x${'69'.repeat(20)}`,
				})
				expect(result).toMatchObject({
					totalGasSpent: 23879n,
					createdAddresses: new Set(),
					executionGasUsed: 2447n,
					logs: [],
					rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
					selfdestruct: new Set(),
				})
			},
			{ timeout: 15_000 },
		)

		it(
			'provider.tevm.contract',
			async () => {
				const daiContract = createContract({
					name: 'Dai',
					humanReadableAbi: ['function balanceOf(address account) public view returns (uint256)'],
				} as const)
				const result = await provider.tevm.contract(
					daiContract.withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1').read.balanceOf(`0x${'69'.repeat(20)}`),
				)
				expect(result).toMatchObject({
					totalGasSpent: 23879n,
					createdAddresses: new Set(),
					data: 0n,
					executionGasUsed: 2447n,
					logs: [],
					rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
					selfdestruct: new Set(),
				})
			},
			{ timeout: 15_000 },
		)
	})
})
