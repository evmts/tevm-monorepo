[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / funkiSepolia

# Variable: funkiSepolia

> `const` **funkiSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/funkiSepolia.d.ts:21

Creates a common configuration for the funkiSepolia chain.

## Description

Chain ID: 3397901
Chain Name: Funki Sepolia Sandbox
Default Block Explorer: https://sepolia-sandbox.funkichain.com/
Default RPC URL: https://funki-testnet.alt.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { funkiSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: funkiSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
