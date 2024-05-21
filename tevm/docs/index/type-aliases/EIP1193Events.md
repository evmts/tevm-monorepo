[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193Events

# Type alias: EIP1193Events

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

## Source

packages/decorators/dist/index.d.ts:279
