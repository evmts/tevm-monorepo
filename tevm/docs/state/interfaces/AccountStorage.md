[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / AccountStorage

# Interface: AccountStorage

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

| Property | Type |
| ------ | ------ |
| <a id="balance"></a> `balance` | `bigint` |
| <a id="codehash"></a> `codeHash` | `` `0x${string}` `` |
| <a id="deployedbytecode"></a> `deployedBytecode?` | `` `0x${string}` `` |
| <a id="nonce"></a> `nonce` | `bigint` |
| <a id="storage"></a> `storage?` | [`StorageDump`](../../common/interfaces/StorageDump.md) |
| <a id="storageroot"></a> `storageRoot` | `` `0x${string}` `` |
