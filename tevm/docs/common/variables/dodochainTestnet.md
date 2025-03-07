[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dodochainTestnet

# Variable: dodochainTestnet

> `const` **dodochainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dodochainTestnet.d.ts:21

Creates a common configuration for the dodochainTestnet chain.

## Description

Chain ID: 53457
Chain Name: DODOchain Testnet
Default Block Explorer: https://testnet-scan.dodochain.com
Default RPC URL: https://dodochain-testnet.alt.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dodochainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dodochainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
