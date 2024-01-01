import { Interface } from './Contract.js'
import { TevmJsonRpcProvider } from './TevmJsonRpcProvider.js'
import { createTevmContract } from '@tevm/contract'
import { createTevm } from '@tevm/vm'
import { Server, createServer } from 'http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const FORK_URL = 'https://mainnet.optimism.io'

describe(TevmJsonRpcProvider.name, () => {
	let server: Server
	let tevm: Awaited<ReturnType<typeof createTevm>>
	let provider: TevmJsonRpcProvider

	beforeAll(async () => {
		tevm = await createTevm({
			fork: { url: FORK_URL },
		})
		server = createServer(tevm.createHttpHandler())
		const PORT = 9420
		await new Promise((resolve) => {
			server.listen(PORT, 'localhost', () => {
				resolve(null)
			})
		})
		provider = new TevmJsonRpcProvider('http://localhost:9420')
	})

	afterAll(() => {
		server.close()
	})

	it('should be able to use like a normal JsonRpcProvider', async () => {
		expect(await provider.send('eth_chainId', [])).toBe('0xa')
	})

	describe('should be able to do tevm specific requests', async () => {
		it('provider.prototype.runScript', async () => {
			const addContract = createTevmContract({
				name: 'AddContract',
				humanReadableAbi: [
					'function add(uint256 a, uint256 b) public pure returns (uint256)',
				],
				deployedBytecode:
					'0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
				bytecode:
					'0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
			} as const)

			const provider = new TevmJsonRpcProvider('http://localhost:9420')
			const result = await provider.runScript(addContract.read.add(390n, 30n))
			expect(result).toEqual({
				data: 420n,
				gasUsed: 927n,
				logs: [],
			})
		})

		it('provider.prototype.putAccount', async () => {
			const provider = new TevmJsonRpcProvider('http://localhost:9420')
			const result = await provider.putAccount({
				account: `0x${'69'.repeat(20)}`,
				balance: 420n,
			})
			expect(result.balance).toEqual(420n)
		})

		it('provider.prototype.putContractCode', async () => {
			const provider = new TevmJsonRpcProvider('http://localhost:9420')
			const deployedBytecode =
				'0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033'
			const result = await provider.putContractCode({
				contractAddress: `0x${'69'.repeat(20)}`,
				deployedBytecode,
			})
			expect(result).toMatchSnapshot()
		})

		it('provider.prototype.runCall', async () => {
			const daiContract = createTevmContract({
				name: 'Dai',
				humanReadableAbi: [
					'function balanceOf(address account) public view returns (uint256)',
				],
				deployedBytecode: undefined,
				bytecode: undefined,
			} as const)
			const provider = new TevmJsonRpcProvider('http://localhost:9420')
			const iface = new Interface(daiContract.abi)
			const data = iface.encodeFunctionData('balanceOf', [
				`0x${'69'.repeat(20)}`,
			]) as `0x${string}`
			const result = await provider.runCall({
				to: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
				data,
				caller: `0x${'69'.repeat(20)}`,
			})
			expect(result).toEqual({
				execResult: {
					gas: 57896044618658097711785492504343953926634992332820282019728792003956564817520n,
					logs: [],
					returnValue:
						'0x0000000000000000000000000000000000000000000000000000000000000000',
				},
			})
		})

		it('provider.prototype.runContractCall', async () => {
			const daiContract = createTevmContract({
				name: 'Dai',
				humanReadableAbi: [
					'function balanceOf(address account) public view returns (uint256)',
				],
				deployedBytecode: undefined,
				bytecode: undefined,
			} as const)
			const provider = new TevmJsonRpcProvider('http://localhost:9420')
			const result = await provider.runContractCall({
				contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
				...daiContract.read.balanceOf(`0x${'69'.repeat(20)}`),
			})
			expect(result).toEqual({
				data: 0n,
				gasUsed: 447n,
				logs: [],
			})
		})
	})
})
