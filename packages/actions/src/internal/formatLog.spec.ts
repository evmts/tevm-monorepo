import { expect, test } from 'vitest'
import { formatLog } from './formatLog.js'

test('formatLog should correctly format a complete log object', () => {
	const input = {
		address: '0x1234567890123456789012345678901234567890',
		topics: ['0xabcd', '0xdef0'],
		data: '0x1234',
		blockNumber: 123n,
		transactionHash: '0x2345678901234567890123456789012345678901234567890123456789012345',
		transactionIndex: 1n,
		blockHash: '0x3456789012345678901234567890123456789012345678901234567890123456',
		logIndex: 2n,
		removed: true,
	}

	const result = formatLog(input)

	expect(result).toEqual({
		address: '0x1234567890123456789012345678901234567890',
		topics: ['0xabcd', '0xdef0'],
		data: '0x1234',
		blockNumber: 123n,
		transactionHash: '0x2345678901234567890123456789012345678901234567890123456789012345',
		transactionIndex: 1n,
		blockHash: '0x3456789012345678901234567890123456789012345678901234567890123456',
		logIndex: 2n,
		removed: true,
	})
})

test('formatLog should fill in missing values with defaults', () => {
	const input = {
		address: '0x1234567890123456789012345678901234567890',
		topics: ['0xabcd', '0xdef0'],
		data: '0x1234',
		// Missing optional fields
	}

	const result = formatLog(input)

	expect(result).toEqual({
		address: '0x1234567890123456789012345678901234567890',
		topics: ['0xabcd', '0xdef0'],
		data: '0x1234',
		blockNumber: 0n,
		transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
		transactionIndex: 0n,
		blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
		logIndex: 0n,
		removed: false,
	})
})
