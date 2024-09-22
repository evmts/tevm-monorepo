[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / goerli

# Variable: goerli

> `const` **goerli**: `Common`

Creates a common configuration for the goerli chain.

## Description

Chain ID: 5
Chain Name: Goerli
Default Block Explorer: https://goerli.etherscan.io
Default RPC URL: https://rpc.ankr.com/eth_goerli

## Example

```ts
import { createMemoryClient } from 'tevm'
import { goerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: goerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/goerli.d.ts:21
