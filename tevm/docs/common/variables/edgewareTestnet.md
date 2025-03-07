[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / edgewareTestnet

# Variable: edgewareTestnet

> `const` **edgewareTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/edgewareTestnet.d.ts:21

Creates a common configuration for the edgewareTestnet chain.

## Description

Chain ID: 2022
Chain Name: Beresheet BereEVM Testnet
Default Block Explorer: https://testnet.edgscan.live
Default RPC URL: https://beresheet-evm.jelliedowl.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { edgewareTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: edgewareTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
