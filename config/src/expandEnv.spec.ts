import { expandEnv } from './expandEnv'
import { describe, expect, it } from 'vitest'

describe(expandEnv.name, () => {
	it('should expand env', () => {
		expect(
			expandEnv('$ETHERSCAN_API_KEY', {
				ETHERSCAN_API_KEY: 'abcdefg',
			}),
		).toBe('abcdefg')
	})
	it('should expand env with postpended text', () => {
		expect(
			expandEnv('$ETHERSCAN_API_KEY-more-stuff', {
				ETHERSCAN_API_KEY: 'abcdefg',
			}),
		).toBe('abcdefg-more-stuff')
	})
	it('should expand env with preprended text', () => {
		expect(
			expandEnv('PRE$ETHERSCAN_API_KEY', {
				ETHERSCAN_API_KEY: 'abcdefg',
			}),
		).toBe('PREabcdefg')
	})
})
