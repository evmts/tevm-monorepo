[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fluenceTestnet

# Variable: fluenceTestnet

> `const` **fluenceTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fluenceTestnet.d.ts:21

Creates a common configuration for the fluenceTestnet chain.

## Description

Chain ID: 52164803
Chain Name: Fluence Testnet
Default Block Explorer: https://blockscout.testnet.fluence.dev
Default RPC URL: https://rpc.testnet.fluence.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fluenceTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fluenceTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
