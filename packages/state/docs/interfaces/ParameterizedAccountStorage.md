[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / ParameterizedAccountStorage

# Interface: ParameterizedAccountStorage

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L20)

Represents an Ethereum account storage with hexadecimal string values.
Used to serialize account data for storage and RPC responses.

## Example

```typescript
import { ParameterizedAccountStorage } from '@tevm/state'

const value: ParameterizedAccountStorage = {
  nonce: '0x0',
  balance: '0x1a784379d99db42000000',
  storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
}
```

## Properties

### balance

> **balance**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L22)

***

### codeHash

> **codeHash**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L24)

***

### nonce

> **nonce**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L21)

***

### storage?

> `optional` **storage**: `StorageDump`

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L25)

***

### storageRoot

> **storageRoot**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/ParameterizedAccountStorage.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/ParameterizedAccountStorage.ts#L23)
