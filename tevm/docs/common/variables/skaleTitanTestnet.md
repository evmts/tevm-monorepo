[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleTitanTestnet

# Variable: skaleTitanTestnet

> `const` **skaleTitanTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleTitanTestnet.d.ts:21

Creates a common configuration for the skaleTitanTestnet chain.

## Description

Chain ID: 1020352220
Chain Name: SKALE Titan Hub
Default Block Explorer: https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com
Default RPC URL: https://testnet.skalenodes.com/v1/aware-fake-trim-testnet

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleTitanTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleTitanTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
