import { TevmProvider } from './TevmProvider.js'
import { Interface } from './contract/index.js'
import { createContract, createScript } from '@tevm/contract'
import { toHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'

const FORK_URL = 'https://mainnet.optimism.io'

describe(TevmProvider.name, () => {
	let provider: TevmProvider

	beforeEach(async () => {
		provider = await TevmProvider.createMemoryProvider({
			fork: {
				url: FORK_URL,
			},
		})
	})

	it('should be able to use like a normal JsonRpcProvider', async () => {
		expect(await provider.send('eth_chainId', [])).toBe('0x384')
	})

	describe('should be able to do tevm specific requests', async () => {
		it('provider.send', async () => {
			expect(
				await provider.send('tevm_setAccount', [
					{
						address: `0x${'69'.repeat(20)}`,
						nonce: toHex(1n),
						balance: toHex(420n),
					},
				]),
			).toEqual({})
			expect(
				await provider.send('tevm_getAccount', [
					{
						address: `0x${'69'.repeat(20)}`,
					},
				]),
			).toEqual({
				address: '0x6969696969696969696969696969696969696969',
				balance: toHex(420n),
				deployedBytecode: '0x',
				nonce: toHex(1n),
				storageRoot:
					'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			})
		})

		it('provider.tevm.script', async () => {
			const addContract = createScript({
				name: 'AddContract',
				humanReadableAbi: [
					'function add(uint256 a, uint256 b) public pure returns (uint256)',
				],
				deployedBytecode:
					'0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
				bytecode:
					'0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
			} as const)

			const result = await provider.tevm.script(addContract.read.add(390n, 30n))
			expect(result).toEqual({
				createdAddresses: new Set(),
				data: 420n,
				executionGasUsed: 927n,
				gas: 16776288n,
				logs: [],
				rawData:
					'0x00000000000000000000000000000000000000000000000000000000000001a4',
				selfdestruct: new Set(),
			})
		})

		it('provider.tevm.setAccount', async () => {
			const result = await provider.tevm.setAccount({
				address: `0x${'69'.repeat(20)}`,
				balance: 420n,
			})
			if ('errors' in result || result.errors) {
				throw new Error('should not have errors')
			}
			expect(result).toEqual({})
		})

		it('provider.tevm.call', async () => {
			const daiContract = createContract({
				name: 'Dai',
				humanReadableAbi: [
					'function balanceOf(address account) public view returns (uint256)',
				],
			} as const)
			const iface = new Interface(daiContract.abi)
			const data = iface.encodeFunctionData('balanceOf', [
				`0x${'69'.repeat(20)}`,
			]) as `0x${string}`
			const result = await provider.tevm.call({
				to: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
				data,
				caller: `0x${'69'.repeat(20)}`,
			})
			expect(result).toEqual({
				createdAddresses: new Set(),
				executionGasUsed: 2447n,
				gas: 16774768n,
				logs: [],
				rawData:
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				selfdestruct: new Set(),
			})
		})

		it('provider.tevm.contract', async () => {
			const daiContract = createContract({
				name: 'Dai',
				humanReadableAbi: [
					'function balanceOf(address account) public view returns (uint256)',
				],
			} as const)
			const result = await provider.tevm.contract(
				daiContract
					.withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1')
					.read.balanceOf(`0x${'69'.repeat(20)}`),
			)
			expect(result).toEqual({
				createdAddresses: new Set(),
				data: 0n,
				executionGasUsed: 2447n,
				gas: 16774768n,
				logs: [],
				rawData:
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				selfdestruct: new Set(),
			})
		})
	})
})
