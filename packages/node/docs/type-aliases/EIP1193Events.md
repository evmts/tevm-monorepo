[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events** = `object`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L48)

## Methods

### on()

> **on**\<`TEvent`\>(`event`, `listener`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L49)

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

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L50)

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
