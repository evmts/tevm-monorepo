import { expect, test } from 'vitest'

import { parseEtherEffect } from './parseEtherEffect.js'

test('converts ether to wei', () => {
	expect(parseEtherEffect('6942069420.12345678912345')).toMatchInlineSnapshot(
		'6942069420123456789123450000n',
	)
	expect(parseEtherEffect('6942069420')).toMatchInlineSnapshot(
		'6942069420000000000000000000n',
	)
	expect(parseEtherEffect('1')).toMatchInlineSnapshot('1000000000000000000n')
	expect(parseEtherEffect('0.5')).toMatchInlineSnapshot('500000000000000000n')
	expect(parseEtherEffect('0.1')).toMatchInlineSnapshot('100000000000000000n')
	expect(parseEtherEffect('0.01')).toMatchInlineSnapshot('10000000000000000n')
	expect(parseEtherEffect('0.001')).toMatchInlineSnapshot('1000000000000000n')
	expect(parseEtherEffect('0.0001')).toMatchInlineSnapshot('100000000000000n')
	expect(parseEtherEffect('0.00001')).toMatchInlineSnapshot('10000000000000n')
	expect(parseEtherEffect('0.00000000001')).toMatchInlineSnapshot('10000000n')
	expect(parseEtherEffect('0.000000000001')).toMatchInlineSnapshot('1000000n')
	expect(parseEtherEffect('0.0000000000001')).toMatchInlineSnapshot('100000n')
	expect(parseEtherEffect('0.00000000000001')).toMatchInlineSnapshot('10000n')
	expect(parseEtherEffect('0.000000000000001')).toMatchInlineSnapshot('1000n')
	expect(parseEtherEffect('0.0000000000000001')).toMatchInlineSnapshot('100n')
	expect(parseEtherEffect('0.00000000000000001')).toMatchInlineSnapshot('10n')
	expect(parseEtherEffect('0.000000000000000001')).toMatchInlineSnapshot('1n')
	expect(parseEtherEffect('-6942069420.12345678912345')).toMatchInlineSnapshot(
		'-6942069420123456789123450000n',
	)
	expect(parseEtherEffect('-6942069420')).toMatchInlineSnapshot(
		'-6942069420000000000000000000n',
	)
	expect(parseEtherEffect('-1')).toMatchInlineSnapshot('-1000000000000000000n')
	expect(parseEtherEffect('-0.5')).toMatchInlineSnapshot('-500000000000000000n')
	expect(parseEtherEffect('-0.1')).toMatchInlineSnapshot('-100000000000000000n')
	expect(parseEtherEffect('-0.00000000001')).toMatchInlineSnapshot('-10000000n')
	expect(parseEtherEffect('-0.000000000001')).toMatchInlineSnapshot('-1000000n')
	expect(parseEtherEffect('-0.0000000000001')).toMatchInlineSnapshot('-100000n')
	expect(parseEtherEffect('-0.00000000000001')).toMatchInlineSnapshot('-10000n')
	expect(parseEtherEffect('-0.000000000000001')).toMatchInlineSnapshot('-1000n')
	expect(parseEtherEffect('-0.0000000000000001')).toMatchInlineSnapshot('-100n')
	expect(parseEtherEffect('-0.00000000000000001')).toMatchInlineSnapshot('-10n')
	expect(parseEtherEffect('-0.000000000000000001')).toMatchInlineSnapshot('-1n')
})

