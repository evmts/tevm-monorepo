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

| Parameter | Type |
| ------ | ------ |
| `type` | `number` |
| `bytes` | `Uint8Array` |

#### Returns

`ClRequest`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="bytes"></a> `bytes` | `Uint8Array` | [packages/block/src/ClRequest.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L70) |
| <a id="type"></a> `type` | `number` | [packages/block/src/ClRequest.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L69) |

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/ClRequest.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L80)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
