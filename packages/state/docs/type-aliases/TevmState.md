[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / TevmState

# Type Alias: TevmState

> **TevmState** = `object`

Defined in: packages/state/src/state-types/TevmState.ts:21

A map of Ethereum addresses to their account storage data.
Represents the entire state of an Ethereum network at a given point.

## Index Signature

\[`key`: `` `0x${string}` ``\]: [`AccountStorage`](../interfaces/AccountStorage.md)

## Example

```typescript
import { TevmState } from '@tevm/state'

const value: TevmState = {
  '0x1234567890123456789012345678901234567890': {
    nonce: 0n,
    balance: 10000000000000000000n,
    storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
  }
}
```
