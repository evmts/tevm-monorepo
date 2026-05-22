[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / MapDb

# Type Alias: MapDb

> **MapDb** = `object`

Defined in: zevm/npm/zevm/dist/receipt-manager.d.ts:6

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_cache"></a> `_cache` | `Map`\<`PrefixedHexString`, `Uint8Array`\> | zevm/npm/zevm/dist/receipt-manager.d.ts:7 |

## Methods

### deepCopy()

> **deepCopy**(): `MapDb`

Defined in: zevm/npm/zevm/dist/receipt-manager.d.ts:11

#### Returns

`MapDb`

***

### delete()

> **delete**(`type`, `hash`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/receipt-manager.d.ts:10

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`DbType`](DbType.md) |
| `hash` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`type`, `hash`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: zevm/npm/zevm/dist/receipt-manager.d.ts:9

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`DbType`](DbType.md) |
| `hash` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

***

### put()

> **put**(`type`, `hash`, `value`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/receipt-manager.d.ts:8

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`DbType`](DbType.md) |
| `hash` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>
