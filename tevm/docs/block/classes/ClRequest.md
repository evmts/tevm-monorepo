[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / ClRequest

# Class: ClRequest

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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `number` |
| `bytes` | `Uint8Array` |

#### Returns

`ClRequest`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="bytes"></a> `bytes` | `Uint8Array` |
| <a id="type"></a> `type` | `number` |

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
