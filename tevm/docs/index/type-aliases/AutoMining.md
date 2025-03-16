[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AutoMining

# Type Alias: AutoMining

> **AutoMining**: `object`

Defined in: packages/node/dist/index.d.ts:152

Mining configuration that automatically mines blocks for every transaction.
Each transaction is immediately included in its own block.

## Type declaration

### type

> **type**: `"auto"`

## Example

```typescript
import { AutoMining } from '@tevm/node'

const value: AutoMining = {
  type: 'auto'
}
```
