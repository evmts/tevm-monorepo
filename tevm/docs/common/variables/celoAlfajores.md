[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / celoAlfajores

# Variable: celoAlfajores

> `const` **celoAlfajores**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/celoAlfajores.d.ts:21

Creates a common configuration for the celoAlfajores chain.

## Description

Chain ID: 44787
Chain Name: Alfajores
Default Block Explorer: https://explorer.celo.org/alfajores
Default RPC URL: https://alfajores-forno.celo-testnet.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { celoAlfajores } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: celoAlfajores,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
