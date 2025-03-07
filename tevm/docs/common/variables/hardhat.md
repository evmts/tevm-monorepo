[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / hardhat

# Variable: hardhat

> `const` **hardhat**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/hardhat.d.ts:21

Creates a common configuration for the hardhat chain.

## Description

Chain ID: 31337
Chain Name: Hardhat
Default Block Explorer: Not specified
Default RPC URL: http://127.0.0.1:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { hardhat } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: hardhat,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
