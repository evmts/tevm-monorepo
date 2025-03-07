[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / EIP1193Events

# Type Alias: EIP1193Events

> **EIP1193Events**: `object`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L46)

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
