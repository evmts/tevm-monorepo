import { describe, expect, it } from 'bun:test'
import { createCommon } from './createCommon.js'
import { optimism } from './presets/index.js'
import { createMockKzg } from './createMockKzg.js'

describe(createCommon.name, () => {
	it('wraps ethereumjs common with default eips', () => {
		const common = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'warn' })
		expect(common.ethjsCommon.hardfork()).toBe('cancun')
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})

	it('creates a common instance with custom EIPs', () => {
		const customEIPs = [2718, 2929]
		const common = createCommon({ ...optimism, hardfork: 'cancun', eips: customEIPs, loggingLevel: 'info' })
		expect(common.ethjsCommon.hardfork()).toBe('cancun')
		expect(common.ethjsCommon.isActivatedEIP(2718)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(2929)).toEqual(true)
	})

	it('logs warnings when EIP 6800 is activated', () => {
		const customEIPs = [6800]
		const common = createCommon({ ...optimism, hardfork: 'cancun', eips: customEIPs, loggingLevel: 'warn' })
		expect(common.ethjsCommon.isActivatedEIP(6800)).toEqual(true)
	})

	it('creates a copy of the common instance', () => {
		const common = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'debug' })
		const commonCopy = common.copy()
		expect(commonCopy).not.toBe(common)
		expect(commonCopy.ethjsCommon.hardfork()).toBe('cancun')
		expect(commonCopy.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})

	it('applies custom crypto options', () => {
		const kzg = createMockKzg()
		const common = createCommon({
			...optimism,
			hardfork: 'cancun',
			loggingLevel: 'debug',
			customCrypto: {
				kzg,
			},
		})
		expect(common.ethjsCommon.customCrypto.kzg).toBe(kzg)
	})

	it('logs the creation of the common instance with enabled EIPs', () => {
		const common = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'debug' })
		// Assuming createLogger has been implemented to log debug messages correctly
		expect(common.ethjsCommon.hardfork()).toBe('cancun')
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})

	it('handles missing optional parameters', () => {
		const common = createCommon({ ...optimism, loggingLevel: 'info', hardfork: 'cancun' })
		expect(common.ethjsCommon.hardfork()).toBe('cancun') // default hardfork
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})
})
