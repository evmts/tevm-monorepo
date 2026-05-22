[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Bloom

# Class: Bloom

Defined in: zevm/npm/zevm/dist/receipt.d.ts:22

Ethereum logs bloom filter.

## Constructors

### Constructor

> **new Bloom**(`bitvector?`, `common?`): `Bloom`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:25

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bitvector?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `common?` | `CommonLike` |

#### Returns

`Bloom`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | zevm/npm/zevm/dist/receipt.d.ts:24 |

## Methods

### add()

> **add**(`value`): `void`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:26

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `Uint8Array` |

#### Returns

`void`

***

### check()

> **check**(`value`): `boolean`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:27

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `Uint8Array` |

#### Returns

`boolean`

***

### multiCheck()

> **multiCheck**(`values`): `boolean`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:28

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `values` | `Uint8Array`\<`ArrayBufferLike`\>[] |

#### Returns

`boolean`

***

### or()

> **or**(`bloom`): `void`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:29

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bloom` | `Bloom` |

#### Returns

`void`
