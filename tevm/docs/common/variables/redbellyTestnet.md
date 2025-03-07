[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / redbellyTestnet

# Variable: redbellyTestnet

> `const` **redbellyTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/redbellyTestnet.d.ts:21

Creates a common configuration for the redbellyTestnet chain.

## Description

Chain ID: 153
Chain Name: Redbelly Network Testnet
Default Block Explorer: https://explorer.testnet.redbelly.network
Default RPC URL: https://governors.testnet.redbelly.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { redbellyTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: redbellyTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
