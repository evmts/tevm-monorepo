import { expect, test } from 'vitest'
import { Rlp } from './Rlp.js'

test('reexports the Rlp method from zevm', () => {
	expect(Rlp.decode(Uint8Array.from([]))).toEqual(Uint8Array.from([]))
	expect(Rlp.encode('')).toEqual(Uint8Array.from([128]))
	expect(Rlp.encode([Uint8Array.from([1]), 'cat'])).toEqual(Uint8Array.from([197, 1, 131, 99, 97, 116]))
	expect(Rlp.decode(Uint8Array.from([197, 1, 131, 99, 97, 116]))).toEqual([
		Uint8Array.from([1]),
		Uint8Array.from([99, 97, 116]),
	])
	expect(Rlp.decode(Uint8Array.from([1, 2]), true)).toEqual({
		data: Uint8Array.from([1]),
		remainder: Uint8Array.from([2]),
	})
})
