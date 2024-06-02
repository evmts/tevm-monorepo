[**@tevm/base-client**](../README.md) • **Docs**

***

[@tevm/base-client](../globals.md) / EIP1193Events

# Type alias: EIP1193Events

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)\[`TEvent`\]

#### Returns

`void`

## Source

[packages/base-client/src/EIP1193EventEmitterTypes.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/EIP1193EventEmitterTypes.ts#L45)
