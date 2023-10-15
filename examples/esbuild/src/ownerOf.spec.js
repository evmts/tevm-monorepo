import { ownerOf } from './ownerOf'
import { describe, expect, it } from 'vitest'

describe(ownerOf.name, () => {
	it('should work', async () => {
		await expect(ownerOf()).resolves.toBe(
			'0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6',
		)
		await expect(ownerOf(BigInt(420))).resolves.toBe(
			'0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
		)
	})
})
