import { expect, test } from 'vitest'

import { parseGweiEffect } from './parseGweiEffect.js'
import { Effect } from 'effect'

test('converts gwei to wei', () => {
	expect(Effect.runSync(parseGweiEffect('69420.1234567'))).toMatchInlineSnapshot('69420123456700n')
	expect(Effect.runSync(parseGweiEffect('69420'))).toMatchInlineSnapshot('69420000000000n')
	expect(Effect.runSync(parseGweiEffect('1'))).toMatchInlineSnapshot('1000000000n')
	expect(Effect.runSync(parseGweiEffect('0.5'))).toMatchInlineSnapshot('500000000n')
	expect(Effect.runSync(parseGweiEffect('0.1'))).toMatchInlineSnapshot('100000000n')
	expect(Effect.runSync(parseGweiEffect('0.01'))).toMatchInlineSnapshot('10000000n')
	expect(Effect.runSync(parseGweiEffect('0.001'))).toMatchInlineSnapshot('1000000n')
	expect(Effect.runSync(parseGweiEffect('0.0001'))).toMatchInlineSnapshot('100000n')
	expect(Effect.runSync(parseGweiEffect('0.00001'))).toMatchInlineSnapshot('10000n')
	expect(Effect.runSync(parseGweiEffect('0.000001'))).toMatchInlineSnapshot('1000n')
	expect(Effect.runSync(parseGweiEffect('0.0000001'))).toMatchInlineSnapshot('100n')
	expect(Effect.runSync(parseGweiEffect('0.00000001'))).toMatchInlineSnapshot('10n')
	expect(Effect.runSync(parseGweiEffect('0.000000001'))).toMatchInlineSnapshot('1n')

	expect(Effect.runSync(parseGweiEffect('-6942060.123456'))).toMatchInlineSnapshot(
		'-6942060123456000n',
	)
	expect(Effect.runSync(parseGweiEffect('-6942069420'))).toMatchInlineSnapshot(
		'-6942069420000000000n',
	)
	expect(Effect.runSync(parseGweiEffect('-1'))).toMatchInlineSnapshot('-1000000000n')
	expect(Effect.runSync(parseGweiEffect('-0.5'))).toMatchInlineSnapshot('-500000000n')
	expect(Effect.runSync(parseGweiEffect('-0.1'))).toMatchInlineSnapshot('-100000000n')
	expect(Effect.runSync(parseGweiEffect('-0.01'))).toMatchInlineSnapshot('-10000000n')
	expect(Effect.runSync(parseGweiEffect('-0.001'))).toMatchInlineSnapshot('-1000000n')
	expect(Effect.runSync(parseGweiEffect('-0.0001'))).toMatchInlineSnapshot('-100000n')
	expect(Effect.runSync(parseGweiEffect('-0.00001'))).toMatchInlineSnapshot('-10000n')
	expect(Effect.runSync(parseGweiEffect('-0.000001'))).toMatchInlineSnapshot('-1000n')
	expect(Effect.runSync(parseGweiEffect('-0.0000001'))).toMatchInlineSnapshot('-100n')
	expect(Effect.runSync(parseGweiEffect('-0.00000001'))).toMatchInlineSnapshot('-10n')
	expect(Effect.runSync(parseGweiEffect('-0.000000001'))).toMatchInlineSnapshot('-1n')
})

test('converts to rounded wei', () => {
	expect(Effect.runSync(parseGweiEffect('0.0000000001'))).toMatchInlineSnapshot('0n')
	expect(Effect.runSync(parseGweiEffect('0.00000000059'))).toMatchInlineSnapshot('1n')
	expect(Effect.runSync(parseGweiEffect('1.00000000059'))).toMatchInlineSnapshot('1000000001n')
	expect(Effect.runSync(parseGweiEffect('69.59000000059'))).toMatchInlineSnapshot('69590000001n')
	expect(Effect.runSync(parseGweiEffect('1.2345678912345222'))).toMatchInlineSnapshot('1234567891n')
	expect(Effect.runSync(parseGweiEffect('-0.0000000001'))).toMatchInlineSnapshot('0n')
	expect(Effect.runSync(parseGweiEffect('-0.00000000059'))).toMatchInlineSnapshot('-1n')
	expect(Effect.runSync(parseGweiEffect('-1.00000000059'))).toMatchInlineSnapshot('-1000000001n')
	expect(Effect.runSync(parseGweiEffect('-69.59000000059'))).toMatchInlineSnapshot('-69590000001n')
	expect(Effect.runSync(parseGweiEffect('-1.2345678912345222'))).toMatchInlineSnapshot('-1234567891n')
})
