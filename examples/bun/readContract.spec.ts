import { readContract } from './readContract'
import { expect, test } from 'bun:test'

test(readContract.name, async () => {
	expect(await readContract()).toBe(BigInt(1))
})
