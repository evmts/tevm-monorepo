[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EthjsAddress

# Class: EthjsAddress

Defined in: zevm/npm/zevm/dist/util.d.ts:161

## Extended by

- [`Address`](../../address/classes/Address.md)

## Constructors

### Constructor

> **new EthjsAddress**(`bytes`): `Address`

Defined in: zevm/npm/zevm/dist/util.d.ts:163

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`Address`

## Properties

### bytes

> **bytes**: `Uint8Array`

Defined in: zevm/npm/zevm/dist/util.d.ts:162

## Methods

### equals()

> **equals**(`address`): `boolean`

Defined in: zevm/npm/zevm/dist/util.d.ts:166

#### Parameters

##### address

`Address`

#### Returns

`boolean`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

Defined in: zevm/npm/zevm/dist/util.d.ts:168

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

Defined in: zevm/npm/zevm/dist/util.d.ts:167

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Defined in: zevm/npm/zevm/dist/util.d.ts:170

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

Defined in: zevm/npm/zevm/dist/util.d.ts:169

#### Returns

`` `0x${string}` ``

***

### fromString()

> `static` **fromString**(`str`): `Address`

Defined in: zevm/npm/zevm/dist/util.d.ts:164

#### Parameters

##### str

`string`

#### Returns

`Address`

***

### zero()

> `static` **zero**(): `Address`

Defined in: zevm/npm/zevm/dist/util.d.ts:165

#### Returns

`Address`
