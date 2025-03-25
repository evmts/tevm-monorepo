[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ClRequest

# Class: ClRequest

Defined in: packages/block/types/ClRequest.d.ts:61

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

### new ClRequest()

> **new ClRequest**(`type`, `bytes`): `ClRequest`

Defined in: packages/block/types/ClRequest.d.ts:64

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

Defined in: packages/block/types/ClRequest.d.ts:63

#### Implementation of

`CLRequestType.bytes`

***

### type

> **type**: `number`

Defined in: packages/block/types/ClRequest.d.ts:62

#### Implementation of

`CLRequestType.type`

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/block/types/ClRequest.d.ts:65

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
