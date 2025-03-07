[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / syscoinTestnet

# Variable: syscoinTestnet

> `const` **syscoinTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/syscoinTestnet.d.ts:21

Creates a common configuration for the syscoinTestnet chain.

## Description

Chain ID: 5700
Chain Name: Syscoin Tanenbaum Testnet
Default Block Explorer: https://tanenbaum.io
Default RPC URL: https://rpc.tanenbaum.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { syscoinTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: syscoinTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
