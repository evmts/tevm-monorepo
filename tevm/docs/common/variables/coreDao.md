[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / coreDao

# Variable: coreDao

> `const` **coreDao**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/coreDao.d.ts:21

Creates a common configuration for the coreDao chain.

## Description

Chain ID: 1116
Chain Name: Core Dao
Default Block Explorer: https://scan.coredao.org
Default RPC URL: https://rpc.coredao.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { coreDao } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: coreDao,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
