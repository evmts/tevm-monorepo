[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / eos

# Variable: eos

> `const` **eos**: `Common`

Creates a common configuration for the eos chain.

## Description

Chain ID: 17777
Chain Name: EOS EVM
Default Block Explorer: https://explorer.evm.eosnetwork.com
Default RPC URL: https://api.evm.eosnetwork.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { eos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: eos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/eos.d.ts:21
