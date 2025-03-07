[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / xdcTestnet

# Variable: xdcTestnet

> `const` **xdcTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/xdcTestnet.d.ts:21

Creates a common configuration for the xdcTestnet chain.

## Description

Chain ID: 51
Chain Name: Apothem Network
Default Block Explorer: https://apothem.blocksscan.io
Default RPC URL: https://erpc.apothem.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xdcTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xdcTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
