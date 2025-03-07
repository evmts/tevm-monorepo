[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleCalypsoTestnet

# Variable: skaleCalypsoTestnet

> `const` **skaleCalypsoTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleCalypsoTestnet.d.ts:21

Creates a common configuration for the skaleCalypsoTestnet chain.

## Description

Chain ID: 974399131
Chain Name: SKALE Calypso Testnet
Default Block Explorer: https://giant-half-dual-testnet.explorer.testnet.skalenodes.com
Default RPC URL: https://testnet.skalenodes.com/v1/giant-half-dual-testnet

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleCalypsoTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleCalypsoTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
