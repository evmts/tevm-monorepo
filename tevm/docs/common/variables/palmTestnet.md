[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / palmTestnet

# Variable: palmTestnet

> `const` **palmTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/palmTestnet.d.ts:21

Creates a common configuration for the palmTestnet chain.

## Description

Chain ID: 11297108099
Chain Name: Palm Testnet
Default Block Explorer: https://palm.chainlens.com
Default RPC URL: https://palm-mainnet.public.blastapi.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { palmTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: palmTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
