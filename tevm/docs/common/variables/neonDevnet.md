[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / neonDevnet

# Variable: neonDevnet

> `const` **neonDevnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/neonDevnet.d.ts:21

Creates a common configuration for the neonDevnet chain.

## Description

Chain ID: 245022926
Chain Name: Neon EVM DevNet
Default Block Explorer: https://devnet.neonscan.org
Default RPC URL: https://devnet.neonevm.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { neonDevnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: neonDevnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
