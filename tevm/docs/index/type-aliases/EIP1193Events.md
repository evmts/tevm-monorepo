[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events** = `object`

## Methods

### on()

> **on**\<`TEvent`\>(`event`, `listener`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `TEvent` *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `TEvent` |
| `listener` | [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\] |

#### Returns

`void`

***

### removeListener()

> **removeListener**\<`TEvent`\>(`event`, `listener`): `void`

#### Type Parameters

| Type Parameter |
| ------ |
| `TEvent` *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `TEvent` |
| `listener` | [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\] |

#### Returns

`void`
