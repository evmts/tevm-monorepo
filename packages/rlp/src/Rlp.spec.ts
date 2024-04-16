import { Rlp } from './Rlp.js'
import { expect, test } from 'bun:test'

test('reexports the Rlp method from ethereumjs', () => {
	expect(Rlp.decode(Uint8Array.from([]))).toEqual(Uint8Array.from([]))
	expect(Rlp.encode('')).toEqual(Uint8Array.from([128]))
})
