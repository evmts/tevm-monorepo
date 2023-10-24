import { formatPath } from './formatPath.js'
import { describe, expect, it } from 'vitest'

describe(formatPath.name, () => {
	it('should replace backslashes with forward slashes', () => {
		const contractPath = 'C:\\Users\\user\\project\\contracts\\MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toMatchInlineSnapshot(
			'"C:/Users/user/project/contracts/MyContract.sol"',
		)
	})
})
