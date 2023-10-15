import { expect, test } from 'vitest'

import { formatGweiEffect } from './formatGweiEffect.js'
import { Effect } from 'effect'

test('converts wei to gwei', () => {
	expect(Effect.runSync(formatGweiEffect(69420123456700n))).toMatchInlineSnapshot('"69420.1234567"')
	expect(Effect.runSync(formatGweiEffect(69420000000000n))).toMatchInlineSnapshot('"69420"')
	expect(Effect.runSync(formatGweiEffect(1000000000n))).toMatchInlineSnapshot('"1"')
	expect(Effect.runSync(formatGweiEffect(500000000n))).toMatchInlineSnapshot('"0.5"')
	expect(Effect.runSync(formatGweiEffect(100000000n))).toMatchInlineSnapshot('"0.1"')
	expect(Effect.runSync(formatGweiEffect(10000000n))).toMatchInlineSnapshot('"0.01"')
	expect(Effect.runSync(formatGweiEffect(1000000n))).toMatchInlineSnapshot('"0.001"')
	expect(Effect.runSync(formatGweiEffect(100000n))).toMatchInlineSnapshot('"0.0001"')
	expect(Effect.runSync(formatGweiEffect(10000n))).toMatchInlineSnapshot('"0.00001"')
	expect(Effect.runSync(formatGweiEffect(1000n))).toMatchInlineSnapshot('"0.000001"')
	expect(Effect.runSync(formatGweiEffect(100n))).toMatchInlineSnapshot('"0.0000001"')
	expect(Effect.runSync(formatGweiEffect(10n))).toMatchInlineSnapshot('"0.00000001"')
	expect(Effect.runSync(formatGweiEffect(1n))).toMatchInlineSnapshot('"0.000000001"')
	expect(Effect.runSync(formatGweiEffect(-69420123456700n))).toMatchInlineSnapshot('"-69420.1234567"')
	expect(Effect.runSync(formatGweiEffect(-69420000000000n))).toMatchInlineSnapshot('"-69420"')
	expect(Effect.runSync(formatGweiEffect(-1000000000n))).toMatchInlineSnapshot('"-1"')
	expect(Effect.runSync(formatGweiEffect(-500000000n))).toMatchInlineSnapshot('"-0.5"')
	expect(Effect.runSync(formatGweiEffect(-100000000n))).toMatchInlineSnapshot('"-0.1"')
	expect(Effect.runSync(formatGweiEffect(-10000000n))).toMatchInlineSnapshot('"-0.01"')
	expect(Effect.runSync(formatGweiEffect(-1000000n))).toMatchInlineSnapshot('"-0.001"')
	expect(Effect.runSync(formatGweiEffect(-100000n))).toMatchInlineSnapshot('"-0.0001"')
	expect(Effect.runSync(formatGweiEffect(-10000n))).toMatchInlineSnapshot('"-0.00001"')
	expect(Effect.runSync(formatGweiEffect(-1000n))).toMatchInlineSnapshot('"-0.000001"')
	expect(Effect.runSync(formatGweiEffect(-100n))).toMatchInlineSnapshot('"-0.0000001"')
	expect(Effect.runSync(formatGweiEffect(-10n))).toMatchInlineSnapshot('"-0.00000001"')
	expect(Effect.runSync(formatGweiEffect(-1n))).toMatchInlineSnapshot('"-0.000000001"')
})
