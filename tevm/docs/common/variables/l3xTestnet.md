[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / l3xTestnet

# Variable: l3xTestnet

> `const` **l3xTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/l3xTestnet.d.ts:21

Creates a common configuration for the l3xTestnet chain.

## Description

Chain ID: 12325
Chain Name: L3X Protocol Testnet
Default Block Explorer: https://explorer-testnet.l3x.com
Default RPC URL: https://rpc-testnet.l3x.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { l3xTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: l3xTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
