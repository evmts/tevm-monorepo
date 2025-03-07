[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / modeTestnet

# Variable: modeTestnet

> `const` **modeTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/modeTestnet.d.ts:21

Creates a common configuration for the modeTestnet chain.

## Description

Chain ID: 919
Chain Name: Mode Testnet
Default Block Explorer: https://sepolia.explorer.mode.network
Default RPC URL: https://sepolia.mode.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { modeTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: modeTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
