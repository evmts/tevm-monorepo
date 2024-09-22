[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / seiTestnet

# Variable: seiTestnet

> `const` **seiTestnet**: `Common`

Creates a common configuration for the seiTestnet chain.

## Description

Chain ID: 1328
Chain Name: Sei Testnet
Default Block Explorer: https://seitrace.com
Default RPC URL: https://evm-rpc-testnet.sei-apis.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { seiTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: seiTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/seiTestnet.d.ts:21
