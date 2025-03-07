[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / luksoTestnet

# Variable: luksoTestnet

> `const` **luksoTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/luksoTestnet.d.ts:21

Creates a common configuration for the luksoTestnet chain.

## Description

Chain ID: 4201
Chain Name: LUKSO Testnet
Default Block Explorer: https://explorer.execution.testnet.lukso.network
Default RPC URL: https://rpc.testnet.lukso.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { luksoTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: luksoTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
