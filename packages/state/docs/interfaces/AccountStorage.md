[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / AccountStorage

# Interface: AccountStorage

Defined in: [packages/state/src/state-types/AccountStorage.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L19)

Represents an Ethereum account storage with native bigint values.
Used for internal state management and account manipulation.

## Example

```typescript
import { AccountStorage } from '@tevm/state'

const value: AccountStorage = {
  nonce: 0n,
  balance: 10000000000000000000n, // 10 ETH
  storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
}
```

## Properties

### balance

> **balance**: `bigint`

Defined in: [packages/state/src/state-types/AccountStorage.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L21)

***

### codeHash

> **codeHash**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/AccountStorage.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L23)

***

### deployedBytecode?

> `optional` **deployedBytecode**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/AccountStorage.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L24)

***

### nonce

> **nonce**: `bigint`

Defined in: [packages/state/src/state-types/AccountStorage.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L20)

***

### storage?

> `optional` **storage**: `StorageDump`

Defined in: [packages/state/src/state-types/AccountStorage.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L25)

***

### storageRoot

> **storageRoot**: `` `0x${string}` ``

Defined in: [packages/state/src/state-types/AccountStorage.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/AccountStorage.ts#L22)
