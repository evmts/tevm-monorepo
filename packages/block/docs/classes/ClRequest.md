[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / ClRequest

# Class: ClRequest

## Implements

- `CLRequestType`

## Constructors

### new ClRequest()

> **new ClRequest**(`type`, `bytes`): [`ClRequest`](ClRequest.md)

#### Parameters

• **type**: `number`

• **bytes**: `Uint8Array`

#### Returns

[`ClRequest`](ClRequest.md)

#### Source

[ClRequest.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L20)

## Properties

### bytes

> **bytes**: `Uint8Array`

#### Implementation of

`CLRequestType.bytes`

#### Source

[ClRequest.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L19)

***

### type

> **type**: `number`

#### Implementation of

`CLRequestType.type`

#### Source

[ClRequest.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L18)

## Methods

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`CLRequestType.serialize`

#### Source

[ClRequest.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L26)
