import { concat } from '../data/concat.js'
import { stringToBytes, toBytes } from '../encoding/toBytes.js'
import { keccak256 } from '../hash/keccak256.js'
export function hashMessage(message, to_) {
	const messageBytes = (() => {
		if (typeof message === 'string') return stringToBytes(message)
		if (message.raw instanceof Uint8Array) return message.raw
		return toBytes(message.raw)
	})()
	const prefixBytes = stringToBytes(
		`\x19Ethereum Signed Message:\n${messageBytes.length}`,
	)
	return keccak256(concat([prefixBytes, messageBytes]), to_)
}
//# sourceMappingURL=hashMessage.js.map
