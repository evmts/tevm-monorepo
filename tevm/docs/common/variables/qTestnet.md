[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / qTestnet

# Variable: qTestnet

> `const` **qTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/qTestnet.d.ts:21

Creates a common configuration for the qTestnet chain.

## Description

Chain ID: 35443
Chain Name: Q Testnet
Default Block Explorer: https://explorer.qtestnet.org
Default RPC URL: https://rpc.qtestnet.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { qTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: qTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
