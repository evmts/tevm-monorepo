[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / klaytn

# Variable: klaytn

> `const` **klaytn**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/klaytn.d.ts:21

Creates a common configuration for the klaytn chain.

## Description

Chain ID: 8217
Chain Name: Klaytn
Default Block Explorer: https://scope.klaytn.com
Default RPC URL: https://public-en-cypress.klaytn.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { klaytn } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: klaytn,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
