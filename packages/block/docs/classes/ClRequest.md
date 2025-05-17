[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ClRequest

# Class: ClRequest

Defined in: [packages/block/src/ClRequest.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L68)

Base implementation of a consensus layer request.
Used to create and serialize requests between the execution and consensus layers.

## Example

```typescript
import { ClRequest } from '@tevm/block'

// Create a request with type 1 and some payload data
const instance = new ClRequest(1, new Uint8Array([0x01, 0x02, 0x03]))
const serialized = instance.serialize() // Type byte followed by payload
```

## Implements

- `CLRequestType`

## Constructors

### Constructor

> **new ClRequest**(`type`, `bytes`): `ClRequest`

Defined in: [packages/block/src/ClRequest.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L71)

#### Parameters

##### type

`number`

##### bytes

`Uint8Array`

#### Returns

`ClRequest`

## Properties

### bytes

> **bytes**: `Uint8Array`

Defined in: [packages/block/src/ClRequest.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L70)

#### Implementation of

`CLRequestType.bytes`

***

### type

> **type**: `number`

Defined in: [packages/block/src/ClRequest.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L69)

#### Implementation of

`CLRequestType.type`

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/ClRequest.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L77)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
