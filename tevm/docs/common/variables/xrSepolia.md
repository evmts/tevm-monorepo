[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / xrSepolia

# Variable: xrSepolia

> `const` **xrSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/xrSepolia.d.ts:21

Creates a common configuration for the xrSepolia chain.

## Description

Chain ID: 2730
Chain Name: XR Sepolia
Default Block Explorer: https://xr-sepolia-testnet.explorer.caldera.xyz
Default RPC URL: https://xr-sepolia-testnet.rpc.caldera.xyz/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xrSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xrSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
