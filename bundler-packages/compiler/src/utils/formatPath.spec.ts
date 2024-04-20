import { describe, expect, it } from 'vitest'
import { formatPath } from './formatPath.js'

describe(formatPath.name, () => {
	it('should replace backslashes with forward slashes', () => {
		const contractPath = 'C:\\Users\\user\\project\\contracts\\MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toMatchInlineSnapshot('"C:/Users/user/project/contracts/MyContract.sol"')
	})
})
