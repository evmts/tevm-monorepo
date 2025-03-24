[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events** = `object`

Defined in: packages/node/dist/index.d.ts:40

## Methods

### on()

> **on**\<`TEvent`\>(`event`, `listener`): `void`

Defined in: packages/node/dist/index.d.ts:41

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

Defined in: packages/node/dist/index.d.ts:42

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
