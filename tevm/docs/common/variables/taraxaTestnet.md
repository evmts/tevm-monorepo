[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / taraxaTestnet

# Variable: taraxaTestnet

> `const` **taraxaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/taraxaTestnet.d.ts:21

Creates a common configuration for the taraxaTestnet chain.

## Description

Chain ID: 842
Chain Name: Taraxa Testnet
Default Block Explorer: https://explorer.testnet.taraxa.io
Default RPC URL: https://rpc.testnet.taraxa.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taraxaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taraxaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
