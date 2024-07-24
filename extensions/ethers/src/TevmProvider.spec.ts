import { ERC20 } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { expect, it } from 'vitest'
import { TevmProvider } from './TevmProvider.js'

const provider = await TevmProvider.createMemoryProvider({
	fork: {
		transport: transports.optimism,
		blockTag: 121111705n,
	},
})

it('should be able to use like a normal JsonRpcProvider', async () => {
	expect(await provider.send('eth_chainId', [])).toBe('0xa')
})

it('can do some special tevm specific requests tooo', async () => {
	await provider.tevm.setAccount({
		address: `0x${'69'.repeat(20)}`,
		balance: 420n,
	})
	expect(
		await provider.tevm.getAccount({
			address: `0x${'69'.repeat(20)}`,
		}),
	).toEqual({
		address: '0x6969696969696969696969696969696969696969',
		balance: 420n,
		codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		deployedBytecode: '0x',
		isContract: false,
		isEmpty: false,
		nonce: 0n,
		storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	})
})

it('can run arbitrary solidity bytecode', async () => {
	// Note: you can also do javascript precompiles (similar to cheat codes in foundry)
	const runScriptREsult = await provider.tevm.contract(
		ERC20.script({ constructorArgs: ['name', 'SYMBOL'] }).read.balanceOf(`0x${'69'.repeat(20)}`),
	)
	expect(runScriptREsult).toEqual({
		amountSpent: 1454773185243n,
		executionGasUsed: 2851n,
		gas: 29975717n,
		totalGasSpent: 24283n,
		createdAddresses: new Set(),
		data: 0n,
		logs: [],
		rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
		selfdestruct: new Set(),
	})
})
