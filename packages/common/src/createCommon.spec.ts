import { describe, expect, it } from 'bun:test'
import { createCommon } from './createCommon.js'
import { optimism } from './presets/index.js'

describe(createCommon.name, () => {
	it('wraps ethereumjs common with default eips', () => {
		const common = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'warn' })
		expect(common.hardfork()).toBe('cancun')
		expect(common.isActivatedEIP(1559)).toEqual(true)
		expect(common.isActivatedEIP(4788)).toEqual(true)
		expect(common.isActivatedEIP(4844)).toEqual(true)
		expect(common.isActivatedEIP(4895)).toEqual(true)
	})
})
