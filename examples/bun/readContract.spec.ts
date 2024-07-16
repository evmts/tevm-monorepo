import { expect, test } from 'vitest'
import { readContract } from './readContract'

test(readContract.name, async () => {
	expect(await readContract()).toBe(BigInt(1))
})
