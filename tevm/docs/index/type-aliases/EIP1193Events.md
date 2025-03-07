[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events**: `object`

Defined in: packages/node/dist/index.d.ts:40

## Type declaration

### on()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

##### event

`TEvent`

##### listener

[`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

##### event

`TEvent`

##### listener

[`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`
