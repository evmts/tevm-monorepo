import { describe, expect, it } from 'vitest'
import { formatPath } from './formatPath.js'

describe(formatPath.name, () => {
	it('should replace backslashes with forward slashes', () => {
		const contractPath = 'C:\\Users\\user\\project\\contracts\\MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toMatchInlineSnapshot('"C:/Users/user/project/contracts/MyContract.sol"')
	})

	it('should leave forward slashes untouched', () => {
		const contractPath = '/Users/user/project/contracts/MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toBe('/Users/user/project/contracts/MyContract.sol')
	})

	it('should handle mixed slash formats correctly', () => {
		const contractPath = 'C:/Users\\user/project\\contracts/MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toBe('C:/Users/user/project/contracts/MyContract.sol')
	})

	it('should handle empty strings correctly', () => {
		const contractPath = ''
		const actual = formatPath(contractPath)
		expect(actual).toBe('')
	})

	it('should handle relative paths correctly', () => {
		const contractPath = '.\\..\\contracts\\MyContract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toBe('./../contracts/MyContract.sol')
	})

	it('should handle paths with special characters correctly', () => {
		const contractPath = 'C:\\Users\\user name\\project\\contracts\\My Contract.sol'
		const actual = formatPath(contractPath)
		expect(actual).toBe('C:/Users/user name/project/contracts/My Contract.sol')
	})
})
