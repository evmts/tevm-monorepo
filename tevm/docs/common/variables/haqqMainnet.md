[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / haqqMainnet

# Variable: haqqMainnet

> `const` **haqqMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/haqqMainnet.d.ts:21

Creates a common configuration for the haqqMainnet chain.

## Description

Chain ID: 11235
Chain Name: HAQQ Mainnet
Default Block Explorer: https://explorer.haqq.network
Default RPC URL: https://rpc.eth.haqq.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { haqqMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: haqqMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
