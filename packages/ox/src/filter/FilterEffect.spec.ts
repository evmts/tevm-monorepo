import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { FilterEffectLive, FilterEffectService } from './FilterEffect.js'

describe('FilterEffect', () => {
	const filter: FilterEffectService = FilterEffectLive

	it('should create a filter', async () => {
		const params = {
			fromBlock: 'latest',
			toBlock: 'latest',
			address: '0x1234567890123456789012345678901234567890',
		}
		const result = await Effect.runPromise(filter.createFilterEffect(params))
		expect(result).toBeDefined()
		expect(result.id).toBeDefined()
	})

	it('should get filter changes', async () => {
		const params = {
			fromBlock: 'latest',
			toBlock: 'latest',
			address: '0x1234567890123456789012345678901234567890',
		}
		const filterResult = await Effect.runPromise(filter.createFilterEffect(params))
		const result = await Effect.runPromise(filter.getFilterChangesEffect(filterResult.id))
		expect(Array.isArray(result)).toBe(true)
	})

	it('should uninstall a filter', async () => {
		const params = {
			fromBlock: 'latest',
			toBlock: 'latest',
			address: '0x1234567890123456789012345678901234567890',
		}
		const filterResult = await Effect.runPromise(filter.createFilterEffect(params))
		const result = await Effect.runPromise(filter.uninstallFilterEffect(filterResult.id))
		expect(typeof result).toBe('boolean')
	})

	it('should get filter logs', async () => {
		const params = {
			fromBlock: 'latest',
			toBlock: 'latest',
			address: '0x1234567890123456789012345678901234567890',
		}
		const filterResult = await Effect.runPromise(filter.createFilterEffect(params))
		const result = await Effect.runPromise(filter.getFilterLogsEffect(filterResult.id))
		expect(Array.isArray(result)).toBe(true)
	})
})
