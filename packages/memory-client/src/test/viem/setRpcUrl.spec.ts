import type { TestActions } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setRpcUrl', () => {
	it('should throw an error', async () => {
		const e = await mc
			.setRpcUrl('https://')
			.catch((e) => e)
			.then((res) => {
				if (res instanceof Error) return res
				throw new Error('should have thrown')
			})
		expect(e).toMatchSnapshot()
	})
})
