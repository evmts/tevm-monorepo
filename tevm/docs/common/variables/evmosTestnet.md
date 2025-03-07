[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / evmosTestnet

# Variable: evmosTestnet

> `const` **evmosTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/evmosTestnet.d.ts:21

Creates a common configuration for the evmosTestnet chain.

## Description

Chain ID: 9000
Chain Name: Evmos Testnet
Default Block Explorer: https://evm.evmos.dev/
Default RPC URL: https://eth.bd.evmos.dev:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { evmosTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: evmosTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