test('converts ether to gwei', () => {
	expect(parseEtherEffect('69420.1234567', 'gwei')).toMatchInlineSnapshot(
		'69420123456700n',
	)
	expect(parseEtherEffect('69420', 'gwei')).toMatchInlineSnapshot('69420000000000n')
	expect(parseEtherEffect('1', 'gwei')).toMatchInlineSnapshot('1000000000n')
	expect(parseEtherEffect('0.5', 'gwei')).toMatchInlineSnapshot('500000000n')
	expect(parseEtherEffect('0.1', 'gwei')).toMatchInlineSnapshot('100000000n')
	expect(parseEtherEffect('0.01', 'gwei')).toMatchInlineSnapshot('10000000n')
	expect(parseEtherEffect('0.001', 'gwei')).toMatchInlineSnapshot('1000000n')
	expect(parseEtherEffect('0.0001', 'gwei')).toMatchInlineSnapshot('100000n')
	expect(parseEtherEffect('0.00001', 'gwei')).toMatchInlineSnapshot('10000n')
	expect(parseEtherEffect('0.000001', 'gwei')).toMatchInlineSnapshot('1000n')
	expect(parseEtherEffect('0.0000001', 'gwei')).toMatchInlineSnapshot('100n')
	expect(parseEtherEffect('0.00000001', 'gwei')).toMatchInlineSnapshot('10n')
	expect(parseEtherEffect('0.000000001', 'gwei')).toMatchInlineSnapshot('1n')

	expect(parseEtherEffect('-6942060.123456', 'gwei')).toMatchInlineSnapshot(
		'-6942060123456000n',
	)
	expect(parseEtherEffect('-6942069420', 'gwei')).toMatchInlineSnapshot(
		'-6942069420000000000n',
	)
	expect(parseEtherEffect('-1', 'gwei')).toMatchInlineSnapshot('-1000000000n')
	expect(parseEtherEffect('-0.5', 'gwei')).toMatchInlineSnapshot('-500000000n')
	expect(parseEtherEffect('-0.1', 'gwei')).toMatchInlineSnapshot('-100000000n')
	expect(parseEtherEffect('-0.01', 'gwei')).toMatchInlineSnapshot('-10000000n')
	expect(parseEtherEffect('-0.001', 'gwei')).toMatchInlineSnapshot('-1000000n')
	expect(parseEtherEffect('-0.0001', 'gwei')).toMatchInlineSnapshot('-100000n')
	expect(parseEtherEffect('-0.00001', 'gwei')).toMatchInlineSnapshot('-10000n')
	expect(parseEtherEffect('-0.000001', 'gwei')).toMatchInlineSnapshot('-1000n')
	expect(parseEtherEffect('-0.0000001', 'gwei')).toMatchInlineSnapshot('-100n')
	expect(parseEtherEffect('-0.00000001', 'gwei')).toMatchInlineSnapshot('-10n')
	expect(parseEtherEffect('-0.000000001', 'gwei')).toMatchInlineSnapshot('-1n')
})

test('converts to rounded gwei', () => {
	expect(parseEtherEffect('0.0000000001', 'gwei')).toMatchInlineSnapshot('0n')
	expect(parseEtherEffect('0.00000000059', 'gwei')).toMatchInlineSnapshot('1n')
	expect(parseEtherEffect('1.00000000059', 'gwei')).toMatchInlineSnapshot(
		'1000000001n',
	)
	expect(parseEtherEffect('69.59000000059', 'gwei')).toMatchInlineSnapshot(
		'69590000001n',
	)
	expect(parseEtherEffect('1.2345678912345222', 'gwei')).toMatchInlineSnapshot(
		'1234567891n',
	)
	expect(parseEtherEffect('-0.0000000001', 'gwei')).toMatchInlineSnapshot('0n')
	expect(parseEtherEffect('-0.00000000059', 'gwei')).toMatchInlineSnapshot('-1n')
	expect(parseEtherEffect('-1.00000000059', 'gwei')).toMatchInlineSnapshot(
		'-1000000001n',
	)
	expect(parseEtherEffect('-69.59000000059', 'gwei')).toMatchInlineSnapshot(
		'-69590000001n',
	)
	expect(parseEtherEffect('-1.2345678912345222', 'gwei')).toMatchInlineSnapshot(
		'-1234567891n',
	)
})

test('converts to rounded wei', () => {
	expect(parseEtherEffect('0.0000000000000000001')).toMatchInlineSnapshot('0n')
	expect(parseEtherEffect('0.00000000000000000059')).toMatchInlineSnapshot('1n')
	expect(parseEtherEffect('1.00000000000000000059')).toMatchInlineSnapshot(
		'1000000000000000001n',
	)
	expect(parseEtherEffect('69.59000000000000000059')).toMatchInlineSnapshot(
		'69590000000000000001n',
	)
	expect(parseEtherEffect('1.2345678000000000912345222')).toMatchInlineSnapshot(
		'1234567800000000091n',
	)
	expect(parseEtherEffect('-0.0000000000000000001')).toMatchInlineSnapshot('0n')
	expect(parseEtherEffect('-0.00000000000000000059')).toMatchInlineSnapshot('-1n')
	expect(parseEtherEffect('-1.00000000000000000059')).toMatchInlineSnapshot(
		'-1000000000000000001n',
	)
	expect(parseEtherEffect('-69.59000000000000000059')).toMatchInlineSnapshot(
		'-69590000000000000001n',
	)
	expect(parseEtherEffect('-1.2345678000000000912345222')).toMatchInlineSnapshot(
		'-1234567800000000091n',
	)
})
