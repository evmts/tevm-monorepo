[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ClRequest

# Class: ClRequest

Defined in: [packages/block/src/ClRequest.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L60)

[Description of what ClRequest represents]

## Example

```typescript
import { ClRequest } from '[package-path]'

const instance = new ClRequest()
```

## Implements

- `CLRequestType`

## Constructors

### new ClRequest()

> **new ClRequest**(`type`, `bytes`): [`ClRequest`](ClRequest.md)

Defined in: [packages/block/src/ClRequest.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L63)

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

Defined in: [packages/block/src/ClRequest.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L62)

#### Implementation of

`CLRequestType.bytes`

***

### type

> **type**: `number`

Defined in: [packages/block/src/ClRequest.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L61)

#### Implementation of

`CLRequestType.type`

## Methods

### serialize()

> **serialize**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/ClRequest.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/ClRequest.ts#L69)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Implementation of

`CLRequestType.serialize`
