import { existsSync, rmSync } from 'node:fs'
import { createMemoryClient } from '@tevm/memory-client'
import { expect, test } from 'vitest'
import { fsPrecompile } from './FsPrecompile.js'

test('Call precompile from TypeScript', async () => {
	const client = createMemoryClient({
		customPrecompiles: [fsPrecompile.precompile()],
	})

	const result = await client.tevmContract(fsPrecompile.contract.write.writeFile('test1.txt', 'hello world'))

	expect(result.errors).toBeUndefined()

	expect(existsSync('test1.txt')).toBe(true)
	expect(
		(
			await client.tevmContract({
				...fsPrecompile.contract.read.readFile('test1.txt'),
			})
		).data,
	).toBe('hello world')

	rmSync('test1.txt')
})

test('Call precompile from solidity script', async () => {
	const { WriteHelloWorld } = await import('./WriteHelloWorld.s.sol')

	const client = createMemoryClient({
		customPrecompiles: [fsPrecompile.precompile()],
		loggingLevel: 'trace',
	})

	const result = await client.tevmContract({
		...WriteHelloWorld.write.write(fsPrecompile.contract.address),
		throwOnFail: false,
	})

	expect(existsSync('test.txt')).toBe(true)

	rmSync('test.txt')

	expect(result.errors).toBeUndefined()
})
