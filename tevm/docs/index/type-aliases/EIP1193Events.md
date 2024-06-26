[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

## Defined in

packages/base-client/dist/index.d.ts:41
