[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / hederaTestnet

# Variable: hederaTestnet

> `const` **hederaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/hederaTestnet.d.ts:21

Creates a common configuration for the hederaTestnet chain.

## Description

Chain ID: 296
Chain Name: Hedera Testnet
Default Block Explorer: https://hashscan.io/testnet
Default RPC URL: https://testnet.hashio.io/api

## Example

```ts
import { createMemoryClient } from 'tevm'
import { hederaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: hederaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
