import { describe, expect, it } from 'bun:test'
import { createCommon } from './createCommon.js'
import { optimism } from './presets/index.js'

describe(createCommon.name, () => {
	it('wraps ethereumjs common with default eips', () => {
		const common = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'warn' })
		expect(common.ethjsCommon.hardfork()).toBe('cancun')
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})
})
