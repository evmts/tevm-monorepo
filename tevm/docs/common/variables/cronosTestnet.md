[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / cronosTestnet

# Variable: cronosTestnet

> `const` **cronosTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/cronosTestnet.d.ts:21

Creates a common configuration for the cronosTestnet chain.

## Description

Chain ID: 338
Chain Name: Cronos Testnet
Default Block Explorer: https://cronos.org/explorer/testnet3
Default RPC URL: https://evm-t3.cronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cronosTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cronosTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
