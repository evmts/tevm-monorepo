[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / AsyncEventEmitter

# Type Alias: AsyncEventEmitter\<T\>

> **AsyncEventEmitter**\<`T`\> = `object`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `any`\> | `object` |

## Methods

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `boolean`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| ...`args` | `Parameters`\<`T`\[`K`\]\> |

#### Returns

`boolean`

***

### off()

> **off**\<`K`\>(`event`, `listener`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `listener` | `T`\[`K`\] |

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `listener`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `listener` | `T`\[`K`\] |

#### Returns

`void`

***

### once()

> **once**\<`K`\>(`event`, `listener`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `listener` | `T`\[`K`\] |

#### Returns

`void`

***

### removeAllListeners()

> **removeAllListeners**\<`K`\>(`event?`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event?` | `K` |

#### Returns

`void`
