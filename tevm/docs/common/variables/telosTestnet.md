[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / telosTestnet

# Variable: telosTestnet

> `const` **telosTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/telosTestnet.d.ts:21

Creates a common configuration for the telosTestnet chain.

## Description

Chain ID: 41
Chain Name: Telos
Default Block Explorer: https://testnet.teloscan.io/
Default RPC URL: https://testnet.telos.net/evm

## Example

```ts
import { createMemoryClient } from 'tevm'
import { telosTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: telosTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
