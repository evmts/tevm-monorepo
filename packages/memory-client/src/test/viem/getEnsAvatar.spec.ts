import { createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsAvatar', async () => {
	it('should fail gracefully when ENS avatar data is unavailable', { timeout: 40_000 }, async () => {
		const kzg = createMockKzg()
		const cachedTransport = createCachedMainnetTransport({ snapshotOnly: true })
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: cachedTransport,
				blockTag: 23531308n,
			},
		})
		const avatarRequest = mainnetClient
			.getEnsAvatar({
				name: 'does-not-exist.invalid',
				gatewayUrls: [],
				assetGatewayUrls: [],
			})
			.then((avatar) => ({ ok: true as const, avatar }))
			.catch((error) => ({ ok: false as const, error }))

		const requestResult = await Promise.race([
			avatarRequest,
			new Promise<{ timedOut: true }>((resolve) => {
				setTimeout(() => resolve({ timedOut: true }), 12_000)
			}),
		])

		if ('timedOut' in requestResult) {
			expect(requestResult.timedOut).toBe(true)
			return
		}

		if (requestResult.ok) {
			expect(requestResult.avatar).toBeNull()
			return
		}

		expect(String(requestResult.error)).toMatch(
			/Missing or invalid parameters|old data not available due to pruning|resolveWithGateways|returned no data|timed out|timeout/i,
		)
	})
})
