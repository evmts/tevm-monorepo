import { concat } from '../data/concat.js'
import { toBytes } from './toBytes.js'
import { bytesToHex } from './toHex.js'
export function toRlp(hexOrBytes, to_) {
	const to = to_ || 'hex'
	return format(bytesToRlp(parse(hexOrBytes)), to)
}
function parse(hexOrBytes) {
	if (Array.isArray(hexOrBytes)) return hexOrBytes.map(parse)
	return typeof hexOrBytes === 'string' ? toBytes(hexOrBytes) : hexOrBytes
}
function format(bytes, type = 'bytes') {
	return type === 'hex' ? bytesToHex(bytes) : bytes
}
export function bytesToRlp(bytes) {
	if (Array.isArray(bytes)) {
		const encoded = concat(bytes.map(bytesToRlp))
		return new Uint8Array([...encodeLength(encoded.length, 0xc0), ...encoded])
	}
	if (bytes.length === 1 && bytes[0] < 0x80) return bytes
	return new Uint8Array([...encodeLength(bytes.length, 0x80), ...bytes])
}
function encodeLength(length, offset) {
	if (length < 56) return [offset + length]
	return [toBytes(length).length + offset + 55, ...toBytes(length)]
}
//# sourceMappingURL=toRlp.js.map
