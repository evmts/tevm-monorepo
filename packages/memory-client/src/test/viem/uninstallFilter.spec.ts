import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('uninstallFilter', async () => {
	it('should uninstall a filter', async () => {
		const filter = await mc.createBlockFilter()
		expect(mc.tevm.getFilters().get(filter.id)).toEqual({
			id: filter.id,
			tx: [],
			installed: {},
			type: 'Block',
			logs: [],
			created: expect.any(Number),
			blocks: [],
			err: undefined,
			registeredListeners: [expect.any(Function)],
		})
		const result = await mc.uninstallFilter({ filter })
		expect(result).toEqual(true)
		expect(mc.tevm.getFilters().get(filter.id)).toBeUndefined()
	})
})
