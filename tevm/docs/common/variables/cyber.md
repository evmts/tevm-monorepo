[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / cyber

# Variable: cyber

> `const` **cyber**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/cyber.d.ts:21

Creates a common configuration for the cyber chain.

## Description

Chain ID: 7560
Chain Name: Cyber
Default Block Explorer: https://cyberscan.co
Default RPC URL: https://cyber.alt.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cyber } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cyber,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
