[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / polygonZkEvmTestnet

# Variable: polygonZkEvmTestnet

> `const` **polygonZkEvmTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/polygonZkEvmTestnet.d.ts:21

Creates a common configuration for the polygonZkEvmTestnet chain.

## Description

Chain ID: 1442
Chain Name: Polygon zkEVM Testnet
Default Block Explorer: https://testnet-zkevm.polygonscan.com
Default RPC URL: https://rpc.public.zkevm-test.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygonZkEvmTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygonZkEvmTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
