[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events** = `object`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:247

## Methods

### on()

> **on**\<`TEvent`\>(`event`, `listener`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:248

#### Type Parameters

##### TEvent

`TEvent` *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

##### event

`TEvent`

##### listener

[`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

***

### removeListener()

> **removeListener**\<`TEvent`\>(`event`, `listener`): `void`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:249

#### Type Parameters

##### TEvent

`TEvent` *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

##### event

`TEvent`

##### listener

[`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`
