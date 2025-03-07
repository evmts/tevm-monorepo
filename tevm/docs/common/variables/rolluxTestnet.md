[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / rolluxTestnet

# Variable: rolluxTestnet

> `const` **rolluxTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/rolluxTestnet.d.ts:21

Creates a common configuration for the rolluxTestnet chain.

## Description

Chain ID: 57000
Chain Name: Rollux Testnet
Default Block Explorer: https://rollux.tanenbaum.io
Default RPC URL: https://rpc-tanenbaum.rollux.com/

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rolluxTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rolluxTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
