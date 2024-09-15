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

#### Defined in

[ClRequest.ts:21](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L21)

## Properties

### bytes

> **bytes**: `Uint8Array`

#### Implementation of

`CLRequestType.bytes`

#### Defined in

[ClRequest.ts:20](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L20)

***

### type

> **type**: `number`

#### Implementation of

`CLRequestType.type`

#### Defined in

[ClRequest.ts:19](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L19)

## Methods

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

`CLRequestType.serialize`

#### Defined in

[ClRequest.ts:27](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L27)
