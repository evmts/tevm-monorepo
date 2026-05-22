[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AutoMining

# Type Alias: AutoMining

> **AutoMining** = `object`

Mining configuration that automatically mines blocks for every transaction.
Each transaction is immediately included in its own block.

## Example

```typescript
import { AutoMining } from '@tevm/node'

const value: AutoMining = {
  type: 'auto'
}
```

## Properties

| Property | Type |
| ------ | ------ |
| <a id="type"></a> `type` | `"auto"` |
