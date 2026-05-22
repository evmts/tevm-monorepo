[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Db

# Interface: Db\<TKey, TValue\>

Defined in: zevm/npm/zevm/dist/util.d.ts:42

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TKey` *extends* `Uint8Array` \| `string` \| `number` | `Uint8Array` |
| `TValue` *extends* `Uint8Array` \| `string` \| [`DbObject`](../type-aliases/DbObject.md) | `Uint8Array` |

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/util.d.ts:46

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opStack` | [`BatchDbOp`](../type-aliases/BatchDbOp.md)\<`TKey`, `TValue`\>[] |

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`, `opts?`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/util.d.ts:45

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

Defined in: zevm/npm/zevm/dist/util.d.ts:43

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

Defined in: zevm/npm/zevm/dist/util.d.ts:48

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `val`, `opts?`): `Promise`\<`void`\>

Defined in: zevm/npm/zevm/dist/util.d.ts:44

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

Defined in: zevm/npm/zevm/dist/util.d.ts:47

#### Returns

`DB`\<`TKey`, `TValue`\>
