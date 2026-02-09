import { describe, expect, it } from 'vitest'
import { stringify } from './stringify'

describe(stringify.name, () => {
	it('stringifies a value', () => {
		expect(stringify({ a: 1, b: BigInt(420) })).toMatchInlineSnapshot(`"{"a":1,"b":"420"}"`)
	})
})
