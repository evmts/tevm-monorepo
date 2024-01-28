import { createMemoryClient } from '@tevm/memory-client'
import { expect, test } from 'bun:test'

import { fsPrecompile } from './FsPrecompile.js'
import { existsSync, rmSync } from 'fs'

test('Call precompile from TypeScript', async () => {
	const client = await createMemoryClient({
		customPrecompiles: [fsPrecompile.precompile()],
	})

	await client.contract({
		...fsPrecompile.contract.write.writeFile('test.txt', 'hello world'),
	})

	expect(existsSync('test.txt')).toBe(true)
	expect(
		(
			await client.contract({
				...fsPrecompile.contract.read.readFile('test.txt'),
			})
		).data,
	).toBe('hello world')

	rmSync('test.txt')
})

test('Call precompile from solidity script', async () => {
	const { WriteHelloWorld } = await import('./WriteHelloWorld.s.sol')

	const vm = await createMemoryClient({
		customPrecompiles: [fsPrecompile.precompile()],
	})

	await vm.script(WriteHelloWorld.write.write(fsPrecompile.contract.address))

	expect(existsSync('test.txt')).toBe(true)

	rmSync('test.txt')
})
