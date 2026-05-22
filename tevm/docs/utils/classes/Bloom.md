[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Bloom

# Class: Bloom

Ethereum logs bloom filter.

## Constructors

### Constructor

> **new Bloom**(`bitvector?`, `common?`): `Bloom`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bitvector?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `common?` | `CommonLike` |

#### Returns

`Bloom`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` |

## Methods

### add()

> **add**(`value`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `Uint8Array` |

#### Returns

`void`

***

### check()

> **check**(`value`): `boolean`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `Uint8Array` |

#### Returns

`boolean`

***

### multiCheck()

> **multiCheck**(`values`): `boolean`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `values` | `Uint8Array`\<`ArrayBufferLike`\>[] |

#### Returns

`boolean`

***

### or()

> **or**(`bloom`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bloom` | `Bloom` |

#### Returns

`void`
