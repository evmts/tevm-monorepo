import { concatHex, encodeAbiParameters } from 'viem'
import { describe, expect, it } from 'vitest'
import { decodeRevertReason } from './decodeRevertReason.js'

describe('decodeRevertReason', () => {
	const ERROR_SELECTOR = '0x08c379a0' as const
	const PANIC_SELECTOR = '0x4e487b71' as const

	describe('empty data cases', () => {
		it('should return base message for empty data', () => {
			expect(decodeRevertReason(undefined)).toBe('execution reverted')
			expect(decodeRevertReason('')).toBe('execution reverted')
			expect(decodeRevertReason('0x')).toBe('execution reverted')
		})
	})

	describe('Error(string) decoding', () => {
		it('should decode standard error messages', () => {
			const reason = 'insufficient balance'
			const encoded = encodeAbiParameters([{ type: 'string' }], [reason])
			const data = concatHex([ERROR_SELECTOR, encoded])

			expect(decodeRevertReason(data)).toBe(`execution reverted: ${reason}`)
		})

		it('should fallback to base message for empty error string', () => {
			const encoded = encodeAbiParameters([{ type: 'string' }], [''])
			const data = concatHex([ERROR_SELECTOR, encoded])

			expect(decodeRevertReason(data)).toBe('execution reverted')
		})

		it('should handle malformed Error selector data', () => {
			expect(decodeRevertReason(`${ERROR_SELECTOR}ff`)).toBe('execution reverted')
		})
	})

	describe('Panic(uint256) decoding', () => {
		const panicCases = [
			{ code: 0x01n, desc: 'assertion error' },
			{ code: 0x11n, desc: 'arithmetic overflow' },
			{ code: 0x12n, desc: 'division by zero' },
			{ code: 0x32n, desc: 'array access out of bounds' },
		]

		panicCases.forEach(({ code, desc }) => {
			it(`should decode panic code ${code} (${desc})`, () => {
				const encoded = encodeAbiParameters([{ type: 'uint256' }], [code])
				const data = concatHex([PANIC_SELECTOR, encoded])

				expect(decodeRevertReason(data)).toBe(`execution reverted: Panic(${code})`)
			})
		})
	})

	describe('custom error handling', () => {
		it('should handle custom error without data', () => {
			const selector = '0x12345678'
			expect(decodeRevertReason(selector)).toBe(`execution reverted: custom error ${selector}`)
		})

		it('should handle custom error with UTF-8 data', () => {
			const selector = '0x12345678'
			const message = 'hello'
			const data = `${selector}${Buffer.from(message, 'utf8').toString('hex')}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: custom error ${selector}: ${message}`)
		})

		it('should handle custom error with hex data fallback', () => {
			const selector = '0x12345678'
			const hexData = 'deadbeef'
			const data = `${selector}${hexData}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: custom error ${selector}: 0x${hexData}`)
		})

		it('should handle custom error with non-printable data', () => {
			const selector = '0x12345678'
			const nonPrintable = '\x01\x02\x03'
			const hexData = Buffer.from(nonPrintable, 'utf8').toString('hex')
			const data = `${selector}${hexData}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: custom error ${selector}: 0x${hexData}`)
		})
	})

	describe('ASCII string fallback', () => {
		it('should decode valid ASCII strings', () => {
			const message = 'hello world'
			const data = `0x${Buffer.from(message, 'utf8').toString('hex')}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: ${message}`)
		})

		it('should trim whitespace from ASCII strings', () => {
			const message = '  spaced message  '
			const data = `0x${Buffer.from(message, 'utf8').toString('hex')}`

			expect(decodeRevertReason(data)).toBe('execution reverted: spaced message')
		})

		it('should reject non-printable ASCII', () => {
			const nonPrintable = '\x01\x02\x03\x04'
			const data = `0x${Buffer.from(nonPrintable, 'utf8').toString('hex')}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: custom error ${data}`)
		})
	})

	describe('hex fallback and edge cases', () => {
		it('should handle short data (less than selector)', () => {
			expect(decodeRevertReason('0x123456')).toBe('execution reverted')
		})

		it('should handle odd-length hex gracefully', () => {
			expect(decodeRevertReason('0x123')).toBe('execution reverted')
		})

		it('should handle data without 0x prefix', () => {
			const reason = 'test message'
			const encoded = encodeAbiParameters([{ type: 'string' }], [reason])
			const data = `${ERROR_SELECTOR.slice(2)}${encoded.slice(2)}`

			expect(decodeRevertReason(data)).toBe(`execution reverted: ${reason}`)
		})

		it('should use hex fallback for undecodable data', () => {
			const data = '0xdeadbeef'
			expect(decodeRevertReason(data)).toBe(`execution reverted: custom error ${data}`)
		})
	})

	describe('real-world scenarios', () => {
		it('should handle require(false) with no reason', () => {
			expect(decodeRevertReason('0x')).toBe('execution reverted')
		})

		it('should handle ERC20 transfer revert', () => {
			const reason = 'ERC20: transfer amount exceeds balance'
			const encoded = encodeAbiParameters([{ type: 'string' }], [reason])
			const data = concatHex([ERROR_SELECTOR, encoded])

			expect(decodeRevertReason(data)).toBe(`execution reverted: ${reason}`)
		})

		it('should handle assert(false) division by zero', () => {
			const encoded = encodeAbiParameters([{ type: 'uint256' }], [18n])
			const data = concatHex([PANIC_SELECTOR, encoded])

			expect(decodeRevertReason(data)).toBe('execution reverted: Panic(18)')
		})
	})
})
