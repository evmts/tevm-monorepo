import { InvalidParamsError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { createCommon } from './createCommon.js'
import { createMockKzg } from './createMockKzg.js'
import { optimism } from './presets/index.js'

const frontierToOsakaHardforks = [
	'chainstart',
	'homestead',
	'dao',
	'tangerineWhistle',
	'spuriousDragon',
	'byzantium',
	'constantinople',
	'petersburg',
	'istanbul',
	'muirGlacier',
	'berlin',
	'london',
	'arrowGlacier',
	'grayGlacier',
	'mergeNetsplitBlock',
	'mergeForkIdTransition',
	'paris',
	'shanghai',
	'cancun',
	'prague',
	'osaka',
] as const

describe(createCommon.name, () => {
	it('uses hardfork-native EIP activation by default', () => {
		const frontier = createCommon({ ...optimism, hardfork: 'chainstart', loggingLevel: 'warn' })
		expect(frontier.ethjsCommon.hardfork()).toBe('chainstart')
		expect(frontier.ethjsCommon.isActivatedEIP(1559)).toBe(false)
		expect(frontier.ethjsCommon.isActivatedEIP(4895)).toBe(false)
		expect(frontier.ethjsCommon.isActivatedEIP(4844)).toBe(false)
		expect(frontier.ethjsCommon.isActivatedEIP(4788)).toBe(false)

		const prague = createCommon({ ...optimism, hardfork: 'prague', loggingLevel: 'warn' })
		expect(prague.ethjsCommon.hardfork()).toBe('prague')
		expect(prague.ethjsCommon.isActivatedEIP(1559)).toBe(true)
		expect(prague.ethjsCommon.isActivatedEIP(4895)).toBe(true)
		expect(prague.ethjsCommon.isActivatedEIP(4844)).toBe(true)
		expect(prague.ethjsCommon.isActivatedEIP(4788)).toBe(true)
	})

	it('covers frontier-to-osaka hardfork boundaries', () => {
		for (const hardfork of frontierToOsakaHardforks) {
			const common = createCommon({ ...optimism, hardfork, loggingLevel: 'warn' })
			const expected = hardfork === 'mergeForkIdTransition' ? 'mergeNetsplitBlock' : hardfork
			expect(common.ethjsCommon.hardfork()).toBe(expected)
		}

		const london = createCommon({ ...optimism, hardfork: 'london', loggingLevel: 'warn' })
		expect(london.ethjsCommon.isActivatedEIP(1559)).toBe(true)
		expect(london.ethjsCommon.isActivatedEIP(4895)).toBe(false)

		const shanghai = createCommon({ ...optimism, hardfork: 'shanghai', loggingLevel: 'warn' })
		expect(shanghai.ethjsCommon.isActivatedEIP(1559)).toBe(true)
		expect(shanghai.ethjsCommon.isActivatedEIP(4895)).toBe(true)
		expect(shanghai.ethjsCommon.isActivatedEIP(4844)).toBe(false)

		const cancun = createCommon({ ...optimism, hardfork: 'cancun', loggingLevel: 'warn' })
		expect(cancun.ethjsCommon.isActivatedEIP(1559)).toBe(true)
		expect(cancun.ethjsCommon.isActivatedEIP(4895)).toBe(true)
		expect(cancun.ethjsCommon.isActivatedEIP(4844)).toBe(true)
		expect(cancun.ethjsCommon.isActivatedEIP(4788)).toBe(true)

		const osaka = createCommon({ ...optimism, hardfork: 'osaka', loggingLevel: 'warn' })
		expect(osaka.ethjsCommon.hardfork()).toBe('osaka')
		expect(osaka.ethjsCommon.isActivatedEIP(1559)).toBe(true)
	})

	it('creates a common instance with custom EIPs', () => {
		const customEIPs = [2718, 2929]
		const common = createCommon({ ...optimism, hardfork: 'prague', eips: customEIPs, loggingLevel: 'info' })
		expect(common.ethjsCommon.hardfork()).toBe('prague')
		expect(common.ethjsCommon.isActivatedEIP(2718)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(2929)).toEqual(true)
	})

	it('wraps unsupported EIP errors', () => {
		expect(() => createCommon({ ...optimism, hardfork: 'prague', eips: [6800], loggingLevel: 'warn' })).toThrow(
			InvalidParamsError,
		)
	})

	it('creates a copy of the common instance', () => {
		const common = createCommon({ ...optimism, hardfork: 'prague', loggingLevel: 'debug' })
		const commonCopy = common.copy()
		expect(commonCopy).not.toBe(common)
		expect(commonCopy.ethjsCommon.hardfork()).toBe('prague')
		expect(commonCopy.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(commonCopy.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})

	it('applies custom crypto options', () => {
		const kzg = createMockKzg()
		const common = createCommon({
			...optimism,
			hardfork: 'prague',
			loggingLevel: 'debug',
			customCrypto: {
				kzg,
			},
		})
		expect(common.ethjsCommon.customCrypto.kzg).toBe(kzg)
	})

	it('handles missing optional parameters', () => {
		const common = createCommon({ ...optimism, loggingLevel: 'info', hardfork: 'prague' })
		expect(common.ethjsCommon.hardfork()).toBe('prague')
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
	})

	it('should handle invalid hardfork errors', () => {
		let err: any
		try {
			createCommon({ ...optimism, loggingLevel: 'info', hardfork: 'not valid hardfork' as any })
		} catch (e) {
			err = e
		}
		expect(err).toBeDefined()
		expect(err).toBeInstanceOf(InvalidParamsError)
		expect(err.message).toContain('not valid hardfork')
		expect(err).toMatchSnapshot()
	})

	it('should default hardfork to prague', () => {
		const common = createCommon({ ...optimism, loggingLevel: 'info' })
		expect(common.ethjsCommon.hardfork()).toBe('prague')
		expect(common.ethjsCommon.isActivatedEIP(1559)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toEqual(true)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toEqual(true)
	})

	it('does not force-enable post-frontier EIPs on old hardforks', () => {
		const customEIPs = [2537, 3855]
		const common = createCommon({ ...optimism, hardfork: 'byzantium', eips: customEIPs })

		expect(common.ethjsCommon.isActivatedEIP(1559)).toBe(false)
		expect(common.ethjsCommon.isActivatedEIP(4895)).toBe(false)
		expect(common.ethjsCommon.isActivatedEIP(4844)).toBe(false)
		expect(common.ethjsCommon.isActivatedEIP(4788)).toBe(false)

		expect(common.ethjsCommon.isActivatedEIP(2537)).toBe(true)
		expect(common.ethjsCommon.isActivatedEIP(3855)).toBe(true)
	})

	it('wraps errors in InvalidParamsError', () => {
		const invalidHardfork = 'not-a-valid-hardfork'

		let err: any
		try {
			createCommon({
				...optimism,
				hardfork: invalidHardfork as any,
			})
		} catch (e) {
			err = e
		}

		expect(err).toBeDefined()
		expect(err).toBeInstanceOf(InvalidParamsError)
		expect(err.cause).toBeDefined()
	})
})
