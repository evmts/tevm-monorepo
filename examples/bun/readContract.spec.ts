import { expect, test } from 'bun:test'
import { readContract } from './readContract'

test(readContract.name, async () => {
	expect(await readContract()).toBe(BigInt(1))
})
