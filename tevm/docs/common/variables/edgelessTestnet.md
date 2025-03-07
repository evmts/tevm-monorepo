[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / edgelessTestnet

# Variable: edgelessTestnet

> `const` **edgelessTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/edgelessTestnet.d.ts:21

Creates a common configuration for the edgelessTestnet chain.

## Description

Chain ID: 202
Chain Name: Edgeless Testnet
Default Block Explorer: https://testnet.explorer.edgeless.network
Default RPC URL: https://edgeless-testnet.rpc.caldera.xyz/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { edgelessTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: edgelessTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
