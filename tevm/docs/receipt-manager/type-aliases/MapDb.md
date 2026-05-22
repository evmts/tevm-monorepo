[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / MapDb

# Type Alias: MapDb

> **MapDb** = `object`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="_cache"></a> `_cache` | `Map`\<`PrefixedHexString`, `Uint8Array`\> |

## Methods

### deepCopy()

> **deepCopy**(): `MapDb`

#### Returns

`MapDb`

***

### delete()

> **delete**(`type`, `hash`): `Promise`\<`void`\>

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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`DbType`](DbType.md) |
| `hash` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>
