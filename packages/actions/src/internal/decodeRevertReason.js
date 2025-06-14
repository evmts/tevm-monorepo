import { decodeAbiParameters, hexToString, toFunctionSelector } from 'viem'

/**
 * Decodes basic revert data similar to Anvil's approach
 * @param {import('@tevm/utils').Hex | string | undefined} data - The revert data
 * @returns {string} - The decoded reason or 'execution reverted' if not decodable
 */
// TODO: replace with ox utils once (if) shipped (ExecutionError/EVMError)
// https://github.com/wevm/ox/discussions/83
export const decodeRevertReason = (data) => {
	if (!data || data === '0x') return 'execution reverted'
	/** @type {import('viem').Hex} */
	const hexData =
		typeof data === 'string' && data.startsWith('0x')
			? /** @type {import('viem').Hex} */ (data)
			: /** @type {import('viem').Hex} */ (`0x${data}`)

	// Handle short or malformed data early
	const cleanHex = hexData.slice(2)
	if (cleanHex.length === 0 || cleanHex.length % 2 !== 0 || cleanHex.length < 8) {
		return 'execution reverted'
	}

	const ERROR_SELECTOR = toFunctionSelector('Error(string)')
	const PANIC_SELECTOR = toFunctionSelector('Panic(uint256)')

	// 1. Try Error(string) decoding
	if (hexData.toLowerCase().startsWith(ERROR_SELECTOR)) {
		try {
			const reason = decodeAbiParameters([{ type: 'string' }], `0x${hexData.slice(10)}`)[0]
			if (typeof reason === 'string' && reason.length > 0) {
				return `execution reverted: ${reason}`
			}
			// Empty string case
			return 'execution reverted'
		} catch {
			// Malformed Error selector data
			return 'execution reverted'
		}
	}

	// 2. Try Panic(uint256) decoding
	if (hexData.startsWith(PANIC_SELECTOR)) {
		try {
			const code = decodeAbiParameters([{ type: 'uint256' }], `0x${hexData.slice(10)}`)[0]
			return `execution reverted: Panic(${code.toString()})`
		} catch {
			// Malformed Panic selector - continue to next step
		}
	}

	// 3. Try ASCII string decoding before custom error detection
	try {
		const decoded = hexToString(hexData)
		if (/^[\x20-\x7E]*$/.test(decoded) && decoded.trim().length > 0) {
			return `execution reverted: ${decoded.trim()}`
		}
	} catch {}

	// 4. Custom error handling (requires valid 4-byte selector AND additional data)
	if (cleanHex.length > 8) {
		// More than just a 4-byte selector
		const selector = hexData.slice(0, 10)
		const errorData = /** @type {import('viem').Hex} */ (`0x${hexData.slice(10)}`)

		// Try UTF-8 first, fallback to hex
		try {
			const utf8 = hexToString(errorData)
			if (/^[\x20-\x7E]*$/.test(utf8) && utf8.trim()) {
				return `execution reverted: custom error ${selector}: ${utf8.trim()}`
			}
		} catch {}
		// Fallback to hex representation
		return `execution reverted: custom error ${selector}: ${errorData}`
	}

	// 5. Final fallback: show as hex (including 4-byte selectors with no data)
	return `execution reverted: custom error ${hexData}`
}
