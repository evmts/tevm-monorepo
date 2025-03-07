[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / oasisTestnet

# Variable: oasisTestnet

> `const` **oasisTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/oasisTestnet.d.ts:21

Creates a common configuration for the oasisTestnet chain.

## Description

Chain ID: 4090
Chain Name: Oasis Testnet
Default Block Explorer: https://oasis.ftnscan.com
Default RPC URL: https://rpc1.oasis.bahamutchain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { oasisTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: oasisTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
