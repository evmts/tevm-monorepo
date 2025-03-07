[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zetachainAthensTestnet

# Variable: zetachainAthensTestnet

> `const` **zetachainAthensTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zetachainAthensTestnet.d.ts:21

Creates a common configuration for the zetachainAthensTestnet chain.

## Description

Chain ID: 7001
Chain Name: ZetaChain Athens Testnet
Default Block Explorer: https://athens.explorer.zetachain.com
Default RPC URL: https://zetachain-athens-evm.blockpi.network/v1/rpc/public

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zetachainAthensTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zetachainAthensTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
