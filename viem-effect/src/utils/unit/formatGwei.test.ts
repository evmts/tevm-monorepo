import { expect, test } from 'vitest'

import { formatGwei } from './formatGwei.js'
import { Effect } from 'effect'

test('converts wei to gwei', () => {
	expect(Effect.runSync(formatGwei(69420123456700n))).toMatchInlineSnapshot('"69420.1234567"')
	expect(Effect.runSync(formatGwei(69420000000000n))).toMatchInlineSnapshot('"69420"')
	expect(Effect.runSync(formatGwei(1000000000n))).toMatchInlineSnapshot('"1"')
	expect(Effect.runSync(formatGwei(500000000n))).toMatchInlineSnapshot('"0.5"')
	expect(Effect.runSync(formatGwei(100000000n))).toMatchInlineSnapshot('"0.1"')
	expect(Effect.runSync(formatGwei(10000000n))).toMatchInlineSnapshot('"0.01"')
	expect(Effect.runSync(formatGwei(1000000n))).toMatchInlineSnapshot('"0.001"')
	expect(Effect.runSync(formatGwei(100000n))).toMatchInlineSnapshot('"0.0001"')
	expect(Effect.runSync(formatGwei(10000n))).toMatchInlineSnapshot('"0.00001"')
	expect(Effect.runSync(formatGwei(1000n))).toMatchInlineSnapshot('"0.000001"')
	expect(Effect.runSync(formatGwei(100n))).toMatchInlineSnapshot('"0.0000001"')
	expect(Effect.runSync(formatGwei(10n))).toMatchInlineSnapshot('"0.00000001"')
	expect(Effect.runSync(formatGwei(1n))).toMatchInlineSnapshot('"0.000000001"')
	expect(Effect.runSync(formatGwei(-69420123456700n))).toMatchInlineSnapshot('"-69420.1234567"')
	expect(Effect.runSync(formatGwei(-69420000000000n))).toMatchInlineSnapshot('"-69420"')
	expect(Effect.runSync(formatGwei(-1000000000n))).toMatchInlineSnapshot('"-1"')
	expect(Effect.runSync(formatGwei(-500000000n))).toMatchInlineSnapshot('"-0.5"')
	expect(Effect.runSync(formatGwei(-100000000n))).toMatchInlineSnapshot('"-0.1"')
	expect(Effect.runSync(formatGwei(-10000000n))).toMatchInlineSnapshot('"-0.01"')
	expect(Effect.runSync(formatGwei(-1000000n))).toMatchInlineSnapshot('"-0.001"')
	expect(Effect.runSync(formatGwei(-100000n))).toMatchInlineSnapshot('"-0.0001"')
	expect(Effect.runSync(formatGwei(-10000n))).toMatchInlineSnapshot('"-0.00001"')
	expect(Effect.runSync(formatGwei(-1000n))).toMatchInlineSnapshot('"-0.000001"')
	expect(Effect.runSync(formatGwei(-100n))).toMatchInlineSnapshot('"-0.0000001"')
	expect(Effect.runSync(formatGwei(-10n))).toMatchInlineSnapshot('"-0.00000001"')
	expect(Effect.runSync(formatGwei(-1n))).toMatchInlineSnapshot('"-0.000000001"')
})
