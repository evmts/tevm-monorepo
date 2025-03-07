[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / seiDevnet

# Variable: seiDevnet

> `const` **seiDevnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/seiDevnet.d.ts:21

Creates a common configuration for the seiDevnet chain.

## Description

Chain ID: 713715
Chain Name: Sei Devnet
Default Block Explorer: https://seitrace.com
Default RPC URL: https://evm-rpc-arctic-1.sei-apis.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { seiDevnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: seiDevnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
