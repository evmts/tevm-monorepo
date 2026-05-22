[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EthjsAddress

# Class: EthjsAddress

## Extended by

- [`Address`](../../address/classes/Address.md)

## Constructors

### Constructor

> **new EthjsAddress**(`bytes`): `Address`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bytes` | `Uint8Array` |

#### Returns

`Address`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="bytes"></a> `bytes` | `Uint8Array` |

## Methods

### equals()

> **equals**(`address`): `boolean`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`boolean`

***

### isPrecompileOrSystemAddress()

> **isPrecompileOrSystemAddress**(): `boolean`

#### Returns

`boolean`

***

### isZero()

> **isZero**(): `boolean`

#### Returns

`boolean`

***

### toBytes()

> **toBytes**(): `Uint8Array`

#### Returns

`Uint8Array`

***

### toString()

> **toString**(): `` `0x${string}` ``

#### Returns

`` `0x${string}` ``

***

### fromString()

> `static` **fromString**(`str`): `Address`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `str` | `string` |

#### Returns

`Address`

***

### zero()

> `static` **zero**(): `Address`

#### Returns

`Address`
