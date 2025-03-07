[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ClRequest

# Class: ClRequest

Defined in: [packages/block/src/ClRequest.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L18)

## Implements

- `CLRequestType`

## Constructors

### new ClRequest()

> **new ClRequest**(`type`, `bytes`): [`ClRequest`](ClRequest.md)

Defined in: [packages/block/src/ClRequest.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L21)

#### Parameters

##### type

`number`

##### bytes

`Uint8Array`

#### Returns

[`ClRequest`](ClRequest.md)

## Properties

### bytes

> **bytes**: `Uint8Array`

Defined in: [packages/block/src/ClRequest.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L20)

#### Implementation of

`CLRequestType.bytes`

***

### type

> **type**: `number`

Defined in: [packages/block/src/ClRequest.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L19)

#### Implementation of

`CLRequestType.type`

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/ClRequest.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L27)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
