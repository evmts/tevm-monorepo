[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dreyerxTestnet

# Variable: dreyerxTestnet

> `const` **dreyerxTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dreyerxTestnet.d.ts:21

Creates a common configuration for the dreyerxTestnet chain.

## Description

Chain ID: 23452
Chain Name: DreyerX Testnet
Default Block Explorer: https://testnet-scan.dreyerx.com
Default RPC URL: http://testnet-rpc.dreyerx.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dreyerxTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dreyerxTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
