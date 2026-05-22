[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Db

# Interface: Db\<TKey, TValue\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TKey` *extends* `Uint8Array` \| `string` \| `number` | `Uint8Array` |
| `TValue` *extends* `Uint8Array` \| `string` \| [`DbObject`](../type-aliases/DbObject.md) | `Uint8Array` |

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opStack` | [`BatchDbOp`](../type-aliases/BatchDbOp.md)\<`TKey`, `TValue`\>[] |

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`, `opts?`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `TKey` |
| `opts?` | [`EncodingOpts`](../type-aliases/EncodingOpts.md) |

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`, `opts?`): `Promise`\<`TValue` \| `undefined`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `TKey` |
| `opts?` | [`EncodingOpts`](../type-aliases/EncodingOpts.md) |

#### Returns

`Promise`\<`TValue` \| `undefined`\>

***

### open()

> **open**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `val`, `opts?`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `TKey` |
| `val` | `TValue` |
| `opts?` | [`EncodingOpts`](../type-aliases/EncodingOpts.md) |

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `DB`\<`TKey`, `TValue`\>

#### Returns

`DB`\<`TKey`, `TValue`\>
