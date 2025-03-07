[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / eosTestnet

# Variable: eosTestnet

> `const` **eosTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/eosTestnet.d.ts:21

Creates a common configuration for the eosTestnet chain.

## Description

Chain ID: 15557
Chain Name: EOS EVM Testnet
Default Block Explorer: https://explorer.testnet.evm.eosnetwork.com
Default RPC URL: https://api.testnet.evm.eosnetwork.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { eosTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: eosTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
